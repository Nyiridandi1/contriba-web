import { createContext, useContext, useEffect, useState } from "react";
import {
  loginWithPin,
  registerWithPin,
  saveSession,
  getToken,
  getUser,
  clearSession,
} from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const savedToken = getToken();
    const savedUser = getUser();

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }

    setAuthLoading(false);
  }, []);

  async function login(phone, pin) {
    const data = await loginWithPin(phone, pin);

    if (data.success && data.token && data.user) {
      saveSession(data.token, data.user);
      setToken(data.token);
      setUser(data.user);
    }

    return data;
  }

  async function register(name, phone, pin) {
    const data = await registerWithPin(name, phone, pin);

    if (data.success && data.token && data.user) {
      saveSession(data.token, data.user);
      setToken(data.token);
      setUser(data.user);
    }

    return data;
  }

  function logout() {
    clearSession();
    setToken(null);
    setUser(null);
  }

  const isAuthenticated = Boolean(token && user);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        authLoading,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}