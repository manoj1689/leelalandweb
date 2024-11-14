// src/services/scenarioService.ts
//const baseUrl = import.meta.env.VITE_BASE_URL;
import { API_BASE_URL } from "../constants/Constants";

interface Scenario {
    id: string;
    title: string;
    description: string;
    // Include other properties based on your API response
  }
  
  export const getScenarios = async (): Promise<Scenario[]> => {
  
  
  
    const response = await fetch(`${API_BASE_URL }/scenarios`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch scenarios');
    }
  
    return response.json();
  };
  