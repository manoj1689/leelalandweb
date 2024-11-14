// src/services/characterService.ts
// http://127.0.0.1:8000
//const baseUrl = import.meta.env.VITE_BASE_URL;
import { API_BASE_URL } from "../constants/Constants";
interface Character {
    id: string;
    name: string;
    description: string;
    // Include other properties based on your API response
  }
  
  export const getCharacters = async (): Promise<Character[]> => {
  
    const response = await fetch(`${API_BASE_URL}/characters`, {
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
  
  