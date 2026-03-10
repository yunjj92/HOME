import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { MainLayout } from './layouts/MainLayout';
import { HomeView } from './views/HomeView';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path='/' element={<HomeView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
