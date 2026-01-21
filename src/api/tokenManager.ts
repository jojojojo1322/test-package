import type { InMemoryTokenManagerOptions, TokenManager } from "./types";

export const createInMemoryTokenManager = (
  options: InMemoryTokenManagerOptions = {}
): TokenManager => {
  let accessToken = options.accessToken ?? null;

  return {
    getAccessToken: () => accessToken,
    refreshToken: options.refresh
      ? async () => {
          accessToken = await options.refresh!();
          return accessToken;
        }
      : undefined,
    setAccessToken: (token) => {
      accessToken = token;
    },
    clear: () => {
      accessToken = null;
    },
    onUnauthorized: options.onUnauthorized,
  };
};
