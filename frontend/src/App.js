import './App.css';
import React from 'react'
import  'bootstrap';
import  './styles.scss';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import routes from './routes.js';
import AuthContext from './context.jsx';
import { useAuth } from './context.jsx';

const AuthProvider = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = React.useState(currentUser ? { ...currentUser } : null);

  const logIn = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logOut = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const memoizedValues = React.useMemo(() => ({
    logIn, logOut, user,
  }), [user]);

  return (
    <AuthContext.Provider  value={memoizedValues}>
      {children}
    </AuthContext.Provider>
  );
};

const PrivateRoute = () => useAuth().user ? <Outlet /> : <Navigate to="/login" />;
const LoginPageRoute = () => useAuth().user ? <Navigate to="/" /> : <LoginPage />;
const SingUpPageRoute = () => useAuth().user ? <Navigate to="/" /> : <SignUpPage />;

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path={routes.homePage} element={<MainPage />}>
          <Route path="" element={<PrivateRoute />}>
            <Route path="" element={<ChatPage />} />
          </Route>
          <Route path={routes.loginPage} element={<LoginPageRoute />} />
          <Route path={routes.signUpPage} element={<SingUpPageRoute />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
  );
};

export default App;
