import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
 
const AuthContext = createContext();
 
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
 
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const token = localStorage.getItem('lunysse_token');
    const userData = localStorage.getItem('lunysse_user');
   
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        api.setToken(token);
      } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);
 
  const login = async (email, password) => {
    try {
      const response = await api.login(email, password);
      const userData = response.user;
     
      localStorage.setItem('lunysse_user', JSON.stringify(userData));
      setUser(userData);
     
      return response;
    } catch (error) {
      throw error;
    }
  };
 
  const register = async (userData) => {
    try {
      const response = await api.register(userData);
      const user = response.user;
     
      localStorage.setItem('lunysse_user', JSON.stringify(user));
      setUser(user);
     
      return response;
    } catch (error) {
      throw error;
    }
  };
 
  const logout = () => {
    localStorage.removeItem('lunysse_token');
    localStorage.removeItem('lunysse_user');
    api.removeToken();
    setUser(null);
  };
 
  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
 