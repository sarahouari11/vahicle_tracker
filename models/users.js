const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schéma pour les utilisateurs
const userSchema = new Schema({
  userId: { type: String, required: true, unique: true }, // Add userId field
  fullName: { type: String, required: true, minlength: 3 }, // Changed to camelCase
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8 },
});

// Modèle pour les utilisateurs
const User = mongoose.model("User", userSchema); // Changed to capital letter for convention

module.exports = User;

