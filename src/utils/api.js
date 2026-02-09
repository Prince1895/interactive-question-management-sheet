import axios from 'axios';

const API_URL = 'https://node.codolio.com/api/question-tracker/v1/sheet/public/get-sheet-by-slug/striver-sde-sheet';

export const fetchSampleData = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

// Mock CRUD operations (in-memory)
export const api = {
  // These will work with local state
  createTopic: (topic) => Promise.resolve(topic),
  updateTopic: (id, topic) => Promise.resolve(topic),
  deleteTopic: (id) => Promise.resolve(id),
  
  createSubTopic: (subTopic) => Promise.resolve(subTopic),
  updateSubTopic: (id, subTopic) => Promise.resolve(subTopic),
  deleteSubTopic: (id) => Promise.resolve(id),
  
  createQuestion: (question) => Promise.resolve(question),
  updateQuestion: (id, question) => Promise.resolve(question),
  deleteQuestion: (id) => Promise.resolve(id),
};
