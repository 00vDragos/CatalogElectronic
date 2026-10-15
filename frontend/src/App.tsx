import { useEffect, useState } from 'react';

import LoginForm from './components/LoginForm';
import AppHeader from './components/AppHeader';
import TeacherDashboard from './features/teacher/TeacherDashboard';
import StudentDashboard from './features/student/StudentDashboard';
import AdminDashboard from './features/admin/AdminDashboard';

import './App.css';

type AuthUser = {
  sub: number;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
};

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const savedToken = sessionStorage.getItem('accessToken');

    if (!savedToken) {
      setCheckingSession(false);
      return;
    }

    async function restoreSession() {
      try {
        const response = await fetch(
          'http://localhost:3000/auth/me',
          {
            headers: {
              Authorization: `Bearer ${savedToken}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error('Session expired');
        }

        const userData: AuthUser = await response.json();

        setToken(savedToken);
        setUser(userData);
      } catch {
        sessionStorage.removeItem('accessToken');
        setToken(null);
        setUser(null);
      } finally {
        setCheckingSession(false);
      }
    }

    void restoreSession();
  }, []);

  async function handleLogin(accessToken: string) {
    try {
      const response = await fetch(
        'http://localhost:3000/auth/me',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Nu am putut identifica utilizatorul.');
      }

      const userData: AuthUser = await response.json();

      sessionStorage.setItem('accessToken', accessToken);
      setUser(userData);
      setToken(accessToken);
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('accessToken');
    setToken(null);
    setUser(null);
  }

  if (checkingSession) {
    return (
      <div className="loading-screen">
        <p>Se verifică sesiunea...</p>
      </div>
    );
  }

  if (!token || !user) {
    return (
      <div className="auth-layout">
        <main className="auth-card">
          <h1>Catalog Electronic</h1>
          <p>Autentificare în platformă</p>

          <LoginForm onLogin={handleLogin} />
        </main>
      </div>
    );
  }

  return (
    <div className="application-layout">
      <AppHeader
        role={user.role}
        onLogout={handleLogout}
      />

      <main className="application-content">
        {user.role === 'TEACHER' && (
          <TeacherDashboard token={token} />
        )}

        {user.role === 'ADMIN' && (
          <AdminDashboard token={token} />
        )}

        {user.role === 'STUDENT' && (
          <StudentDashboard token={token} />
        )}
      </main>
    </div>
  );
}

export default App;