import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

import Landing from './Pages/Landing';
import Preview from './Pages/Preview';
import Recognition from './Pages/Recognition';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />}/>
          <Route path="/Preview" element={<Preview />}/>
          <Route path="/Recognition" element={<Recognition />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
