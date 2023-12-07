import React from 'react';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import Profile from './Profile';

const Navbar = () => {
  return (
    <div className="navbar">
      <LoginButton/>
      <LogoutButton/>
      <Profile/>
    </div>
  );
};

export default Navbar;