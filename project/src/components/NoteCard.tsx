import React, { useState } from 'react';
import { Edit2, Trash2, Pin, PinOff, Calendar, Tag } from 'lucide-react';
import { Note, NoteFormData } from '../types/Note';
import NoteForm from './NoteForm';

interface NoteCardProps {
  note: Note;
  onUpdate: (_id: string, data: NoteFormData) => void;
  onDelete: (_id: string) => void;
  onTogglePin: (_id: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onUpdate, onDelete, onTogglePin }) => {
  const [isEditing, setIsEditing] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Personal: 'bg-blue-100 text-blue-800',
      Work: 'bg-green-100 text-green-800',
      Study: 'bg-purple-100 text-purple-800',
      Ideas: 'bg-yellow-100 text-yellow-800',
      Projects: 'bg-red-100 text-red-800',
      Travel: 'bg-teal-100 text-teal-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleSubmit = (formData: NoteFormData) => {
    // Pass isPinned when editing
    onUpdate(note._id, { ...formData, isPinned: note.isPinned });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-blue-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300">
        <NoteForm
          onSubmit={handleSubmit}
          onCancel={() => setIsEditing(false)}
          initialData={{
            title: note.title,
            content: note.content,
            category: note.category,
            isPinned: note.isPinned
          }}
          isEditing
        />
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-blue-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${note.isPinned ? 'ring-2 ring-blue-300 dark:ring-blue-400' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(note.category)}`}>
            <Tag className="w-3 h-3 inline mr-1" />
            {note.category}
          </span>
          {note.isPinned && (
            <Pin className="w-4 h-4 text-blue-500 dark:text-blue-400 fill-current" />
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onTogglePin(note._id)}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg"
            title={note.isPinned ? 'Unpin note' : 'Pin note'}
          >
            {note.isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-200 hover:bg-green-50 dark:hover:bg-gray-700 rounded-lg"
            title="Edit note"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onDelete(note._id)}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg"
            title="Delete note"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3 line-clamp-2">
        {note.title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed">
        {note.content}
      </p>
      
      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3">
        <Calendar className="w-3 h-3 mr-1" />
        Created: {formatDate(note.createdAt)}
        {note.updatedAt !== note.createdAt && (
          <span className="ml-4">
            • Updated: {formatDate(note.updatedAt)}
          </span>
        )}
      </div>
    </div>
  );
};

export default NoteCard;