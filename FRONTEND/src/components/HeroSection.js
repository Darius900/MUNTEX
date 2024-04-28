import React from 'react';
import './HeroSection.css';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="hero">
      <h1>Muntex</h1>
      <h2>Tot ce iti trebuie pentru o drumetie.</h2>
      <Link to="/categories">
        <button>Cumpara acum</button>
      </Link>
    </section>
  );
};

export default HeroSection;
