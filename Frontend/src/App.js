import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/auth/PrivateRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import EventsPage from './pages/events/EventsPage';
import EventDetailsPage from './pages/events/EventDetailsPage';
// import MyTicketsPage from './pages/tickets/MyTicketsPage';
import TicketDetailsPage from './pages/tickets/TicketDetailsPage';
import ProfilePage from './pages/user/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import CreateEventPage from './pages/events/CreateEventPage';
import EditEventPage from './pages/events/EditEventPage';
import TicketsPage from './pages/tickets/TicketsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <AuthProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="events" element={<EventsPage />} />
            
            {/* Event Routes */}
            <Route path="events/create" element={<PrivateRoute><CreateEventPage /></PrivateRoute>} />
            <Route path="events/:id" element={<EventDetailsPage />} />
            <Route path="events/edit/:id" element={<PrivateRoute><EditEventPage /></PrivateRoute>} />
            
            {/* Public Routes */}
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />

            {/* Protected Routes */}
            <Route path="dashboard" element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            } />
            <Route path="tickets" element={
              <PrivateRoute>
                <TicketsPage />
              </PrivateRoute>
            } />
            <Route path="my-tickets" element={
              <PrivateRoute>
                <TicketsPage />
              </PrivateRoute>
            } />
            <Route path="tickets/:id" element={<TicketDetailsPage />} />
            <Route path="profile" element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            } />
            
            {/* 404 Page */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;