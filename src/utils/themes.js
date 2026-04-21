export const THEMES = [
  { bg: "#7B68EE", blob: "#9B8BFF", accent: "#6A5ACD", badge: "#8B5CF6", name: "purple" },
  { bg: "#4FC3F7", blob: "#81D4FA", accent: "#29B6F6", badge: "#0288D1", name: "blue" },
  { bg: "#E879A8", blob: "#F48FB1", accent: "#EC407A", badge: "#D81B60", name: "pink" },
  { bg: "#66BB6A", blob: "#81C784", accent: "#43A047", badge: "#2E7D32", name: "green" },
  { bg: "#FFB74D", blob: "#FFCC80", accent: "#FFA726", badge: "#F57C00", name: "orange" },
  { bg: "#7ECDC0", blob: "#80CBC4", accent: "#4DB6AC", badge: "#00897B", name: "teal" },
  { bg: "#BA68C8", blob: "#CE93D8", accent: "#AB47BC", badge: "#8E24AA", name: "violet" },
  { bg: "#EF5350", blob: "#EF9A9A", accent: "#E53935", badge: "#C62828", name: "red" },
];

export function getTheme(index) {
  return THEMES[index % THEMES.length];
}
