import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { GripVertical, Edit, Trash2, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import useQuestionStore from '../store/useQuestionStore';
import SubTopic from './SubTopic';
import Modal from './Modal';

const Topic = ({ topic }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingSubTopic, setIsAddingSubTopic] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [editedName, setEditedName] = useState(topic.name);
  const [newSubTopicName, setNewSubTopicName] = useState('');
  
  const { updateTopic, deleteTopic, addSubTopic } = useQuestionStore();

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

  const handleDelete = () => {
    if (window.confirm('Delete this topic and all its sub-topics?')) {
      deleteTopic(topic.id);
    }
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
      <div ref={setNodeRef} style={style} className="bg-white border border-gray-200 rounded-md px-4 py-3 mb-3 hover:bg-gray-50 transition"
>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
            >
              <GripVertical size={20} />
            </button>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-600 hover:text-gray-800"
            >
              {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            
            <h2 className="text-lg font-bold text-gray-800">{topic.name}</h2>
            <span className="text-sm text-gray-500">({topic.subTopics?.length || 0} sub-topics)</span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setIsAddingSubTopic(true)}
              className="text-green-500 hover:text-green-700 flex items-center gap-1"
              title="Add Sub-Topic"
            >
              <Plus size={20} />
              <span className="text-sm">Sub-Topic</span>
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-500 hover:text-blue-700"
            >
              <Edit size={20} />
            </button>
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        {isExpanded && topic.subTopics && topic.subTopics.length > 0 && (
          <div className="ml-8 mt-4">
            <SortableContext
              items={topic.subTopics.map(st => st.id)}
              strategy={verticalListSortingStrategy}
            >
              {topic.subTopics.map((subTopic) => (
                <SubTopic
                  key={subTopic.id}
                  subTopic={subTopic}
                  topicId={topic.id}
                />
              ))}
            </SortableContext>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Topic">
        <input
          type="text"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          placeholder="Topic name"
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </Modal>

      {/* Add Sub-Topic Modal */}
      <Modal isOpen={isAddingSubTopic} onClose={() => setIsAddingSubTopic(false)} title="Add Sub-Topic">
        <input
          type="text"
          value={newSubTopicName}
          onChange={(e) => setNewSubTopicName(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          placeholder="Sub-topic name"
          onKeyPress={(e) => e.key === 'Enter' && handleAddSubTopic()}
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setIsAddingSubTopic(false)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleAddSubTopic}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Topic;
