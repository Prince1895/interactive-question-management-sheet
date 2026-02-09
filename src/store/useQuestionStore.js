import { create } from 'zustand';

const useQuestionStore = create((set) => ({
  topics: [],
  
  // Initialize with fetched data
  setTopics: (topics) => set({ topics }),
  
  // TOPIC OPERATIONS
  addTopic: (topicName) => set((state) => ({
    topics: [
      ...state.topics,
      {
        id: `topic-${Date.now()}`,
        name: topicName,
        subTopics: []
      }
    ]
  })),
  
  updateTopic: (topicId, newName) => set((state) => ({
    topics: state.topics.map(topic =>
      topic.id === topicId ? { ...topic, name: newName } : topic
    )
  })),
  
  deleteTopic: (topicId) => set((state) => ({
    topics: state.topics.filter(topic => topic.id !== topicId)
  })),
  
  reorderTopics: (newTopics) => set({ topics: newTopics }),
  
  // SUBTOPIC OPERATIONS
  addSubTopic: (topicId, subTopicName) => set((state) => ({
    topics: state.topics.map(topic =>
      topic.id === topicId
        ? {
            ...topic,
            subTopics: [
              ...topic.subTopics,
              {
                id: `subtopic-${Date.now()}`,
                name: subTopicName,
                questions: []
              }
            ]
          }
        : topic
    )
  })),
  
  updateSubTopic: (topicId, subTopicId, newName) => set((state) => ({
    topics: state.topics.map(topic =>
      topic.id === topicId
        ? {
            ...topic,
            subTopics: topic.subTopics.map(st =>
              st.id === subTopicId ? { ...st, name: newName } : st
            )
          }
        : topic
    )
  })),
  
  deleteSubTopic: (topicId, subTopicId) => set((state) => ({
    topics: state.topics.map(topic =>
      topic.id === topicId
        ? {
            ...topic,
            subTopics: topic.subTopics.filter(st => st.id !== subTopicId)
          }
        : topic
    )
  })),
  
  reorderSubTopics: (topicId, newSubTopics) => set((state) => ({
    topics: state.topics.map(topic =>
      topic.id === topicId ? { ...topic, subTopics: newSubTopics } : topic
    )
  })),
  
  // QUESTION OPERATIONS
  addQuestion: (topicId, subTopicId, questionData) => set((state) => ({
    topics: state.topics.map(topic =>
      topic.id === topicId
        ? {
            ...topic,
            subTopics: topic.subTopics.map(st =>
              st.id === subTopicId
                ? {
                    ...st,
                    questions: [
                      ...st.questions,
                      {
                        id: `question-${Date.now()}`,
                        ...questionData,
                      }
                    ]
                  }
                : st
            )
          }
        : topic
    )
  })),
  
  updateQuestion: (topicId, subTopicId, questionId, questionData) => set((state) => ({
    topics: state.topics.map(topic =>
      topic.id === topicId
        ? {
            ...topic,
            subTopics: topic.subTopics.map(st =>
              st.id === subTopicId
                ? {
                    ...st,
                    questions: st.questions.map(q =>
                      q.id === questionId ? { ...q, ...questionData } : q
                    )
                  }
                : st
            )
          }
        : topic
    )
  })),
  
  deleteQuestion: (topicId, subTopicId, questionId) => set((state) => ({
    topics: state.topics.map(topic =>
      topic.id === topicId
        ? {
            ...topic,
            subTopics: topic.subTopics.map(st =>
              st.id === subTopicId
                ? {
                    ...st,
                    questions: st.questions.filter(q => q.id !== questionId)
                  }
                : st
            )
          }
        : topic
    )
  })),
  
  reorderQuestions: (topicId, subTopicId, newQuestions) => set((state) => ({
    topics: state.topics.map(topic =>
      topic.id === topicId
        ? {
            ...topic,
            subTopics: topic.subTopics.map(st =>
              st.id === subTopicId ? { ...st, questions: newQuestions } : st
            )
          }
        : topic
    )
  })),
}));

export default useQuestionStore;

