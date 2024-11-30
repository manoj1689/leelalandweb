// src/services/scenarioService.ts
import BASE_URL from '../routes/BaseApi';
interface Scenario {
    id: string;
    title: string;
    description: string;
    // Include other properties based on your API response
  }
  
  export const getScenarios = async (): Promise<Scenario[]> => {
  
  
  
    const response = await fetch(`${BASE_URL}/scenarios`, {
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
  