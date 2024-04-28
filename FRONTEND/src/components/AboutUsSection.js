import React from 'react';
import './AboutUsSection.css';

import Columbia from './columbia.png';
import Deuter from './deuter.png';
import Mamut from './mamut.png';
import Northface from './northface.png';
import Petzl from './petzl.png';
import Solomon from './salomon.png';



const AboutUsSection = () => {
  return (
    <section className="about-us">
      <h2>Branduri cu care lucram:</h2>
      <div className="logos-container">
        <table>
          <tbody>
            <tr>
              <td><img src={Columbia} alt="Logo 1" /></td>
              <td><img src={Deuter} alt="Logo 2" /></td>
              <td><img src={Mamut} alt="Logo 3" /></td>
            </tr>
            <tr>
              <td><img src={Northface} alt="Logo 4" /></td>
              <td><img src={Petzl} alt="Logo 5" /></td>
              <td><img src={Solomon} alt="Logo 6" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AboutUsSection;
