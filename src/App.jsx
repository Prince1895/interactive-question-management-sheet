import React, { useEffect, useState } from 'react';
// At the top with other imports
import { sampleData } from './utils/sampleData';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import useQuestionStore from './store/useQuestionStore';
import Topic from './components/Topic';
import Modal from './components/Modal';


function App() {
  // State for modal and input
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Get state and actions from Zustand store
  const { topics, setTopics, addTopic, reorderTopics } = useQuestionStore();

  // Setup drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch data when app loads
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          'https://node.codolio.com/api/question-tracker/v1/sheet/public/get-sheet-by-slug/striver-sde-sheet'
        );
        const data = await response.json();
        
        if (data.success && data.data && data.data.topics) {
          // Transform API data to match your app's structure
          const transformedTopics = data.data.topics.map((topic, index) => ({
            id: topic._id || `topic-${index}`,
            name: topic.topicName || topic.name,
            order: topic.order || index,
            subTopics: (topic.subTopics || []).map((st, stIndex) => ({
              id: st._id || `subtopic-${index}-${stIndex}`,
              name: st.subTopicName || st.name,
              order: st.order || stIndex,
              questions: (st.questions || []).map((q, qIndex) => ({
                id: q._id || `question-${index}-${stIndex}-${qIndex}`,
                title: q.questionName || q.title,
                difficulty: q.difficulty,
                link: q.link,
                order: q.order || qIndex,
                completed: q.completed || false
              }))
            }))
          }));
          
          setTopics(transformedTopics);
        } else {
          // If API fails, start with empty state
          setTopics([]);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to empty state
         data = sampleData;
        setTopics([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [setTopics]);

  // Handle drag end event
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = topics.findIndex((t) => t.id === active.id);
      const newIndex = topics.findIndex((t) => t.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        reorderTopics(arrayMove(topics, oldIndex, newIndex));
      }
    }
  };

  // Handle adding a new topic
  const handleAddTopic = () => {
    if (newTopicName.trim()) {
      addTopic(newTopicName);
      setNewTopicName('');
      setIsAddingTopic(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="text-xl text-gray-700">Loading questions...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Question Management System</h1>
              <p className="text-gray-600 mt-1">Organize your questions by topics and sub-topics</p>
            </div>
            <button
              onClick={() => setIsAddingTopic(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Add Topic
            </button>
          </div>
        </div>

        {/* Topics List */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={topics.map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {topics.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500 text-lg">No topics yet. Click "Add Topic" to get started!</p>
              </div>
            ) : (
              topics.map((topic) => (
                <Topic key={topic.id} topic={topic} />
              ))
            )}
          </SortableContext>
        </DndContext>

        {/* Add Topic Modal */}
        <Modal isOpen={isAddingTopic} onClose={() => setIsAddingTopic(false)} title="Add New Topic">
          <input
            type="text"
            value={newTopicName}
            onChange={(e) => setNewTopicName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            placeholder="Topic name (e.g., Arrays, Strings)"
            onKeyPress={(e) => e.key === 'Enter' && handleAddTopic()}
            autoFocus
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setIsAddingTopic(false)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleAddTopic}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default App;