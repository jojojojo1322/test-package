import { AxiosRequestConfig, AxiosInstance } from 'axios';

type MaybePromise<T> = T | Promise<T>;
interface TokenManager {
    getAccessToken: () => MaybePromise<string | null | undefined>;
    refreshToken?: () => Promise<string | null>;
    setAccessToken?: (token: string | null) => void;
    clear?: () => void;
    onUnauthorized?: () => void;
}
interface ApiClientOptions {
    baseURL?: string;
    tokenManager?: TokenManager;
    defaultHeaders?: Record<string, string>;
    axiosConfig?: AxiosRequestConfig;
}
interface InMemoryTokenManagerOptions {
    accessToken?: string | null;
    refresh?: () => Promise<string | null>;
    onUnauthorized?: () => void;
}
type ManagedAxiosInstance = AxiosInstance & {
    setTokenManager: (manager?: TokenManager) => void;
};

declare const createApiClient: (options?: ApiClientOptions) => ManagedAxiosInstance;

declare const createInMemoryTokenManager: (options?: InMemoryTokenManagerOptions) => TokenManager;

export { type ApiClientOptions, type InMemoryTokenManagerOptions, type ManagedAxiosInstance, type TokenManager, createApiClient, createInMemoryTokenManager };
