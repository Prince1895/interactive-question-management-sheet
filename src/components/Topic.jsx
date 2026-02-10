import React, { useState, useEffect } from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit, Trash2, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import useQuestionStore from '../store/useQuestionStore';
import SubTopic from './SubTopic';
import Modal from './Modal';
import { ProgressBar } from './ProgressBar'; 

const Topic = ({ topic }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingSubTopic, setIsAddingSubTopic] = useState(false);
  const [editedName, setEditedName] = useState(topic.name);
  const [newSubTopicName, setNewSubTopicName] = useState('');
  
  const { 
    updateTopic, 
    deleteTopic, 
    addSubTopic, 
    toggleExpand, 
    getProgress 
  } = useQuestionStore();

  const allQuestions = topic.subTopics?.flatMap(st => st.questions) || [];
  const progress = getProgress(allQuestions);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: topic.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleUpdate = () => {
    updateTopic(topic.id, editedName);
    setIsEditing(false);
  };

  const handleAddSubTopic = () => {
    if (newSubTopicName.trim()) {
      addSubTopic(topic.id, newSubTopicName);
      setNewSubTopicName('');
      setIsAddingSubTopic(false);
    }
  };

  return (
    <>
      <div 
        ref={setNodeRef} 
        style={style} 
        className="bg-white border border-[#F5E6CC] rounded-2xl p-5 mb-5 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 flex-1">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-[#FF8C00] transition-colors"
            >
              <GripVertical size={22} />
            </button>
            
            <button
              onClick={() => toggleExpand('topic', topic.id)}
              className="text-gray-500 hover:text-[#FF8C00] transition-colors"
            >
              {topic.isExpanded ? <ChevronDown size={22} /> : <ChevronRight size={22} />}
            </button>
            
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-extrabold text-gray-800 tracking-tight">{topic.name}</h2>
              {/* Progress Tracker */}
              <ProgressBar percentage={progress} />
            </div>
            
            <span className="px-3 py-1 bg-orange-100 text-[#FF8C00] text-xs font-bold rounded-full uppercase ml-2">
              {topic.subTopics?.length || 0} Sections
            </span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setIsAddingSubTopic(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#F5E6CC] text-[#FF8C00] hover:bg-orange-50 font-bold text-xs rounded-lg transition-all"
              title="Add Sub-Topic"
            >
              <Plus size={16} />
              <span>SUB-TOPIC</span>
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-400 hover:text-[#FF8C00] hover:bg-orange-50 rounded-lg transition-all"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => window.confirm('Delete topic and all its contents?') && deleteTopic(topic.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

      
        {topic.isExpanded && (
          <div className="ml-10 mt-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <SortableContext
              items={topic.subTopics?.map(st => st.id) || []}
              strategy={verticalListSortingStrategy}
            >
              {topic.subTopics?.map((subTopic) => (
                <SubTopic
                  key={subTopic.id}
                  subTopic={subTopic}
                  topicId={topic.id}
                />
              ))}
              {(!topic.subTopics || topic.subTopics.length === 0) && (
                <div className="text-center py-6 border-2 border-dashed border-[#F5E6CC] rounded-xl text-gray-400 text-sm">
                  No sections yet. Click "+ SUB-TOPIC" to begin.
                </div>
              )}
            </SortableContext>
          </div>
        )}
      </div>

   
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Topic Name">
        <input
          type="text"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          className="w-full border border-[#F5E6CC] rounded-xl px-4 py-3 mb-6 focus:ring-2 focus:ring-[#FF8C00] outline-none"
          placeholder="Topic name"
        />
        <div className="flex gap-3 justify-end">
          <button onClick={() => setIsEditing(false)} className="px-6 py-2 text-gray-500 font-semibold hover:bg-gray-100 rounded-xl">Cancel</button>
          <button onClick={handleUpdate} className="px-6 py-2 bg-[#FF8C00] text-white font-bold rounded-xl hover:bg-[#E67E00] shadow-md">Save Changes</button>
        </div>
      </Modal>

      <Modal isOpen={isAddingSubTopic} onClose={() => setIsAddingSubTopic(false)} title="New Sub-Topic">
        <input
          type="text"
          value={newSubTopicName}
          onChange={(e) => setNewSubTopicName(e.target.value)}
          className="w-full border border-[#F5E6CC] rounded-xl px-4 py-3 mb-6 focus:ring-2 focus:ring-[#FF8C00] outline-none"
          placeholder="Enter sub-topic name..."
          onKeyPress={(e) => e.key === 'Enter' && handleAddSubTopic()}
          autoFocus
        />
        <div className="flex gap-3 justify-end">
          <button onClick={() => setIsAddingSubTopic(false)} className="px-6 py-2 text-gray-500 font-semibold hover:bg-gray-100 rounded-xl">Cancel</button>
          <button onClick={handleAddSubTopic} className="px-6 py-2 bg-[#FF8C00] text-white font-bold rounded-xl hover:bg-[#E67E00] shadow-md">Create Section</button>
        </div>
      </Modal>
    </>
  );
};

export default Topic;