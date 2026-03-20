import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { AppProvider } from './context/AppContext';
import { Root } from './pages/Root';
import { Landing } from './pages/Landing';
import { AuthPage } from './pages/AuthPage';
import { SearchPage } from './pages/SearchPage';
import { ProfessionalProfile } from './pages/ProfessionalProfile';
import { BookingPage } from './pages/BookingPage';
import { UserDashboard } from './pages/UserDashboard';
import { ProfessionalDashboard } from './pages/ProfessionalDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { DesignSystemPage } from './pages/DesignSystemPage';
import { UserFlowPage } from './pages/UserFlowPage';
import { ProfilePage } from './pages/ProfilePage';
import { RequireAuth } from './components/auth/RequireAuth';

const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Landing },
      { path: 'login', element: <AuthPage initialView="login" /> },
      { path: 'registro', element: <AuthPage initialView="register-user" /> },
      { path: 'registro/profesional', element: <AuthPage initialView="register-pro" /> },

      { path: 'buscar', Component: SearchPage },
      { path: 'profesional/:id', Component: ProfessionalProfile },
      { path: 'agendar/:id', Component: BookingPage },

      // Protected pages
      { path: 'perfil', element: <RequireAuth><ProfilePage /></RequireAuth> },
      { path: 'panel/usuario', element: <RequireAuth><UserDashboard /></RequireAuth> },
      { path: 'panel/profesional', element: <RequireAuth><ProfessionalDashboard /></RequireAuth> },
      { path: 'panel/admin', element: <RequireAuth><AdminDashboard /></RequireAuth> },

      { path: 'design-system', Component: DesignSystemPage },
      { path: 'flujo', Component: UserFlowPage },
    ],
  },
]);

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}
