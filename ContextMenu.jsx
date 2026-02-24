import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Pin, Copy, Trash2 } from 'lucide-react';

export default function ContextMenu({ open, x, y, note, onClose, onOpen, onPin, onDuplicate, onDelete }) {
  if (!note) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-[49999]" 
            onClick={onClose}
          />

          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            style={{
              left: Math.min(x, window.innerWidth - 220),
              top: Math.min(y, window.innerHeight - 240),
            }}
            className="fixed z-[50000] min-w-[200px] bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl py-2 overflow-hidden"
          >
            <button
              onClick={onOpen}
              className="w-full flex items-center gap-3 px-4 h-12 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
            >
              <ExternalLink className="w-5 h-5 text-slate-500" />
              <span className="text-sm text-slate-900 dark:text-white">Ouvrir</span>
            </button>

            <button
              onClick={onPin}
              className="w-full flex items-center gap-3 px-4 h-12 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
            >
              <Pin className="w-5 h-5 text-slate-500" />
              <span className="text-sm text-slate-900 dark:text-white">
                {note.pinned ? 'Désépingler' : 'Épingler'}
              </span>
            </button>

            <button
              onClick={onDuplicate}
              className="w-full flex items-center gap-3 px-4 h-12 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
            >
              <Copy className="w-5 h-5 text-slate-500" />
              <span className="text-sm text-slate-900 dark:text-white">Dupliquer</span>
            </button>

            <div className="h-px bg-slate-200 dark:bg-slate-700 my-2" />

            <button
              onClick={onDelete}
              className="w-full flex items-center gap-3 px-4 h-12 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
            >
              <Trash2 className="w-5 h-5 text-rose-500" />
              <span className="text-sm text-rose-500">Supprimer</span>
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
