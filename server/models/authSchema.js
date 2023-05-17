const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      required: [true, 'Nome de usuário obrigatório'],
      unique: [true, 'Este nome de usuário já foi usado.'],
      trim: true,
      validate: {
        validator: function (value) {
          if (/\s/.test(value)) {
            return false;
          }
          if (/[áàâãéèêíïóôõöúüûçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÜÛÇÑ]/.test(value)) {
            return false;
          }

          return true;
        },
        message:
          'O nome de usuário não pode ter duas ou mais palavras separadas ou caracteres acentuados.',
      },
    },
    purchased_issued_at: { type: Date },
    purchased_expires_at: { type: Date },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    invitations: {
      type: [String],
      default: [],
    },
    invitedBy: {
      type: String,
      default: '',
    },
    numOfFriends: {
      type: Number,
      default: 0,
    },
    status: {
      type: Boolean,
      default: false,
    },
    max_tokens: {
      type: Number,
      default: 0,
    },
    used_tokens: {
      type: Number,
      default: 0,
    },
    email: {
      type: String,
      required: [true, 'Email obrigatório'],
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, 'Escreve um email válido'],
      unique: [true, 'Este email já foi usado.'],
    },
    password: {
      type: String,
      required: [true, 'Escreve uma senha para a sua conta'],
      minlength: [8, 'Escreve um minímo de 8 caracteres'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Confirme a sua senha'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'As senhas não combinam!',
      },
    },
    createdAt: {
      type: Date,
      default: () => Date.now(),
    },
    updatedAt: {
      type: Date,
      default: () => Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.createToken = function (user) {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  return token;
};

userSchema.methods.checkCorrectPassword = async function (
  candidatePassword,
  currentPassword
) {
  return await bcrypt.compare(candidatePassword, currentPassword);
};

userSchema.methods.changedPasswordAfterJWT = function (JWTTimestamp) {
  if (this.changedPasswordAt) {
    const changedTimestamp = parseInt(
      this.changedPasswordAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

// userSchema.methods.createPasswordResetToken = function () {
//   const resetToken = crypto.randomBytes(32).toString('hex');

//   this.passwordResetToken = crypto
//     .createHash('sha256')
//     .update(resetToken)
//     .digest('hex');

//   this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

//   return resetToken;
// };
module.exports = mongoose.model('User', userSchema);
