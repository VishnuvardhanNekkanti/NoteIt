import React, { useState, useEffect } from 'react';
import { Plus, X, Save } from 'lucide-react';
import { NoteFormData } from '../types/Note';

interface NoteFormProps {
  onSubmit: (noteData: NoteFormData) => void;
  onCancel?: () => void;
  initialData?: NoteFormData;
  isEditing?: boolean;
}

const NoteForm: React.FC<NoteFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData, 
  isEditing = false 
}) => {
  const [formData, setFormData] = useState<NoteFormData>({
    title: '',
    content: '',
    category: 'Personal'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim() && formData.content.trim()) {
      onSubmit(formData);
      if (!isEditing) {
        setFormData({ title: '', content: '', category: 'Personal' });
      }
    }
  };

  const categories = ['Personal', 'Work', 'Study', 'Ideas', 'Projects', 'Travel'];

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl border border-blue-200 dark:border-gray-600 shadow-lg mb-8">
      <div className="space-y-4">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Note title..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={isEditing
              ? "w-[60%] px-3 py-3 border border-blue-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-400 focus:border-transparent bg-white/80 dark:bg-gray-800/80 transition-all duration-200 placeholder-blue-400 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100"
              : "flex-1 px-4 py-3 border border-blue-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-400 focus:border-transparent bg-white/80 dark:bg-gray-800/80 transition-all duration-200 placeholder-blue-400 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100"
            }
            required
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className={isEditing
              ? "w-[35%] px-2 py-3 border border-blue-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-400 focus:border-transparent bg-white/80 dark:bg-gray-800/80 transition-all duration-200 cursor-pointer text-gray-900 dark:text-gray-100"
              : "max-w-[150px] px-2 py-3 border border-blue-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-400 focus:border-transparent bg-white/80 dark:bg-gray-800/80 transition-all duration-200 cursor-pointer text-gray-900 dark:text-gray-100"
            }
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <textarea
          placeholder="Write your note here..."
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full px-4 py-3 border border-blue-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-400 focus:border-transparent bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-200 placeholder-blue-400 dark:placeholder-gray-400 resize-none text-gray-900 dark:text-gray-100"
          rows={4}
          required
        />
        
        <div className="flex justify-end gap-3">
          {isEditing && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={"group flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-800/60 rounded-xl text-gray-600 dark:text-gray-400 border border-blue-100 dark:border-gray-700 shadow transition-all duration-200 hover:scale-105 hover:shadow-lg"}
            >
              <X className="w-4 h-4 transition-colors duration-200 group-hover:text-red-500" />
              <span className="transition-colors duration-200 group-hover:text-red-500">Cancel</span>
            </button>
          )}
          
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            {isEditing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isEditing ? 'Save Changes' : 'Add Note'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default NoteForm;