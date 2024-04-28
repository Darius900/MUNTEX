const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { protect, admin } = require('../middleware/authMiddleware');
const Sequelize = require('sequelize');
const sendEmail = require('../utils/email');
const bcrypt = require('bcryptjs'); 

dotenv.config();

const router = express.Router();

const { Op } = require("sequelize");

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, isAdmin } = req.body;

    // Input validare
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // verifica daca email-ul exista deja
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email-ul exista deja' });
    }

    // creeaza user nou
    const user = await User.create({ username, email, password, isAdmin });
    console.log('User created:', user);

    // trimite confirmare email
    try {
      const emailSubject = 'Te rog confirma-ti contul';
      const emailHtml = `<h1>Bine ati venit la Muntex</h1><p>Va rog confirmati-va contul accesand:</p><a href="http://localhost:3000/confirm/${user.id}">Confirma contul</a>`;
      await sendEmail(user.email, emailSubject, emailHtml);
    } catch (error) {
      console.error('Erroare trimitand e-mail de confirmare:', error);
    }

    res.status(201).json({ message: 'User inregistrat', user });
  } catch (error) {
    console.error('Eroare in ruta /register :', error);
    res.status(400).json({ message: 'Eroare la inregistrare user', error });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

      // Input validare
      if (!email || !password) {
        return res.status(400).json({ message: 'E-mailul și parola sunt necesare' });
      }
  
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        return res.status(400).json({ message: 'Email sau parola nevalida' });
      }
  
      // verifica daca contul userului este confirmat
      if (!user.confirmed) {
        return res.status(401).json({ message: 'Vă rugăm să vă confirmați contul prin e-mail înainte de a vă autentifica' });
      }
  
      const isMatch = await user.comparePassword(password);
  
      if (!isMatch) {
        return res.status(400).json({ message: 'Email sau parola nevalida' });
      }
  
      // genereaza JWT token
      const payload = { id: user.id, isAdmin: user.isAdmin }; 
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });


    // eliminare camp parola de la utilizator
    const userObj = user.toJSON();
    delete userObj.password;

    //trimite token JWT si obiectul user ca raspuns
    res.status(200).json({ message: 'Utilizator autentificat', token, user: userObj });
  } catch (error) {
    console.error('Eroare in /login route:', error.message, error.stack);
    res.status(400).json({ message: 'Eroare la autentificarea utilizatorului', error });
  }
});

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Eroare la getUsers route:', error);
    res.status(400).json({ message: 'Eroare la obtine utilizatorii', error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.params.id } });

    if (!user) {
      return res.status(404).json({ message: 'Utilizatorul nu a fost gasit' });
    }

    await user.destroy();
    res.status(200).json({ message: 'Utilizator sters' });
  } catch (error) {
    console.error('Eroare in deleteUser route:', error);
    res.status(400).json({ message: 'Eroare in stergere utilizator', error });
  }
};

router.get('/', protect, admin, getUsers);
router.delete('/:id', protect, admin, deleteUser);



// order volum chart 
router.get('/activity', protect, admin, async (req, res) => {
  try {
    const userActivity = await User.findAll({
      attributes: [
        [Sequelize.fn('date', Sequelize.col('createdAt')), 'date'],
        [Sequelize.fn('count', Sequelize.col('id')), 'activityCount'],
      ],
      group: ['date'],
      order: Sequelize.literal('date ASC'),
      raw: true,
    });
    res.json(userActivity);
  } catch (error) {
    console.error("Error executing user activity query:", error);
    res.status(500).json({ error: 'Failed to fetch user activity data.' });
  }
});


router.put('/confirm/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.confirmed = true;
    await user.save();

    res.status(200).json({ message: 'User account confirmed successfully' });
  } catch (error) {
    console.error('Error confirming user account:', error);
    res.status(500).json({ message: 'Error confirming user account' });
  }
});


//rute pt parola reset

router.post('/request-password-reset', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    user.resetPasswordToken = token;
    await user.save();

    const emailSubject = 'Password Reset Request';
    const emailHtml = `<h1>Password Reset Request</h1><p>Please click the link below to reset your password:</p><a href="http://localhost:3000/reset-password/${token}">Reset Password</a>`;
    await sendEmail(user.email, emailSubject, emailHtml);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    res.status(500).json({ message: 'Error requesting password reset' });
  }
});

router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.resetPasswordToken !== token) {
      return res.status(400).json({ message: 'Invalid token' });
    }


    // Hash parola noua inainte de resetare 
    
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(newPassword, salt);

user.password = hashedPassword;
user.resetPasswordToken = null;
await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
});




//rute pt schimbare parola
const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Old and new passwords are required' });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid old password' });
    }

    // hash parola noua inainte de salvare
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Error updating password' });
  }
};

router.put('/update-password', protect, updatePassword);



//raport useri creati intr-o anumita perioada

router.get('/createdBetween/:startDate/:endDate', async (req, res) => {
  try {
    const { startDate, endDate } = req.params;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Ambele date sunt necesare' });
    }

    const users = await User.findAll({
      where: {
        createdAt: {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        }
      }
    });

    res.status(200).json({ message: 'Utilizatori gasiti', users });

  } catch (error) {
    console.error('Eroare in ruta /createdBetween :', error);
    res.status(400).json({ message: 'Eroare la gasirea utilizatorilor', error });
  }
});





module.exports = router;
