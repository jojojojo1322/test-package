import type { AxiosInstance, AxiosRequestConfig } from "axios";

export type MaybePromise<T> = T | Promise<T>;

export interface TokenManager {
  getAccessToken: () => MaybePromise<string | null | undefined>;
  refreshToken?: () => Promise<string | null>;
  setAccessToken?: (token: string | null) => void;
  clear?: () => void;
  onUnauthorized?: () => void;
}

export type RefreshQueueItem = {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
};

export interface ApiClientOptions {
  baseURL?: string;
  tokenManager?: TokenManager;
  defaultHeaders?: Record<string, string>;
  axiosConfig?: AxiosRequestConfig;
}

export interface InMemoryTokenManagerOptions {
  accessToken?: string | null;
  refresh?: () => Promise<string | null>;
  onUnauthorized?: () => void;
}

export type ManagedAxiosInstance = AxiosInstance & {
  setTokenManager: (manager?: TokenManager) => void;
};
