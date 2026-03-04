const db = require("../services/dbService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// GET user profile by ID
const getUserProfile = (req, res) => {
  const { id } = req.params;

  const query = `SELECT * FROM ehub_user WHERE id = ?`;
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Korisnik nije pronađen" });
    }
    res.json(result[0]);
  });
};

// User registration
const signUp = (req, res) => {
  const {
    first_name,
    last_name,
    username,
    password,
    email,
    city,
    country,
    date_of_birth,
    address,
    phone_number,
    profile_picture_url,
    bio,
  } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ message: "Greška pri šifrovanju lozinke" });
    }

    const query = `INSERT INTO ehub_user (first_name, last_name, username, password_hash, email, city, country, dateOfBirth, address, phone_number, profile_picture_url, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(
      query,
      [
        first_name,
        last_name,
        username,
        hash,
        email,
        city,
        country,
        date_of_birth,
        address,
        phone_number,
        profile_picture_url,
        bio,
      ],
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Greška pri unosu korisnika", error: err });
        }

        const confirmationLink = `http://localhost:3000/confirm?email=${email}`;
        const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: "Confirm your account",
          text: `Hello ${first_name},\n\nPlease confirm your account by clicking the link below:\n\n${confirmationLink}`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Korisnik dodat, ali e-mail nije poslat." });
          }
          res.status(201).json({
            message: "Korisnik uspešno dodat. Potvrda poslata na e-mail.",
            userId: result.insertId,
          });
        });
      },
    );
  });
};

// Confirm email
const confirmEmail = (req, res) => {
  const { email } = req.query;

  const query = "UPDATE ehub_user SET verified  = 1 WHERE email = ?";
  db.query(query, [email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Greška pri potvrdi." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Korisnik nije pronađen." });
    }
    res.status(200).json({ message: "Nalog uspešno potvrđen." });
  });
};

// Login
const login = (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT id, password_hash FROM ehub_user WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Greška pri proveri korisnika", error: err });
    }

    if (results.length > 0) {
      const { id, password_hash: hashedPassword } = results[0];

      bcrypt.compare(password, hashedPassword, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ message: "Greška pri autentikaciji" });
        }

        if (isMatch) {
          const token = jwt.sign(
            { userId: id, email: email },
            process.env.JWT_TOKEN,
            { expiresIn: "2h" },
          );
          return res
            .status(200)
            .json({ message: "Prijava uspešna", token: token });
        } else {
          return res.status(401).json({ message: "Pogrešna lozinka" });
        }
      });
    } else {
      return res
        .status(401)
        .json({ message: "Korisnik sa ovim emailom ne postoji" });
    }
  });
};

module.exports = { getUserProfile, signUp, confirmEmail, login };
