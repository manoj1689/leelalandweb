// src/services/characterService.ts
// http://127.0.0.1:8000
import BASE_URL from '../routes/BaseApi';
interface Character {
    id: string;
    name: string;
    description: string;
    // Include other properties based on your API response
  }
  
  export const getCharacters = async (): Promise<Character[]> => {
  
    const response = await fetch(`${BASE_URL}/characters`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
       
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch characters');
    }
  
    return response.json();
  };
  
  