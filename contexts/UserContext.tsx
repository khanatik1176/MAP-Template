'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import cookies from 'js-cookie';

export const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {

    const userInfo = cookies.get('user_data');
    if (userInfo) {
      setUserData(JSON.parse(userInfo));
    }

  },[])

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const UserDetails = () => useContext(UserContext);