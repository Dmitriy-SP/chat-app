import { createContext, useContext } from 'react';

const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);
export const ApiContext = createContext(null);
export const useChatApi = () => useContext(ApiContext);
export default AuthContext;
