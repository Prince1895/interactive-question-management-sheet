import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit, Trash2 } from 'lucide-react';
import useQuestionStore from '../store/useQuestionStore';
import Modal from './Modal';

const Question = ({ question, topicId, subTopicId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(question.title);
  
  const { updateQuestion, deleteQuestion } = useQuestionStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleUpdate = () => {
    updateQuestion(topicId, subTopicId, question.id, { title: editedTitle });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Delete this question?')) {
      deleteQuestion(topicId, subTopicId, question.id);
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-center justify-between py-2 border-b border-gray-100 text-sm"
      >
        <div className="flex items-center gap-2 flex-1">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-orange-5000"
          >
            <GripVertical size={16} />
          </button>
          <span className="text-sm">{question.title}</span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-500 hover:text-orange-500"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="text-gray-500 hover:text-orange-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Question">
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          placeholder="Question title"
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-gray-500"
          >
            Save
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Question;
