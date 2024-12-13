// src/services/apiService.ts
import BASE_URL from '../routes/BaseApi';
import { ISignupData } from '../interfaces/interfaces';

export const signupUser = async (signupData: ISignupData) => {
  const response = await fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(signupData),
  });

  const data = await response.json();
  return data;
};
