import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Grid3X3, List, Trash2 } from 'lucide-react';

import { TopNav } from '@/components/TopNav';
import { NoteCard } from '@/components/NoteCard';
import { NoteEditor } from '@/components/NoteEditor';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { useToast } from '@/hooks/use-toast';
import { authApi, notesApi } from '@/lib/api';
import { Note, User, NoteFormData } from '@/lib/schemas';

export default function Notes() {
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authApi.me();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, []);

  // Fetch notes
  const {
    data: notes = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['notes'],
    queryFn: notesApi.list,
    retry: 1,
  });

  // Filter notes based on search query and hide deleted notes
  const filteredNotes = useMemo(() => {
    const visibleNotes = notes.filter((note: Note) => !note.deleted_at);
    if (!searchQuery.trim()) return visibleNotes;
    const query = searchQuery.toLowerCase();
    return visibleNotes.filter(
      (note: Note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    );
  }, [notes, searchQuery]);

  // Create note mutation
  const createNoteMutation = useMutation({
    mutationFn: (data: NoteFormData) => notesApi.create(data as { title: string; content: string }),
    onSuccess: (newNote) => {
      queryClient.setQueryData(['notes'], (old: Note[] = []) => [newNote, ...old]);
      setIsCreating(false);
      toast({
        title: "Note created",
        description: "Your note has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create note",
        description: error.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  // Update note mutation
  const updateNoteMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: NoteFormData }) =>
      notesApi.update(id, data as { title: string; content: string }),
    onSuccess: (updatedNote) => {
      queryClient.setQueryData(['notes'], (old: Note[] = []) =>
        old.map((note) => (note.id === updatedNote.id ? updatedNote : note))
      );
      setEditingNote(null);
      toast({
        title: "Note updated",
        description: "Your note has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update note",
        description: error.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: notesApi.delete,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(['notes'], (old: Note[] = []) =>
        old.filter((note) => note.id !== deletedId)
      );
      setDeleteConfirm(null);
      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete note",
        description: error.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  const handleCreateNote = () => {
    setIsCreating(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
  };

  const handleSaveNote = async (data: NoteFormData) => {
    if (editingNote) {
      await updateNoteMutation.mutateAsync({ id: editingNote.id, data });
    } else {
      await createNoteMutation.mutateAsync(data);
    }
  };

  const handleDeleteNote = (id: string) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteNoteMutation.mutate(deleteConfirm);
    }
  };

  const handleLogout = () => {
    window.location.href = '/login';
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <TopNav
          user={user}
          onCreateNote={handleCreateNote}
          onSearch={setSearchQuery}
          searchQuery={searchQuery}
          onLogout={handleLogout}
        />
        <div className="container mx-auto px-4 py-8">
          <Alert className="max-w-md mx-auto">
            <AlertDescription>
              Failed to load notes. Please try again.
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="mt-2 w-full"
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/3 rounded-full blur-3xl" />
      </div>

      <TopNav
        user={user}
        onCreateNote={handleCreateNote}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        onLogout={handleLogout}
      />

      <main className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              My Notes
            </h1>
            <p className="text-muted-foreground mt-1">
              {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredNotes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-primary/10 flex items-center justify-center">
              <FileText className="h-12 w-12 text-primary/60" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery ? 'No notes found' : 'No notes yet'}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchQuery
                ? 'Try adjusting your search terms.'
                : 'Start writing your first note to capture your thoughts and ideas.'}
            </p>
            {!searchQuery && (
              <Button
                onClick={handleCreateNote}
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
              >
                Create Your First Note
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            layout
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }
          >
            <AnimatePresence>
              {filteredNotes.map((note: Note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                  isDeleting={deleteNoteMutation.isPending}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Note Editor Modal */}
      <AnimatePresence>
        {(isCreating || editingNote) && (
          <NoteEditor
            note={editingNote || undefined}
            onSave={handleSaveNote}
            onCancel={() => {
              setIsCreating(false);
              setEditingNote(null);
            }}
            isLoading={createNoteMutation.isPending || updateNoteMutation.isPending}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent className="backdrop-blur-glass bg-gradient-glass border-glass-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              <span>Delete Note</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteNoteMutation.isPending}
            >
              {deleteNoteMutation.isPending ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}