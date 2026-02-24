import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Image, Mic } from 'lucide-react';

const actions = [
  { type: 'écrit', icon: FileText, label: 'Note écrite' },
  { type: 'image', icon: Image, label: 'Image' },
  { type: 'vocale', icon: Mic, label: 'Note vocale' },
];

export default function SpeedDial({ open, onClose, onSelectType }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9050] bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
          />

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed left-4 right-4 bottom-24 z-[9060] flex flex-col gap-3"
          >
            {actions.map((action, i) => (
              <motion.button
                key={action.type}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectType(action.type)}
                className="flex items-center gap-4 h-[60px] px-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-900/10 dark:shadow-slate-950/30"
              >
                <action.icon className="w-6 h-6 text-blue-500" />
                <span className="text-base font-semibold text-slate-900 dark:text-white">{action.label}</span>
              </motion.button>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
