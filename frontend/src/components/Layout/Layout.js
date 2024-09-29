import React from 'react';
import './Layout.css';

function Layout({ children }) {
  return (
    <div className="App">
      {children}
    </div>
  );
}

export default Layout;
