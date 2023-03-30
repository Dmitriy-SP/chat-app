const apiPath = '/api/v1';

const routes = {
  login: [apiPath, 'login'].join('/'),
  data: [apiPath, 'data'].join('/'),
  signup: [apiPath, 'signup'].join('/'),
  homePage: '/',
  loginPage: '/login',
  signUpPage: '/signup',
};

export default routes;
