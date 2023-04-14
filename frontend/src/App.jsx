import React, { useMemo, useState } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  Outlet,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Chat from './components/Chat.jsx';
import Login from './components/Login.jsx';
import Nav from './components/Nav.jsx';
import SingUp from './components/SingUp.jsx';
import NotFoundPage from './components/NotFoundPage.jsx';
import AuthContext, { useAuth } from './context/index.jsx';
import routes from './routes.js';

const AuthProvider = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(currentUser ? { ...currentUser } : null);

  const logIn = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logOut = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const memoizedValues = useMemo(() => ({ logIn, logOut, user }), [user]);

  return (
    <AuthContext.Provider value={memoizedValues}>
      {children}
    </AuthContext.Provider>
  );
};

const PrivateRoute = () => (useAuth().user ? <Outlet /> : <Navigate to={routes.loginPage} />);
const LoginPageRoute = () => (useAuth().user ? <Navigate to="/" /> : <Login />);
const SingUpPageRoute = () => (useAuth().user ? <Navigate to="/" /> : <SingUp />);

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path={routes.loginPage} element={<LoginPageRoute />} />
        <Route path={routes.signupPage} element={<SingUpPageRoute />} />
        <Route path={routes.homePage} element={<PrivateRoute />}>
          <Route path="" element={<Chat />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
