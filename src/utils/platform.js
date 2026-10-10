import { Capacitor } from '@capacitor/core';

export function isNativePlatform() {
  return Capacitor.isNativePlatform();
}

/** Open an external URL in the system browser (SFSafariViewController / Custom Tabs) on native. */
export async function openInSystemBrowser(url) {
  const { Browser } = await import('@capacitor/browser');
  await Browser.open({ url });
}
