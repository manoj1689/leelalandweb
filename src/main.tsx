import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Extract the Google client ID from environment variables
const googleClientId = import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId || ''}>
      <div >
        <App />
      </div>
    </GoogleOAuthProvider>
  </StrictMode>
);


