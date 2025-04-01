import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css'; 
import Register from './screens/Register';
import Login from './screens/Login';
import CreateShop from './screens/CreateShop';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createShop" element={<CreateShop />} />
      </Routes>
    </Router>
  );
}

export default App;