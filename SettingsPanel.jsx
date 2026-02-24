import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Monitor, Sun, Moon, Upload, Download, Trash2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';

export default function SettingsPanel({ open, onClose, theme, onThemeChange, stats }) {
  const queryClient = useQueryClient();

  const handleExport = async () => {
    try {
      const notes = await base44.entities.Note.list();
      const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mindspace_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleClearAll = async () => {
    if (!confirm(`Effacer toutes les ${stats.total} notes ?`)) return;
    try {
      const notes = await base44.entities.Note.list();
      for (const note of notes) {
        await base44.entities.Note.delete(note.id);
      }
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    } catch (err) {
      console.error('Clear failed:', err);
    }
  };

  const themeButtons = [
    { id: 'system', icon: Monitor, label: 'Système' },
    { id: 'light', icon: Sun, label: 'Clair' },
    { id: 'dark', icon: Moon, label: 'Sombre' },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed inset-0 z-[11000] bg-white dark:bg-slate-900 flex flex-col"
        >
          {/* Top Bar */}
          <div className="flex items-center gap-2 px-4 pt-5 pb-3">
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Réglages</h1>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-10">
            {/* Stats Cards */}
            <div className="flex gap-2 mt-4 mb-6">
              <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 text-center border border-slate-200 dark:border-slate-700">
                <div className="text-2xl font-bold text-blue-500">{stats.total}</div>
                <div className="text-xs text-slate-500 mt-1">Notes</div>
              </div>
              <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 text-center border border-slate-200 dark:border-slate-700">
                <div className="text-2xl font-bold text-blue-500">{stats.pinned}</div>
                <div className="text-xs text-slate-500 mt-1">Épinglées</div>
              </div>
              <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 text-center border border-slate-200 dark:border-slate-700">
                <div className="text-2xl font-bold text-blue-500">{stats.media}</div>
                <div className="text-xs text-slate-500 mt-1">Médias</div>
              </div>
            </div>

            {/* Appearance */}
            <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wider px-4 mb-3">
              Apparence
            </h3>
            <div className="flex gap-2 mb-6">
              {themeButtons.map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => onThemeChange(btn.id)}
                  className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl border-2 transition-all ${
                    theme === btn.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  <btn.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{btn.label}</span>
                </button>
              ))}
            </div>

            {/* Data */}
            <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wider px-4 mb-3">
              Données
            </h3>
            <div className="space-y-1 mb-6">
              <button
                onClick={handleExport}
                className="w-full flex items-center gap-4 px-4 h-14 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-slate-900 dark:text-white">Exporter les notes</div>
                  <div className="text-xs text-slate-500">Sauvegarde JSON</div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Danger Zone */}
            <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wider px-4 mb-3">
              Zone de danger
            </h3>
            <button
              onClick={handleClearAll}
              className="w-full flex items-center gap-4 px-4 h-14 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-rose-600">Tout effacer</div>
                <div className="text-xs text-slate-500">Supprime toutes les notes</div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>

            <p className="text-center text-xs text-slate-400 mt-10">
              Mind Space · v2.0 · Material Design 3
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
