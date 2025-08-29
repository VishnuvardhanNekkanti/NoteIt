import { useState, useMemo, useEffect } from 'react';
import { BookOpen, Download, Trash2 } from 'lucide-react';
import { Note, NoteFormData } from './types/Note';
import NoteForm from './components/NoteForm';
import NoteCard from './components/NoteCard';
import SearchBar from './components/SearchBar';
import DarkModeToggle from './components/DarkModeToggle';
import { useDarkMode } from './hooks/useDarkMode';

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Modal state for delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  // Modal state for clear all confirmation
  const [showClearAllModal, setShowClearAllModal] = useState(false);

  // Fetch notes from backend on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/notes')
      .then(res => res.json())
      .then(data => {
        // Convert date strings to Date objects
        setNotes(data.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt)
        })));
      });
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(notes.map(note => note.category)));
    return uniqueCategories.sort();
  }, [notes]);

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           note.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || note.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }, [notes, searchTerm, selectedCategory]);

  // Add note via backend
  const handleAddNote = async (noteData: NoteFormData) => {
    const res = await fetch('http://localhost:5000/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData)
    });
    const newNote = await res.json();
    newNote.createdAt = new Date(newNote.createdAt);
    newNote.updatedAt = new Date(newNote.updatedAt);
    setNotes(prev => [newNote, ...prev]);
  };

  // Update note via backend
  const handleUpdateNote = async (_id: string, noteData: NoteFormData) => {
    const res = await fetch(`http://localhost:5000/api/notes/${_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData)
    });
    const updatedNote = await res.json();
    updatedNote.createdAt = new Date(updatedNote.createdAt);
    updatedNote.updatedAt = new Date(updatedNote.updatedAt);
    setNotes(prev => prev.map(note => note._id === _id ? updatedNote : note));
  };

  // Delete note via backend
  // Show modal instead of alert
  const handleDeleteNote = (_id: string) => {
    setNoteToDelete(_id);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDeleteNote = async () => {
    if (noteToDelete) {
      await fetch(`http://localhost:5000/api/notes/${noteToDelete}`, { method: 'DELETE' });
      setNotes(prev => prev.filter(note => note._id !== noteToDelete));
      setShowDeleteModal(false);
      setNoteToDelete(null);
    }
  };

  // Cancel delete
  const cancelDeleteNote = () => {
    setShowDeleteModal(false);
    setNoteToDelete(null);
  };

  // Toggle pin via backend (optional, here just local)
  const handleTogglePin = async (_id: string) => {
    const note = notes.find(n => n._id === _id);
    if (!note) return;
    await handleUpdateNote(_id, { title: note.title, content: note.content, category: note.category, isPinned: !note.isPinned });
  };

  const handleExportNotes = () => {
    const exportData = {
      notes,
      exportDate: new Date().toISOString(),
      totalNotes: notes.length
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `notes_export_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Show clear all modal
  const handleClearAllNotes = () => {
    setShowClearAllModal(true);
  };

  // Confirm clear all
  const confirmClearAllNotes = async () => {
    await fetch('http://localhost:5000/api/notes', { method: 'DELETE' });
    setNotes([]);
    setShowClearAllModal(false);
  };

  // Cancel clear all
  const cancelClearAllNotes = () => {
    setShowClearAllModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-blue-100 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl text-white">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  NoteIt
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                  {filteredNotes.length !== notes.length && ` • ${filteredNotes.length} filtered`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
              
              <button
                onClick={handleExportNotes}
                disabled={notes.length === 0}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Export all notes"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              
              <button
                onClick={handleClearAllNotes}
                disabled={notes.length === 0}
                className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete all notes"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Note Creation Form */}
        <NoteForm onSubmit={handleAddNote} />

        {/* Search and Filter */}
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
        />

        {/* Notes Display */}
        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map(note => (
              <NoteCard
                key={note._id}
                note={note}
                onUpdate={handleUpdateNote}
                onDelete={handleDeleteNote}
                onTogglePin={handleTogglePin}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
              <BookOpen className="w-16 h-16 text-blue-300 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {notes.length === 0 ? 'No notes yet' : 'No matching notes'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {notes.length === 0 
                  ? 'Create your first note to get started!'
                  : 'Try adjusting your search or category filter.'
                }
              </p>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-blue-100 dark:border-gray-700 p-8 max-w-sm w-full mx-4 flex flex-col items-center">
              <div className="relative mb-4 flex items-center justify-center" style={{height: '48px', width: '48px'}}>
                <BookOpen className="w-10 h-10 text-red-500" />
                <span style={{position: 'absolute', right: '-10px', bottom: '0'}}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </span>
              </div>
              <h2 className="text-lg font-bold mb-2 text-gray-800 dark:text-gray-200">Delete Note?</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400 text-center">Are you sure you want to delete this note? This action cannot be undone.</p>
              <div className="flex gap-4 w-full justify-center">
                <button
                  onClick={confirmDeleteNote}
                  className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold shadow hover:scale-105 hover:shadow-lg transition-all duration-200"
                >
                  Delete
                </button>
                <button
                  onClick={cancelDeleteNote}
                  className="px-6 py-2 bg-white/60 dark:bg-gray-800/60 rounded-xl text-gray-600 dark:text-gray-400 border border-blue-100 dark:border-gray-700 shadow transition-all duration-200 hover:scale-105 hover:shadow-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Clear All Confirmation Modal */}
        {showClearAllModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-blue-100 dark:border-gray-700 p-8 max-w-sm w-full mx-4 flex flex-col items-center">
              <Trash2 className="w-10 h-10 text-red-400 mb-4" />
              <h2 className="text-lg font-bold mb-2 text-gray-800 dark:text-gray-200">Delete All Notes?</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400 text-center">Are you sure you want to delete <b>all</b> notes? This action cannot be undone.</p>
              <div className="flex gap-4 w-full justify-center">
                <button
                  onClick={confirmClearAllNotes}
                  className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold shadow hover:scale-105 hover:shadow-lg transition-all duration-200"
                >
                  Delete All
                </button>
                <button
                  onClick={cancelClearAllNotes}
                  className="px-6 py-2 bg-white/60 dark:bg-gray-800/60 rounded-xl text-gray-600 dark:text-gray-400 border border-blue-100 dark:border-gray-700 shadow transition-all duration-200 hover:scale-105 hover:shadow-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
  {/* Remove duplicate empty state block */}
      </div>
    </div>
  );
}

export default App;