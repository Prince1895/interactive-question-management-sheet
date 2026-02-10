import axios from 'axios';

const API_URL = 'https://node.codolio.com/api/question-tracker/v1/sheet/public/get-sheet-by-slug/striver-sde-sheet';

export const fetchSampleData = async () => {
  try {
    const response = await axios.get(API_URL);
    
    if (response.data && response.data.data && response.data.data.sections) {
      return response.data.data.sections.map(section => ({
        id: section._id || Math.random().toString(36).substr(2, 9),
        name: section.title,
        isExpanded: true, 
        subTopics: section.subSections.map(sub => ({
          id: sub._id || Math.random().toString(36).substr(2, 9),
          name: sub.title,
          isExpanded: true,
          questions: sub.questions.map(q => ({
            id: q._id || Math.random().toString(36).substr(2, 9),
            title: q.title,
            url: q.url || '#', 
            completed: false,
            difficulty: q.difficulty || 'Medium',
            nextRevision: null, 
            solveMethod: null  
          }))
        }))
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching data from Codolio API:', error);
    return null;
  }
};


export const api = {

  createTopic: (name) => Promise.resolve({ 
    id: `topic-${Date.now()}`, 
    name, 
    isExpanded: true, 
    subTopics: [] 
  }),
  updateTopic: (id, name) => Promise.resolve({ id, name }),
  deleteTopic: (id) => Promise.resolve(id),
  
  createSubTopic: (name) => Promise.resolve({ 
    id: `subtopic-${Date.now()}`, 
    name, 
    isExpanded: true, 
    questions: [] 
  }),
  updateSubTopic: (id, name) => Promise.resolve({ id, name }),
  deleteSubTopic: (id) => Promise.resolve(id),

  createQuestion: (data) => Promise.resolve({ 
    ...data, 
    id: `q-${Date.now()}`, 
    completed: false,
    nextRevision: null,
    solveMethod: null
  }),
  updateQuestion: (id, updates) => Promise.resolve({ id, ...updates }),
  deleteQuestion: (id) => Promise.resolve(id),
};