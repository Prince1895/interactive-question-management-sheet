import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { GripVertical, Edit, Trash2, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import useQuestionStore from '../store/useQuestionStore';
import Question from './Question';
import Modal from './Modal';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

const SubTopic = ({ subTopic, topicId }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isAddingQuestion, setIsAddingQuestion] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const [editedName, setEditedName] = useState(subTopic.name);
    const [newQuestionTitle, setNewQuestionTitle] = useState('');

    const { updateSubTopic, deleteSubTopic, addQuestion, reorderQuestions } = useQuestionStore();

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

    const handleDelete = () => {
        if (window.confirm('Delete this sub-topic and all its questions?')) {
            deleteSubTopic(topicId, subTopic.id);
        }
    };

    const handleAddQuestion = () => {
        if (newQuestionTitle.trim()) {
            addQuestion(topicId, subTopic.id, { title: newQuestionTitle });
            setNewQuestionTitle('');
            setIsAddingQuestion(false);
        }
    };

    return (
        <>
            <div ref={setNodeRef} style={style} className="bg-white border border-gray-200 rounded-md px-3 py-2 mb-2"
>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1">
                        <button
                            {...attributes}
                            {...listeners}
                            className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-orange-5000"
                        >
                            <GripVertical size={18} />
                        </button>

                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-gray-500 hover:text-orange-5000"
                        >
                            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </button>

                        <h3 className="font-semibold text-gray-700">{subTopic.name}</h3>
                        <span className="text-xs text-gray-500">({subTopic.questions?.length || 0} questions)</span>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsAddingQuestion(true)}
                            className="text-gray-500 hover:text-orange-5000"
                            title="Add Question"
                        >
                            <Plus size={18} />
                        </button>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-gray-500 hover:text-orange-5000"
                        >
                            <Edit size={18} />
                        </button>
                        <button
                            onClick={handleDelete}
                            className="text-gray-500 hover:text-orange-5000"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>

                {isExpanded && subTopic.questions && subTopic.questions.length > 0 && (
                    <div className="ml-6 mt-3">
                        <DndContext
                            collisionDetection={closestCenter}
                            onDragEnd={({ active, over }) => {
                                if (!over || active.id === over.id) return;

                                const oldIndex = subTopic.questions.findIndex(q => q.id === active.id);
                                const newIndex = subTopic.questions.findIndex(q => q.id === over.id);

                                reorderQuestions(
                                    topicId,
                                    subTopic.id,
                                    arrayMove(subTopic.questions, oldIndex, newIndex)
                                );
                            }}
                        >
                            <SortableContext
                                items={subTopic.questions.map(q => q.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {subTopic.questions.map(question => (
                                    <Question
                                        key={question.id}
                                        question={question}
                                        topicId={topicId}
                                        subTopicId={subTopic.id}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Sub-Topic">
                <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full border bg-orange-500 hover:bg-orange-600 rounded px-3 py-2 mb-4"
                    placeholder="Sub-topic name"
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
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-gray-500 rounded"
                    >
                        Save
                    </button>
                </div>
            </Modal>

            {/* Add Question Modal */}
            <Modal isOpen={isAddingQuestion} onClose={() => setIsAddingQuestion(false)} title="Add Question">
                <input
                    type="text"
                    value={newQuestionTitle}
                    onChange={(e) => setNewQuestionTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                    placeholder="Question title"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddQuestion()}
                />
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={() => setIsAddingQuestion(false)}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAddQuestion}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-gray-500"
                    >
                        Add
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default SubTopic;
