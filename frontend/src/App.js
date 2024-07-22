import React from 'react';
import { BrowserRouter, HashRouter, Route, Routes, useLocation } from 'react-router-dom';

import Landing from './Pages/Landing';
import Preview from './Pages/Preview';
import Recognition from './Pages/Recognition';
import Recipes from './Pages/Recipes';
import Recipe from './Pages/Recipe';
import Snap from './Pages/Snap';
import Navbar from './Component/Navbar';

function App() {
  return (
    <div>
      <BrowserRouter>
        <BackgroundWrapper>
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />}/>
            <Route path="/Preview" element={<Preview />}/>
            <Route path="/Recognition" element={<Recognition />}/>
            <Route path="/Recipes" element={<Recipes />}/>
            <Route path="/Recipes/:recipeID" element={<Recipe />}/>
            <Route path="/Snap" element={<Snap />}/>
          </Routes>
        </BackgroundWrapper>
      </BrowserRouter>
    </div>
  );

  function BackgroundWrapper({ children }) {
    const location = useLocation();
  
    // Two backgrounds are used between different pages
    const getBackgroundClass = (path) => {
      if ((path === '/') || (path === '/Preview') || (path === '/Snap')) {
        return 'bg-original';
      } 
      else {
        return 'bg-wooden-tray-only';
      }
    };

    return (
      <div className={`${getBackgroundClass(location.pathname)} bg-cover bg-no-repeat bg-center min-h-screen`}>
        {children}
      </div>
    );
  }
}

export default App;
