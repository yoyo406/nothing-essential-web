import React from 'react';
import { motion } from 'framer-motion';
import { Pin, Mic, FileText } from 'lucide-react';
import { format, isToday, isYesterday, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';

const colorAccents = {
  a: 'bg-violet-500',
  b: 'bg-emerald-500',
  c: 'bg-rose-500',
  d: 'bg-blue-500',
  e: 'bg-amber-500',
  f: 'bg-teal-500',
};

const colorAccentsDark = {
  a: 'bg-violet-400',
  b: 'bg-emerald-400',
  c: 'bg-rose-400',
  d: 'bg-blue-400',
  e: 'bg-amber-400',
  f: 'bg-teal-400',
};

function relativeTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isToday(date)) return "Aujourd'hui";
  if (isYesterday(date)) return 'Hier';
  const diff = differenceInDays(new Date(), date);
  if (diff < 7) return `Il y a ${diff}j`;
  if (diff < 30) return `Il y a ${Math.floor(diff / 7)} sem`;
  return format(date, 'd MMM', { locale: fr });
}

function WaveformDisplay() {
  const heights = [6, 12, 18, 26, 20, 14, 8, 16, 24, 18, 12, 6, 16, 22, 14];
  return (
    <div className="flex items-end gap-0.5 h-6">
      {heights.map((h, i) => (
        <motion.span
          key={i}
          initial={{ height: 0 }}
          animate={{ height: h }}
          transition={{ delay: i * 0.03, duration: 0.3 }}
          className="w-1 rounded-full bg-blue-500 dark:bg-blue-400 opacity-60"
        />
      ))}
    </div>
  );
}

export default function NoteCard({ note, index, onClick, onContextMenu }) {
  const isImage = note.type === 'image';
  const isAudio = note.type === 'vocale';
  const isWide = isImage || isAudio;
  const colorKey = note.color_key || 'a';
  const title = note.title || (note.content ? note.content.slice(0, 55) : 'Sans titre');
  const time = relativeTime(note.created_date);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      onContextMenu={onContextMenu}
      className={`relative rounded-[20px] overflow-hidden cursor-pointer select-none transition-shadow ${
        isWide ? 'col-span-2' : 'aspect-square'
      } ${
        note.pinned 
          ? 'ring-2 ring-blue-500 dark:ring-blue-400 shadow-xl shadow-blue-500/10' 
          : 'shadow-lg shadow-slate-900/5 dark:shadow-slate-950/30'
      } bg-white dark:bg-slate-800/90`}
    >
      {/* Color Accent Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${colorAccents[colorKey]} dark:${colorAccentsDark[colorKey]} rounded-t-[20px]`} />

      {/* Pin Badge */}
      {note.pinned && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 z-10 w-6 h-6 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center"
        >
          <Pin className="w-3 h-3 text-blue-600 dark:text-blue-400" />
        </motion.div>
      )}

      {/* Image Card */}
      {isImage && note.media_url && (
        <>
          <img 
            src={note.media_url} 
            alt="" 
            className="w-full h-32 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent p-4 pt-10">
            <h3 className="text-sm font-semibold text-white line-clamp-2">{title}</h3>
            <p className="text-[10px] text-white/70 mt-1">{time}</p>
          </div>
        </>
      )}

      {/* Audio Card */}
      {isAudio && (
        <div className="flex flex-col h-full min-h-[110px]">
          <div className="flex-1 p-4 flex flex-col gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 w-fit">
              <Mic className="w-2.5 h-2.5 text-blue-500" />
              <span className="text-[9px] font-bold text-blue-500 uppercase tracking-wider">Vocale</span>
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">{title}</h3>
            <WaveformDisplay />
          </div>
          {note.media_url && (
            <div className="px-4 pb-3">
              <audio 
                src={note.media_url} 
                controls 
                className="w-full h-8 rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
          <div className="px-4 pb-3">
            <p className="text-[10px] text-slate-400">{time}</p>
          </div>
        </div>
      )}

      {/* Text Card */}
      {!isImage && !isAudio && (
        <div className="flex flex-col h-full p-4">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 w-fit mb-2">
            <FileText className="w-2.5 h-2.5 text-blue-500" />
            <span className="text-[9px] font-bold text-blue-500 uppercase tracking-wider">Note</span>
          </span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-5 flex-1">{title}</h3>
          {note.title && note.content && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-2">{note.content}</p>
          )}
          <p className="text-[10px] text-slate-400 mt-auto pt-2">{time}</p>
        </div>
      )}
    </motion.div>
  );
}
