import React, { useEffect, useState } from 'react';
import './Header.css';

const Header = () => {
  const [isShrunk, setIsShrunk] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const stickyPoint = 50; // Change this value based on when you want the header to shrink
      if (window.scrollY > stickyPoint) {
        setIsShrunk(true);
      } else {
        setIsShrunk(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div id="header-placeholder" className="header-placeholder"></div>
      <header id="header" className={`header-title ${isShrunk ? 'sticky shrunk' : ''}`}>
        <img 
          src="https://www.bayer.com/themes/custom/bayer_cpa/logo.svg" 
          alt="Bayer logo" 
          width="27" 
          height="27" 
        />
        Bayer // Employee Analytical Survey Tool
      </header>
    </>
  );
};

export default Header;