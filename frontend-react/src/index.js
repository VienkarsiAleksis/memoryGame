import React from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './index.scss';
import MainPage from './Pages/MainPage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import GamePage from './Pages/GamePage';
import LevelPage from './Pages/LevelPage';
import ProfilePage from './Pages/ProfilePage';
import ShopPage from './Pages/ShopPage';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<MainPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/shop' element={<ShopPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/level/:level' element={<GamePage />} />
      <Route path='/levels' element={<LevelPage />} />
      <Route path='/profile/:userID' element={<ProfilePage />} />
    </Routes>
  </BrowserRouter>
);