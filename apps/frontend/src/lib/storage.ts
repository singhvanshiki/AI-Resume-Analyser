const noopStorage: Storage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  key: () => null,
  length: 0,
};

export const safeStorage: Storage =
  typeof window !== "undefined" ? window.localStorage : noopStorage;
