// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CharacterSelectionPage from './pages/SelectCharacterPage';
import ChatPage from './pages/ChatPage';
import Layout from './components/Layout';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>

          <Route index element={<CharacterSelectionPage />} />
          <Route path="chat" element={<ChatPage />} />


        </Route>
      </Routes>
    </Router>
  );
};

export default App;




