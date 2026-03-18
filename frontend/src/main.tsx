import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './styles.css';

import { MainLayout } from './layouts/MainLayout';
import { HomeView } from './views/HomeView';
import AuthView from './views/auth/AuthView';

const queryClient = new QueryClient();
const rootElement = document.getElementById('root');

if(!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path='/' element={<HomeView />} />
          </Route>
          <Route element={<MainLayout />}>
            <Route path='/authview' element={<AuthView/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
