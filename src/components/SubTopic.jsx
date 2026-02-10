import React, { useState } from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit, Trash2, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import useQuestionStore from '../store/useQuestionStore';
import Question from './Question';
import Modal from './Modal';
import { ProgressBar } from './ProgressBar';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

const SubTopic = ({ subTopic, topicId }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isAddingQuestion, setIsAddingQuestion] = useState(false);
    const [editedName, setEditedName] = useState(subTopic.name);
    const [newQuestionTitle, setNewQuestionTitle] = useState('');
    const [newQuestionUrl, setNewQuestionUrl] = useState('');

    const { 
        updateSubTopic, 
        deleteSubTopic, 
        addQuestion, 
        reorderQuestions, 
        toggleExpand, 
        getProgress,
        searchQuery 
    } = useQuestionStore();

    const progress = getProgress(subTopic.questions || []);

    const filteredQuestions = subTopic.questions?.filter(q => 
        q.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: subTopic.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleUpdate = () => {
        updateSubTopic(topicId, subTopic.id, editedName);
        setIsEditing(false);
    };

    const handleAddQuestion = () => {
        if (newQuestionTitle.trim()) {
            addQuestion(topicId, subTopic.id, { 
                title: newQuestionTitle, 
                url: newQuestionUrl || '#' 
            });
            setNewQuestionTitle('');
            setNewQuestionUrl('');
            setIsAddingQuestion(false);
        }
    };

    return (
        <>
            <div ref={setNodeRef} style={style} className="bg-white border border-[#F5E6CC] rounded-xl overflow-hidden shadow-sm mb-4 transition-all">
                {/*Header*/}
                <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-[#F5E6CC]/50">
                    <div className="flex items-center gap-3 flex-1">
                        <button
                            {...attributes}
                            {...listeners}
                            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-[#FF8C00]"
                        >
                            <GripVertical size={18} />
                        </button>

                        <button
                            onClick={() => toggleExpand('subtopic', subTopic.id)}
                            className="text-gray-400 hover:text-[#FF8C00] transition-colors"
                        >
                            {subTopic.isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                        </button>

                        <div className="flex flex-col">
                            <h3 className="font-bold text-gray-700">{subTopic.name}</h3>
                            {/*Progress Bar*/}
                            <ProgressBar percentage={progress} />
                        </div>
                        
                        <span className="px-2 py-0.5 bg-orange-50 text-[#FF8C00] text-[10px] font-bold rounded-full uppercase">
                            {subTopic.questions?.length || 0} Questions
                        </span>
                    </div>

                    <div className="flex gap-1">
                        <button
                            onClick={() => setIsAddingQuestion(true)}
                            className="p-1.5 text-gray-400 hover:text-[#FF8C00] hover:bg-orange-50 rounded-md transition-all"
                            title="Add Question"
                        >
                            <Plus size={18} />
                        </button>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-1.5 text-gray-400 hover:text-[#FF8C00] hover:bg-orange-50 rounded-md transition-all"
                        >
                            <Edit size={16} />
                        </button>
                        <button
                            onClick={() => window.confirm('Delete this sub-topic?') && deleteSubTopic(topicId, subTopic.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                {/* Questions List */}
                {subTopic.isExpanded && (
                    <div className="bg-[#FDFCF0]/30 p-2 animate-in fade-in slide-in-from-top-1 duration-200">
                        <DndContext
                            collisionDetection={closestCenter}
                            onDragEnd={({ active, over }) => {
                                if (!over || active.id === over.id) return;
                                const oldIndex = subTopic.questions.findIndex(q => q.id === active.id);
                                const newIndex = subTopic.questions.findIndex(q => q.id === over.id);
                                reorderQuestions(topicId, subTopic.id, arrayMove(subTopic.questions, oldIndex, newIndex));
                            }}
                        >
                            <SortableContext
                                items={filteredQuestions.map(q => q.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-1">
                                    {filteredQuestions.map(question => (
                                        <Question
                                            key={question.id}
                                            question={question}
                                            topicId={topicId}
                                            subTopicId={subTopic.id}
                                        />
                                    ))}
                                    {filteredQuestions.length === 0 && (
                                        <p className="text-center py-4 text-xs text-gray-400 italic">
                                            {searchQuery ? 'No matching questions found.' : 'No questions added yet.'}
                                        </p>
                                    )}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>
                )}
            </div>

            {/* Edit Sub-Topic */}
            <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Rename Sub-Topic">
                <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full border border-[#F5E6CC] rounded-lg px-4 py-2 mb-6 focus:ring-2 focus:ring-[#FF8C00] outline-none"
                    placeholder="Sub-topic name"
                />
                <div className="flex gap-3 justify-end">
                    <button onClick={() => setIsEditing(false)} className="px-5 py-2 text-gray-500 font-medium hover:bg-gray-100 rounded-lg">Cancel</button>
                    <button onClick={handleUpdate} className="px-5 py-2 bg-[#FF8C00] text-white font-bold rounded-lg hover:bg-[#E67E00] shadow-md">Update Name</button>
                </div>
            </Modal>
            {/* Add Questions */}
            <Modal isOpen={isAddingQuestion} onClose={() => setIsAddingQuestion(false)} title="Add New Question">
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Question Title</label>
                        <input
                            type="text"
                            value={newQuestionTitle}
                            onChange={(e) => setNewQuestionTitle(e.target.value)}
                            className="w-full border border-[#F5E6CC] rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-[#FF8C00] outline-none"
                            placeholder="e.g. Reverse Linked List"
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Practice Link (Optional)</label>
                        <input
                            type="text"
                            value={newQuestionUrl}
                            onChange={(e) => setNewQuestionUrl(e.target.value)}
                            className="w-full border border-[#F5E6CC] rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-[#FF8C00] outline-none"
                            placeholder="https://leetcode.com/..."
                        />
                    </div>
                </div>
                <div className="flex gap-3 justify-end mt-8">
                    <button onClick={() => setIsAddingQuestion(false)} className="px-5 py-2 text-gray-500 font-medium hover:bg-gray-100 rounded-lg">Cancel</button>
                    <button onClick={handleAddQuestion} className="px-5 py-2 bg-[#FF8C00] text-white font-bold rounded-lg hover:bg-[#E67E00] shadow-md">Create Question</button>
                </div>
            </Modal>
        </>
    );
};

export default SubTopic;