import React from 'react';
import './Contact.css';

function Contact() {
  return (
    <div className="contact-container">
      <h2>Adresa noastra</h2>
      <p>Bd. Timișoara 26, București 061331</p>
      <p>Numar telefon: 0214078464</p>
      <p>Adresa Email: aaaa@gmail.com</p>
      
      <h2>Locatie</h2>
      <iframe
        title="Google Maps Location"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2774.462267088803!2d26.060700815409972!3d44.43726557910161!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1ff6a4a4c4f3f%3A0x4e4dd4c15f2cc3ed!2sPlaza%20Romania!5e0!3m2!1sen!2sro!4v1648925328297!5m2!1sen!2sro"
        width="600"
        height="450"
        allowFullScreen=""
        loading="lazy"
      ></iframe>
      
    </div>
  );
}

export default Contact;
