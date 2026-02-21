import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import MatchDetail from './pages/MatchDetail'
import CreateMatch from './pages/CreateMatch'
import Register from './pages/Register'
import Profile from './pages/Profile'
// Import CSS
import './index.css'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/match/:id',
        element: <MatchDetail />,
      },
      {
        path: '/create',
        element: <CreateMatch />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '*',
        element: (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <h1 className="text-4xl font-bold text-white">404</h1>
            <p className="text-textMuted cursor-default">Página no encontrada o en construcción</p>
          </div>
        ),
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
