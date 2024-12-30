import React, { createContext, useState, useContext } from 'react';

// Tạo AuthContext
const AuthContext = createContext();

// Tạo Provider để cung cấp thông tin người dùng
export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  return (
    <AuthContext.Provider value={{ userId, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook để sử dụng AuthContext
export const useAuth = () => useContext(AuthContext);
