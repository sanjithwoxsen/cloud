import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { X, Save, FileText } from 'lucide-react';
import { Note, NoteFormData } from '@/lib/schemas';

interface NoteEditorProps {
  note?: Note;
  onSave: (data: NoteFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function NoteEditor({ note, onSave, onCancel, isLoading = false }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const originalTitle = note?.title || '';
    const originalContent = note?.content || '';
    setHasChanges(title !== originalTitle || content !== originalContent);
  }, [title, content, note]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    
    await onSave({ title: title.trim(), content: content.trim() });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    } else if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (hasChanges && !isLoading) {
        handleSubmit(e as any);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-4xl max-h-[90vh] backdrop-blur-glass bg-gradient-glass border-glass-border shadow-elegant rounded-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-glass-border">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {note ? 'Edit Note' : 'Create New Note'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {note ? 'Make changes to your note' : 'Start writing your thoughts'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!hasChanges || isLoading || !title.trim() || !content.trim()}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {note ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <Input
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-semibold border-0 bg-transparent px-0 focus-visible:ring-0 placeholder:text-muted-foreground/60"
              disabled={isLoading}
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Textarea
              placeholder="Start writing your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[400px] border-0 bg-transparent px-0 focus-visible:ring-0 resize-none text-base leading-relaxed placeholder:text-muted-foreground/60"
              disabled={isLoading}
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-glass-border bg-glass/30">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span>{title.length}/100 characters</span>
              <span>{content.split(' ').filter(word => word.length > 0).length} words</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Press</span>
              <kbd className="px-2 py-1 text-xs bg-muted rounded">Esc</kbd>
              <span>to cancel,</span>
              <kbd className="px-2 py-1 text-xs bg-muted rounded">⌘+S</kbd>
              <span>to save</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}