import BASE_URL from '../routes/BaseApi';
interface ChatMessageResponse {
    role: string;
    content: string;
    character_id: string;
    scenario_id: string;
  }
  
  export const getChatHistory = async (characterId=String): Promise<ChatMessageResponse[]> => {
    // Retrieve the token from local storage
    const token = localStorage.getItem('user_token');
    
    if (!token) {
      throw new Error('User is not authenticated');
    }
  
    const response = await fetch(`${BASE_URL}/chat-history?character_id=${characterId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch chat history');
    }
    console.log("chat Response",response.json)
    return response.json();
  };
  