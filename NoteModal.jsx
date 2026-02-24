import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Pin, Trash2, Mic, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';

export default function NoteModal({ open, onClose, type, note, onSave, onDelete, onTogglePin }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setMediaUrl(note.media_url || '');
    } else {
      setTitle('');
      setContent('');
      setMediaUrl('');
    }
  }, [note, open]);

  const handleSave = () => {
    onSave({
      title,
      content,
      type,
      media_url: mediaUrl || null,
      pinned: note?.pinned || false,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setMediaUrl(file_url);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        audioChunksRef.current = [];

        recorder.ondataavailable = (e) => {
          audioChunksRef.current.push(e.data);
        };

        recorder.onstop = async () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const file = new File([blob], 'recording.webm', { type: 'audio/webm' });
          try {
            const { file_url } = await base44.integrations.Core.UploadFile({ file });
            setMediaUrl(file_url);
          } catch (err) {
            console.error('Upload failed:', err);
          }
          stream.getTracks().forEach(t => t.stop());
        };

        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
      } catch (err) {
        alert('Microphone non accessible');
      }
    } else {
      mediaRecorder?.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const isVocale = type === 'vocale';
  const isImage = type === 'image';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[10000] bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm flex items-end"
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-h-[92vh] bg-white dark:bg-slate-900 rounded-t-[28px] shadow-2xl overflow-y-auto"
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-8 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
            </div>

            <div className="px-6 pb-8 flex flex-col gap-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {note ? 'Modifier la note' : 'Nouvelle note'}
                </h2>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Title */}
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre (optionnel)"
                className="h-12 rounded-xl border-slate-200 dark:border-slate-700"
              />

              {/* Image Preview */}
              {isImage && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {mediaUrl ? (
                    <img src={mediaUrl} alt="" className="w-full max-h-52 object-cover rounded-2xl" />
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                      className="h-32 rounded-2xl border-dashed"
                    >
                      Choisir une image
                    </Button>
                  )}
                </>
              )}

              {/* Audio Controls */}
              {isVocale && (
                <>
                  <Button
                    onClick={toggleRecording}
                    className={`h-14 rounded-full font-medium ${
                      isRecording 
                        ? 'bg-rose-100 text-rose-600 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-400' 
                        : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400'
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <Square className="w-5 h-5 mr-2" />
                        Arrêter
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5 mr-2" />
                        Enregistrer
                      </>
                    )}
                  </Button>
                  {mediaUrl && (
                    <audio src={mediaUrl} controls className="w-full h-12 rounded-xl" />
                  )}
                </>
              )}

              {/* Content */}
              {!isVocale && (
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Contenu de la note..."
                  rows={5}
                  className="rounded-xl border-slate-200 dark:border-slate-700 resize-none"
                />
              )}

              {/* Save Button */}
              <Button
                onClick={handleSave}
                className="h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-medium shadow-lg shadow-blue-500/25"
              >
                Enregistrer
              </Button>

              {/* Edit Actions */}
              {note && (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={onTogglePin}
                    className={`flex-1 h-12 rounded-full ${
                      note.pinned 
                        ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/30 dark:border-blue-700' 
                        : ''
                    }`}
                  >
                    <Pin className="w-4 h-4 mr-2" />
                    {note.pinned ? 'Désépingler' : 'Épingler'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onDelete}
                    className="flex-1 h-12 rounded-full bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100 dark:bg-rose-900/30 dark:border-rose-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
