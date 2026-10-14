import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import GoToTop from './GoToTop';
import Loader from './Loader';

const Layout = ({ children }) => {
  return (
    <div className="app-wrapper">
      <Loader />
      <Sidebar />
      <div className="app-content">
        <div className="">
          <Header />
          <main>
            <div className="container-fluid">
              {children}
            </div>
          </main>
        </div>
      </div>
      <GoToTop />
      <Footer />
    </div>
  );
};

export default Layout;
