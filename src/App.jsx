import React, { useEffect, useState } from 'react';
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
import { Plus, Search, ListChecks } from 'lucide-react';
import useQuestionStore from './store/useQuestionStore';
import { fetchSampleData } from './utils/api';
import Topic from './components/Topic';
import Modal from './components/Modal';
import { Reviser } from './components/Reviser';
import { ReviewCalendar } from './components/ReviewCalendar';

function App() {
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    topics, 
    setTopics, 
    addTopic, 
    reorderTopics, 
    searchQuery, 
    setSearchQuery, 
    getFilteredTopics 
  } = useQuestionStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        if (topics.length === 0) {
          const data = await fetchSampleData();
          if (data) setTopics(data);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [setTopics, topics.length]);

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

  const handleAddTopic = () => {
    if (newTopicName.trim()) {
      addTopic(newTopicName);
      setNewTopicName('');
      setIsAddingTopic(false);
    }
  };

  const filteredTopics = getFilteredTopics();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFCF0] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8C00]"></div>
          <span className="text-lg font-bold text-gray-600">Syncing with Codolio...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF0] pb-20">
      <header className="sticky top-0 z-30 bg-[#FDFCF0]/80 backdrop-blur-md border-b border-[#F5E6CC]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FF8C00] rounded-xl shadow-lg shadow-orange-100">
              <ListChecks className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">
              CODOLIO <span className="text-[#FF8C00]">TRACKER</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search topics or questions..."
                className="pl-10 pr-4 py-2 bg-white border border-[#F5E6CC] rounded-xl focus:ring-2 focus:ring-[#FF8C00] outline-none w-full md:w-64 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setIsAddingTopic(true)}
              className="bg-[#FF8C00] hover:bg-[#E67E00] text-white p-2.5 rounded-xl shadow-md transition-all active:scale-95"
            >
              <Plus size={24} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8">

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          <div className="w-full lg:w-2/3 order-2 lg:order-1">
            <Reviser />
            
            <div className="mt-8">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={filteredTopics.map(t => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {filteredTopics.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-[#F5E6CC] rounded-3xl p-16 text-center">
                      <p className="text-gray-400 font-medium">
                        {searchQuery ? "No matching results found." : "Your sheet is empty. Add a topic to begin!"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {filteredTopics.map((topic) => (
                        <Topic key={topic.id} topic={topic} />
                      ))}
                    </div>
                  )}
                </SortableContext>
              </DndContext>
            </div>
          </div>

          <aside className="w-full lg:w-1/3 order-1 lg:order-2 sticky top-28">
            <ReviewCalendar />
          </aside>
        </div>
      </main>

      <Modal isOpen={isAddingTopic} onClose={() => setIsAddingTopic(false)} title="New Study Topic">
        <div className="space-y-4">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Topic Name</label>
          <input
            type="text"
            value={newTopicName}
            onChange={(e) => setNewTopicName(e.target.value)}
            className="w-full border border-[#F5E6CC] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#FF8C00] outline-none bg-white"
            placeholder="e.g., Graphs, Recursion, System Design"
            onKeyPress={(e) => e.key === 'Enter' && handleAddTopic()}
            autoFocus
          />
          <div className="flex gap-3 justify-end mt-4">
            <button
              onClick={() => setIsAddingTopic(false)}
              className="px-6 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleAddTopic}
              className="px-6 py-2 bg-[#FF8C00] text-white font-bold rounded-xl hover:bg-[#E67E00] shadow-lg shadow-orange-50 transition-all"
            >
              Create Topic
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;