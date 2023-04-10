const apiPath = '/api/v1';

const routes = {
  login: [apiPath, 'login'].join('/'),
  signup: [apiPath, 'signup'].join('/'),
  data: [apiPath, 'data'].join('/'),
  homePage: '/',
  loginPage: '/login',
  signupPage: '/signup',
};

export default routes;
