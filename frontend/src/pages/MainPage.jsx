import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useAuth } from '../context.jsx';
import routes from '../routes.js';

const MainPage = () => {
  const { logOut, user } = useAuth();
  return (
    <>
      <div className="h-100">
        <div className="h-100" id="chat">
          <div className="d-flex flex-column h-100">
            <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
              <div className="container">
              <Link className="navbar-brand" to={routes.homePage}>Hexlet chat</Link>
              {!!user && <Button type="button" onClick={logOut}>Выйти</Button>}
              </div>
            </nav>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default MainPage;