const rawBase = import.meta.env.BASE_URL || "/";

export const basePath = rawBase.endsWith("/") ? rawBase : `${rawBase}/`;

export function withBasePath(path: string) {
  const cleanPath = path.replace(/^\/+/, "");
  return cleanPath ? `${basePath}${cleanPath}` : basePath;
}
