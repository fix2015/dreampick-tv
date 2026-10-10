/** "CHOOSE YOUR TREEHOUSE" -> "treehouse" */
export function promptNoun(prompt) {
  return prompt.replace(/^CHOOSE YOUR\s+/i, '').toLowerCase();
}

export function duoAgreed(result) {
  return result.p1 === result.p2;
}
