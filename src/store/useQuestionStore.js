import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useQuestionStore = create(
  persist(
    (set, get) => ({
      topics: [],
      searchQuery: '',
      streak: 0,
      lastSolvedDate: null,

  
      setTopics: (topics) => set({ topics }),
      setSearchQuery: (query) => set({ searchQuery: query }),

     
      getFilteredTopics: () => {
        const { topics, searchQuery } = get();
        if (!searchQuery.trim()) return topics;

        const query = searchQuery.toLowerCase();
        return topics.filter(topic => 
          topic.name.toLowerCase().includes(query) ||
          topic.subTopics.some(st => 
            st.name.toLowerCase().includes(query) ||
            st.questions.some(q => q.title.toLowerCase().includes(query))
          )
        );
      },

    
      toggleExpand: (type, id) => set((state) => ({
        topics: state.topics.map(topic => {
          if (type === 'topic' && topic.id === id) {
            return { ...topic, isExpanded: !topic.isExpanded };
          }
          return {
            ...topic,
            subTopics: topic.subTopics.map(st => 
              (type === 'subtopic' && st.id === id) 
                ? { ...st, isExpanded: !st.isExpanded } 
                : st
            )
          };
        })
      })),


      updateStreak: () => {
        const { lastSolvedDate, streak } = get();
        const today = new Date().toDateString();
        
        if (lastSolvedDate === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastSolvedDate === yesterday.toDateString()) {
          set({ streak: streak + 1, lastSolvedDate: today });
        } else {
          set({ streak: 1, lastSolvedDate: today });
        }
      },
      getProgress: (items) => {
        if (!items || items.length === 0) return 0;
        const completed = items.filter(i => i.completed || (i.questions && i.questions.every(q => q.completed))).length;
        return Math.round((completed / items.length) * 100);
      },
      solveQuestion: (topicId, subTopicId, questionId, method) => {
        const intervals = { self: 7, hints: 3, solution: 1 };
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + (intervals[method] || 1));

        get().updateStreak();

        set((state) => ({
          topics: state.topics.map((topic) => 
            topic.id === topicId ? {
              ...topic,
              subTopics: topic.subTopics.map((sub) => 
                sub.id === subTopicId ? {
                  ...sub,
                  questions: sub.questions.map((q) => 
                    q.id === questionId ? { 
                      ...q, 
                      completed: true, 
                      nextRevision: nextDate.toISOString(), 
                      solveMethod: method 
                    } : q
                  )
                } : sub
              )
            } : topic
          )
        }));
      },

      addTopic: (topicName) => set((state) => ({
        topics: [...state.topics, { id: `topic-${Date.now()}`, name: topicName, isExpanded: true, subTopics: [] }]
      })),

      updateTopic: (topicId, newName) => set((state) => ({
        topics: state.topics.map(t => t.id === topicId ? { ...t, name: newName } : t)
      })),

      deleteTopic: (topicId) => set((state) => ({
        topics: state.topics.filter(t => t.id !== topicId)
      })),

      addSubTopic: (topicId, subTopicName) => set((state) => ({
        topics: state.topics.map(t => t.id === topicId ? {
          ...t,
          subTopics: [...t.subTopics, { id: `subtopic-${Date.now()}`, name: subTopicName, isExpanded: true, questions: [] }]
        } : t)
      })),

      addQuestion: (topicId, subTopicId, questionData) => set((state) => ({
        topics: state.topics.map(t => t.id === topicId ? {
          ...t,
          subTopics: t.subTopics.map(st => st.id === subTopicId ? {
            ...st,
            questions: [...st.questions, { id: `q-${Date.now()}`, ...questionData, completed: false }]
          } : st)
        } : t)
      })),

      reorderTopics: (newTopics) => set({ topics: newTopics }),
      reorderSubTopics: (topicId, newSubTopics) => set((state) => ({
        topics: state.topics.map(t => t.id === topicId ? { ...t, subTopics: newSubTopics } : t)
      })),
      reorderQuestions: (topicId, subTopicId, newQuestions) => set((state) => ({
        topics: state.topics.map(t => t.id === topicId ? {
          ...t,
          subTopics: t.subTopics.map(st => st.id === subTopicId ? { ...st, questions: newQuestions } : st)
        } : t)
      })),
      
      deleteQuestion: (topicId, subTopicId, questionId) => set((state) => ({
        topics: state.topics.map(t => t.id === topicId ? {
          ...t,
          subTopics: t.subTopics.map(st => st.id === subTopicId ? {
            ...st,
            questions: st.questions.filter(q => q.id !== questionId)
          } : st)
        } : t)
      })),

      deleteSubTopic: (topicId, subTopicId) => set((state) => ({
        topics: state.topics.map(t => t.id === topicId ? {
          ...t,
          subTopics: t.subTopics.filter(st => st.id !== subTopicId)
        } : t)
      })),
    }),
    {
      name: 'question-management-storage', 
      partialize: (state) => ({ 
        topics: state.topics, 
        streak: state.streak, 
        lastSolvedDate: state.lastSolvedDate 
      }),
    }
  )
);

export default useQuestionStore;