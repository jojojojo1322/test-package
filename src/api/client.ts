import axios, {
  AxiosHeaders,
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import type {
  ApiClientOptions,
  ManagedAxiosInstance,
  RefreshQueueItem,
  TokenManager,
} from "./types";

type RetriableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const resolvePromise = <T>(value: T | Promise<T>) => Promise.resolve(value);

const applyAuthHeader = (config: InternalAxiosRequestConfig, token: string) => {
  const headers = AxiosHeaders.from(config.headers ?? new AxiosHeaders());
  headers.set("Authorization", `Bearer ${token}`);
  config.headers = headers;
};

export const createApiClient = (options: ApiClientOptions = {}): ManagedAxiosInstance => {
  let tokenManager: TokenManager | undefined = options.tokenManager;
  let isRefreshing = false;
  const failedQueue: RefreshQueueItem[] = [];

  const flushQueue = (error: unknown, token: string | null) => {
    while (failedQueue.length) {
      const queued = failedQueue.shift();
      if (!queued) {
        continue;
      }
      if (error) {
        queued.reject(error);
      } else {
        queued.resolve(token);
      }
    }
  };

  const instance = axios.create({
    baseURL: options.baseURL ?? "/api",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.defaultHeaders,
    },
    timeout: 15_000,
    ...options.axiosConfig,
  });

  instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    if (!tokenManager) {
      return config;
    }

    const token = await resolvePromise(tokenManager.getAccessToken());
    if (token) {
      applyAuthHeader(config, token);
    }

    return config;
  });

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const { response } = error;
      const originalRequest = error.config as RetriableRequestConfig | undefined;

      if (!response || !originalRequest || response.status !== 401 || !tokenManager?.refreshToken) {
        if (response?.status === 401) {
          tokenManager?.onUnauthorized?.();
          tokenManager?.clear?.();
        }
        return Promise.reject(error);
      }

      if (originalRequest._retry) {
        tokenManager?.onUnauthorized?.();
        tokenManager?.clear?.();
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        tokenManager
          .refreshToken()
          .then((token) => {
            if (!token) {
              throw new Error("Failed to refresh token: empty payload");
            }
            tokenManager?.setAccessToken?.(token);
            flushQueue(null, token);
          })
          .catch((refreshError) => {
            flushQueue(refreshError, null);
            tokenManager?.onUnauthorized?.();
            tokenManager?.clear?.();
          })
          .finally(() => {
            isRefreshing = false;
          });
      }

      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            if (!token) {
              reject(error);
              return;
            }
            applyAuthHeader(originalRequest, token);
            originalRequest._retry = true;
            resolve(instance(originalRequest as AxiosRequestConfig));
          },
          reject,
        });
      });
    }
  );

  const managedInstance = instance as ManagedAxiosInstance;
  managedInstance.setTokenManager = (manager?: TokenManager) => {
    tokenManager = manager;
  };

  return managedInstance;
};

export type { ApiClientOptions } from "./types";
