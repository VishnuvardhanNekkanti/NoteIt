export interface Note {
  _id: string;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
}

export interface NoteFormData {
  title: string;
  content: string;
  category: string;
  isPinned?: boolean;
}