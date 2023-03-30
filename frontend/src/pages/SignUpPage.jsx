import React, { useRef } from 'react';
import { Button, Form, FloatingLabel } from 'react-bootstrap';
import { useFormik } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useAuth } from '../context.jsx';
import routes from '../routes.js';

const registrationFormValidation = yup.object().shape({
    username: yup
      .string()
      .trim()
      .required()
      .min(3)
      .max(20),
    password: yup
      .string()
      .trim()
      .required()
      .min(6, 'validation.passMin'),
    confirmPassword: yup
      .string()
      .test('confirmPassword', (value, context) => value === context.parent.password),
  });

const SingUp = () => {
  const navigate = useNavigate();
  const { logIn } = useAuth();
  const inputRef = useRef();
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: registrationFormValidation,
    onSubmit: async (values, actions) => {
      try {
        const user = await axios.post(
          routes.signup,
          { username: values.username, password: values.password },
        );
        logIn(user.data);
        navigate(routes.homePage);
      } catch (error) {
        if (!error.isAxiosError) {
          throw error;
        }
        if (error.response.status === 409) {
          actions.setFieldError('registration', 'Такой пользователь уже существует');
          inputRef.current.select();
          return;
        }
        throw error;
      }
    },
  });

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <div>
                <img
                  src="./signup-image.jpg"
                  className="rounded-circle"
                  alt='Регистрация'
                />
              </div>
              <Form className="col-12 col-md-6 mt-3 mt-mb-0" onSubmit={formik.handleSubmit}>
                <h1 className="text-center mb-4">Регистрация</h1>
                <Form.Group className="form-floating mb-4" controlId="username">
                  <FloatingLabel className={formik.values.username && 'filled'} label='Имя пользователя' controlId="username">
                    <Form.Control
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      name="username"
                      autoComplete="username"
                      placeholder='username'
                      ref={inputRef}
                      required
                      autoFocus
                      isInvalid={
                        (formik.errors.username && formik.touched.username)
                      || formik.errors.registration
                      }
                      value={formik.values.username}
                    />
                    <Form.Control.Feedback type="invalid" tooltip placement="right">
                    {formik.errors.registration ? '' : formik.errors.username}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
                <Form.Group className="form-floating mb-4" controlId="password">
                  <FloatingLabel className={formik.values.password && 'filled'} label='Пароль' controlId="password">
                    <Form.Control
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      name="password"
                      autoComplete="new-password"
                      placeholder='password'
                      required
                      type="password"
                      isInvalid={
                        (formik.errors.password && formik.touched.password)
                      || formik.errors.registration
                      }
                      value={formik.values.password}
                    />
                    <Form.Control.Feedback type="invalid" tooltip placement="right">
                    {formik.errors.registration
                        ? ''
                        : 'Не менее 6 символов'}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
                <Form.Group className="form-floating mb-4" controlId="confirmPassword">
                  <FloatingLabel className={formik.values.confirmPassword && 'filled'} label='Подтвердите пароль' controlId="confirmPassword">
                    <Form.Control
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      name="confirmPassword"
                      autoComplete="current-password"
                      placeholder='confirmPassword'
                      required
                      type="password"
                      isInvalid={
                        (formik.errors.confirmPassword && formik.touched.confirmPassword)
                      || formik.errors.registration
                      }
                      value={formik.values.confirmPassword}
                    />
                    <Form.Control.Feedback type="invalid" tooltip>
                      {formik.errors.registration
                        ? 'Такой пользователь уже существует'
                        : 'Пароли должны совпадать'}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
                <Button className="w-100 mb-3" variant="outline-primary" type="submit">Зарегестрироваться</Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingUp;
