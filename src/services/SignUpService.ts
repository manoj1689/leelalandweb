// src/services/apiService.ts

import { ISignupData } from '../interfaces/interfaces';

export const signupUser = async (signupData: ISignupData) => {
  const response = await fetch('http://127.0.0.1:8000/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(signupData),
  });

  const data = await response.json();
  return data;
};
