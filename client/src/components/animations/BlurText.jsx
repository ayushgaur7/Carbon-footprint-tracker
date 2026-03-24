import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const BlurText = ({
  text,
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  onAnimationComplete,
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (isAnimationComplete && onAnimationComplete) {
      onAnimationComplete();
    }
  }, [isAnimationComplete, onAnimationComplete]);

  const defaultVariants = {
    hidden: { filter: 'blur(10px)', opacity: 0, y: direction === 'top' ? -20 : 20 },
    visible: { filter: 'blur(0px)', opacity: 1, y: 0 },
  };

  return (
    <p ref={ref} className={`flex flex-wrap ${className}`}>
      {elements.map((element, index) => (
        <motion.span
          key={index}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={defaultVariants}
          transition={{
            delay: index * (delay / 1000),
            duration: 0.6,
            ease: 'easeOut',
          }}
          onAnimationComplete={() => {
            if (index === elements.length - 1) {
              setIsAnimationComplete(true);
            }
          }}
          className="inline-block"
          style={{ marginRight: animateBy === 'words' ? '0.25em' : '0' }}
        >
          {element === ' ' ? '\u00A0' : element}
          {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </p>
  );
};

export default BlurText;
