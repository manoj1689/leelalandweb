// src/services/apiService.ts
//const baseUrl = import.meta.env.VITE_BASE_URL;
import { API_BASE_URL } from "../constants/Constants";
import { ISignupData } from '../interfaces/interfaces';

export const signupUser = async (signupData: ISignupData) => {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(signupData),
  });

  const data = await response.json();
  return data;
};
