import React from 'react'
import { Button, Form, FloatingLabel } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import routes from '../routes.js';
import { useAuth } from '../context.jsx';

const LoginPage = () => {
  const navigate = useNavigate();
  const inputRef = React.useRef();
  const { logIn } = useAuth();
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: (values, actions) => axios.post(routes.login, { username: values.username, password: values.password })
        .then((response) => {
          const user = { username: response.data.username, token: response.data.token };
          logIn(user);
          navigate(routes.homePage);
        })
        .catch((e) => {
          switch (e.response.status) {
            case 401: 
              actions.setFieldError('authentication', 'Неверные имя пользователя или пароль');
            break;
            default:
              toast.error('Ошибка соединения');
          }
        }),
  });
  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img src="./login-image.jpg" className="rounded-circle" alt="Войти"/>
              </div>
              <Form className="col-12 col-md-6 mt-3 mt-mb-0" onSubmit={formik.handleSubmit}>
                <h1 className="text-center mb-4">Войти</h1>
                <Form.Group className="form-floating mb-3" controlId="username">
                  <FloatingLabel className={formik.values.username && 'filled'} label="Ваш ник" controlId="username">
                    <Form.Control
                      name="username"
                      autoComplete="username"
                      placeholder="username"
                      required
                      autoFocus
                      isInvalid={formik.errors.authentication}
                      onChange={formik.handleChange}
                      value={formik.values.username}
                      ref={inputRef}
                    />
                  </FloatingLabel>
                </Form.Group>
                <Form.Group className="form-floating mb-4" controlId="password">
                  <FloatingLabel className={formik.values.password && 'filled'} label="Пароль" controlId="password">
                    <Form.Control
                      name="password"
                      autoComplete="current-password"
                      placeholder="password"
                      required
                      type="password"
                      isInvalid={formik.errors.authentication}
                      onChange={formik.handleChange}
                      value={formik.values.password}
                    />
                    <Form.Control.Feedback type="invalid" tooltip>
                      {formik.errors.authentication}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
                <Button className="w-100 mb-3" variant="outline-primary" type="submit">Войти</Button>
              </Form>
            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>Нет аккаунта?</span>
                {' '}
                <Link to="/signup">Регистрация</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
