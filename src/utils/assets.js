const BASE = import.meta.env.BASE_URL;

export function img(path) {
  return `${BASE}images/${path}`;
}
