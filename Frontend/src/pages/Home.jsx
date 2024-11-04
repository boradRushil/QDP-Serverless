import { useContext } from 'react';
import React from 'react';
import { AuthContext } from '../context/authContext';

const Home = () => {
  // const { logout } = useContext(AuthContext);
  const handleLogout = () => {
      // logout();
  };
  return (
    <div>
      Hello this is the home page
      <button onClick={handleLogout}>logout</button>
    </div>
  );
}

export default Home;
