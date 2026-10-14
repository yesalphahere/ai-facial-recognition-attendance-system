import React, { useState, useEffect } from 'react';

const GoToTop = () => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const scrollPercent = (scrolled / (docHeight - winHeight)) * 100;
      
      setProgress(scrollPercent);
      setVisible(scrolled > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!visible) return null;

  return (
    <div className="go-top" onClick={scrollToTop} style={{cursor: 'pointer'}}>
      <span className="progress-value" style={{
        background: `conic-gradient(var(--primary-color) ${progress}%, transparent ${progress}%)`
      }}>
        <i className="ti ti-chevron-up"></i>
      </span>
    </div>
  );
};

export default GoToTop;
