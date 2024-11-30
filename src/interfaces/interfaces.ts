// src/interfaces/ISignupData.ts

export interface ISignupData {
    device_id: string;
    name: string;
    email: string;
    age: number;
    dob: string; // "YYYY-MM-DD" format for date of birth
    occupation: string;
    birth_location: string;
    birth_time: string; // "HH:MM:SS" format for birth time
    image_link: string;
  }
  
 export interface SignupForm {
    device_id: string;
    name: string;
    email: string;
    age: number;
    dob: string;
    occupation: string;
    birth_location: string;
    birth_time: string;
    image_link: string;
  }

  export interface LoginResponse {
    access_token: string;
    user_id: string;
    message: string;
  }

  export interface ChatMessage {
    role: string;
    content: string;
    timestamp: string;
  }

export interface ChatRequest {
  user_id: string;
  character_id: string;
  scenario_id: any;
  chat_history: { role: string; content: string }[];
  temperature: number;
}

export interface ChatResponse {
  response: string; // Adjust the structure as per your actual API response
}