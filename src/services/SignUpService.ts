// src/services/apiService.ts
const baseUrl = import.meta.env.VITE_BASE_URL;
import { ISignupData } from '../interfaces/interfaces';

export const signupUser = async (signupData: ISignupData) => {
  const response = await fetch(`//43.248.241.252:8081/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(signupData),
  });

  const data = await response.json();
  return data;
};
