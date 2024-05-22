import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

import Landing from './Pages/Landing';
import Preview from './Pages/Preview';
import Recognition from './Pages/Recognition';
import Recipes from './Pages/Recipes';
import Recipe from './Pages/Recipe';
import Snap from './Pages/Snap';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />}/>
          <Route path="/Preview" element={<Preview />}/>
          <Route path="/Recognition" element={<Recognition />}/>
          <Route path="/Recipes" element={<Recipes />}/>
          <Route path="/Recipes/:recipeID" element={<Recipe />}/>
          <Route path="/Snap" element={<Snap />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
