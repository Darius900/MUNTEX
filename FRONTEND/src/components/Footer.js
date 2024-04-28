import React from 'react';
import './Footer2.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="connect-follow">
        <span>Copyright &copy; 2023 Toate drepturile rezervate.</span>
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-facebook-f"></i>
        </a>
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-twitter"></i>
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-instagram"></i>
        </a>
      </div>
      <div className="footer-links">
        <span>Social Media</span>
        <a href="#">Politica de confidentialitate</a>
        <a href="#">ANPC</a>
      </div>
    </footer>
  );
}

export default Footer;
