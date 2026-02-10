import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit, Trash2, CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import useQuestionStore from '../store/useQuestionStore';
import Modal from './Modal';

const Question = ({ question, topicId, subTopicId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSolving, setIsSolving] = useState(false); 
  const [editedTitle, setEditedTitle] = useState(question.title);
  const [editedUrl, setEditedUrl] = useState(question.url || '');
  
  const { updateQuestion, deleteQuestion, solveQuestion } = useQuestionStore();

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
    updateQuestion(topicId, subTopicId, question.id, { 
      title: editedTitle, 
      url: editedUrl 
    });
    setIsEditing(false);
  };

  const handleSolve = (method) => {
    solveQuestion(topicId, subTopicId, question.id, method);
    setIsSolving(false);
  };
  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-50 border-green-100';
      case 'hard': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-orange-600 bg-orange-50 border-orange-100';
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`flex items-center justify-between py-3 px-2 border-b border-[#F5E6CC]/30 text-sm transition-colors hover:bg-white/50 group ${question.completed ? 'bg-orange-50/10' : ''}`}
      >
        <div className="flex items-center gap-3 flex-1">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-[#FF8C00]"
          >
            <GripVertical size={16} />
          </button>
          
          <button 
            onClick={() => setIsSolving(true)}
            className={`transition-colors ${question.completed ? 'text-green-500' : 'text-gray-300 hover:text-[#FF8C00]'}`}
          >
            <CheckCircle2 size={18} fill={question.completed ? 'currentColor' : 'none'} />
          </button>

          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-2">
              <span className={`font-medium ${question.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                {question.title}
              </span>
              {question.url && question.url !== '#' && (
                <a 
                  href={question.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#FF8C00] transition-colors"
                >
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
            
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${getDifficultyColor(question.difficulty)}`}>
                {question.difficulty || 'Medium'}
              </span>
              {question.nextRevision && (
                <div className="flex items-center gap-1 text-[9px] font-bold text-[#FF8C00] bg-orange-100 px-1.5 py-0.5 rounded uppercase">
                  <Clock size={10} /> Revise: {new Date(question.nextRevision).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-gray-400 hover:text-[#FF8C00] hover:bg-white rounded-md"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={() => window.confirm('Delete this question?') && deleteQuestion(topicId, subTopicId, question.id)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white rounded-md"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Edit */}
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Question Details">
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase">Title</label>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full border border-[#F5E6CC] rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-[#FF8C00] outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase">Practice URL</label>
            <input
              type="text"
              value={editedUrl}
              onChange={(e) => setEditedUrl(e.target.value)}
              className="w-full border border-[#F5E6CC] rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-[#FF8C00] outline-none"
            />
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <button onClick={() => setIsEditing(false)} className="px-5 py-2 text-gray-500 font-medium hover:bg-gray-100 rounded-lg">Cancel</button>
          <button onClick={handleUpdate} className="px-5 py-2 bg-[#FF8C00] text-white font-bold rounded-lg hover:bg-[#E67E00] shadow-md">Update Question</button>
        </div>
      </Modal>

    {/* Revision */}
      <Modal isOpen={isSolving} onClose={() => setIsSolving(false)} title="Solution Feedback">
        <p className="text-xs text-gray-400 mb-6 italic">Choosing an option will update your streak and set a revision date[cite: 22].</p>
        <div className="grid grid-cols-1 gap-3">
          {[
            { id: 'self', label: 'Solved by Myself', sub: 'Next: 7 Days' },
            { id: 'hints', label: 'Needed Hints', sub: 'Next: 3 Days' },
            { id: 'solution', label: 'Watched Solution', sub: 'Next: 1 Day' }
          ].map(opt => (
            <button 
              key={opt.id}
              onClick={() => handleSolve(opt.id)} 
              className="w-full flex justify-between items-center p-3 border border-[#F5E6CC] rounded-xl hover:border-[#FF8C00] hover:bg-orange-50 group transition-all"
            >
              <span className="font-bold text-gray-700">{opt.label}</span>
              <span className="text-[10px] text-gray-400 font-bold group-hover:text-[#FF8C00]">{opt.sub}</span>
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default Question;