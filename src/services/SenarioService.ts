// src/services/scenarioService.ts

interface Scenario {
    id: string;
    title: string;
    description: string;
    // Include other properties based on your API response
  }
  
  export const getScenarios = async (): Promise<Scenario[]> => {
  
  
  
    const response = await fetch('http://127.0.0.1:8000/scenarios', {
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
  