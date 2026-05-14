import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export function AnimatedCounter({ value, duration = 1.5, suffix = '', prefix = '', className }) {
  const isNumber = typeof value === 'number';
  const numericValue = isNumber ? value : parseFloat(value.toString().replace(/[^0-9.]/g, ''));
  const originalString = value.toString();
  const hasPercent = originalString.includes('%');
  
  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  });

  useEffect(() => {
    spring.set(numericValue);
  }, [numericValue, spring]);

  const display = useTransform(spring, (current) => {
    const rounded = hasPercent || current % 1 !== 0 
      ? current.toFixed(1) 
      : Math.floor(current);
    return `${prefix}${rounded}${hasPercent ? '%' : suffix}`;
  });

  return <motion.span className={className}>{display}</motion.span>;
}
