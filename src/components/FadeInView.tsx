import React from 'react';
import { motion } from 'framer-motion';

interface FadeInViewProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Wraps children in a motion.div that fades in + slides up
 * when it first enters the viewport.
 */
const FadeInView: React.FC<FadeInViewProps> = ({
  children,
  className,
  delay = 0,
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.4, delay, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

export default FadeInView;