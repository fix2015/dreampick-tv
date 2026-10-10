import { useState } from 'react';
import { motion } from 'framer-motion';
import ParentalGate from './ParentalGate';
import { isNativePlatform, openInSystemBrowser } from '../utils/platform';

const YOUTUBE_URL = 'https://www.youtube.com/@DreamPickTV?sub_confirmation=1';

/**
 * Link to the YouTube channel.
 * Web: plain target="_blank" link.
 * Native: parental gate first, then the system browser via @capacitor/browser.
 */
export default function YouTubeLink({ className, style, children }) {
  const [gateOpen, setGateOpen] = useState(false);

  const handleClick = (e) => {
    if (!isNativePlatform()) return;
    e.preventDefault();
    setGateOpen(true);
  };

  const handlePass = () => {
    setGateOpen(false);
    openInSystemBrowser(YOUTUBE_URL).catch(() => {});
  };

  return (
    <>
      <motion.a
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        href={YOUTUBE_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={className}
        style={style}
      >
        {children}
      </motion.a>
      {gateOpen && (
        <ParentalGate onPass={handlePass} onCancel={() => setGateOpen(false)} />
      )}
    </>
  );
}
