import React from 'react';
import { motion } from 'framer-motion';

const AnimatedList = ({
  items,
  onItemSelect,
  showGradients = false,
  enableArrowNavigation = false,
  displayScrollbar = false,
  className = '',
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.ul
      className={`flex flex-col gap-3 ${displayScrollbar ? 'overflow-y-auto max-h-96 pr-2 custom-scrollbar' : ''} ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((item, index) => (
        <motion.li
          key={index}
          variants={itemVariants}
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onItemSelect && onItemSelect(item, index)}
          className={`
            p-4 rounded-xl cursor-pointer shadow-sm border border-slate-100
            transition-all duration-200
            ${showGradients ? 'bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100' : 'bg-white hover:bg-slate-50'}
          `}
        >
          <span className="text-slate-800 font-medium">
            {typeof item === 'string' ? item : item.suggestion || item.title || item.name || 'Item'}
          </span>
        </motion.li>
      ))}
    </motion.ul>
  );
};

export default AnimatedList;
