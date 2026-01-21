'use strict';

var axios = require('axios');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var axios__default = /*#__PURE__*/_interopDefault(axios);

// src/api/client.ts
var resolvePromise = (value) => Promise.resolve(value);
var applyAuthHeader = (config, token) => {
  const headers = axios.AxiosHeaders.from(config.headers ?? new axios.AxiosHeaders());
  headers.set("Authorization", `Bearer ${token}`);
  config.headers = headers;
};
var createApiClient = (options = {}) => {
  let tokenManager = options.tokenManager;
  let isRefreshing = false;
  const failedQueue = [];
  const flushQueue = (error, token) => {
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
  const instance = axios__default.default.create({
    baseURL: options.baseURL ?? "/api",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.defaultHeaders
    },
    timeout: 15e3,
    ...options.axiosConfig
  });
  instance.interceptors.request.use(async (config) => {
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
    (response) => response,
    async (error) => {
      const { response } = error;
      const originalRequest = error.config;
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
        tokenManager.refreshToken().then((token) => {
          if (!token) {
            throw new Error("Failed to refresh token: empty payload");
          }
          tokenManager?.setAccessToken?.(token);
          flushQueue(null, token);
        }).catch((refreshError) => {
          flushQueue(refreshError, null);
          tokenManager?.onUnauthorized?.();
          tokenManager?.clear?.();
        }).finally(() => {
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
            resolve(instance(originalRequest));
          },
          reject
        });
      });
    }
  );
  const managedInstance = instance;
  managedInstance.setTokenManager = (manager) => {
    tokenManager = manager;
  };
  return managedInstance;
};

// src/api/tokenManager.ts
var createInMemoryTokenManager = (options = {}) => {
  let accessToken = options.accessToken ?? null;
  return {
    getAccessToken: () => accessToken,
    refreshToken: options.refresh ? async () => {
      accessToken = await options.refresh();
      return accessToken;
    } : void 0,
    setAccessToken: (token) => {
      accessToken = token;
    },
    clear: () => {
      accessToken = null;
    },
    onUnauthorized: options.onUnauthorized
  };
};

exports.createApiClient = createApiClient;
exports.createInMemoryTokenManager = createInMemoryTokenManager;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map