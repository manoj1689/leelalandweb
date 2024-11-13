// src/services/chatService.ts
import {ChatMessage,ChatRequest,ChatResponse } from "../interfaces/interfaces"

export const sendChat = async (chatData: ChatRequest): Promise<ChatResponse> => {
  const token = localStorage.getItem('user_token'); // Get the token from localStorage
  console.log("token at chat service",token)
  if (!token) {
    throw new Error('Authentication token is missing');
  }
  console.log("chatData",chatData)
  const response = await fetch('http://127.0.0.1:8000/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Pass token correctly here
      'accept': 'application/json',
    },
    body: JSON.stringify(chatData), // Send the chat data as JSON
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to send chat');
  }

  return response.json();
};

  