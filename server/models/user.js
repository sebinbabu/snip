const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;
const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "can't be blank"],
      match: [/^[a-z0-9]+$/, 'is invalid'],
      index: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "can't be blank"],
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, 'is invalid'],
      index: true,
      trim: true,
    },
    name: {
      type: String,
      default: 'User',
    },
    bio: { type: String },
    status: {
      type: String,
      enum: ['unverified', 'verified', 'approved', 'suspended'],
      default: 'unverified',
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member',
    },
    invites: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Circle' }],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.pre('save', function savehook(next) {
  const user = this;
  if (!user.isModified('password')) next();
  else {
    bcrypt
      .hash(user.password, SALT_WORK_FACTOR)
      .then((hash) => {
        user.password = hash;
        next();
      })
      .catch((error) => {
        next(error);
      });
  }
});

UserSchema.statics.authenticate = function authenticate(
  username,
  password,
  next,
) {
  this.findOne(
    { username },
    {
      username: true,
      password: true,
      deleted: true,
    },
  )
    .then((user) => {
      if (!user || user.deleted) {
        const error = new Error('incorrect credentials');
        error.status = 401;
        return next(error);
      }
      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (isMatch) next(null, user._id);
          else {
            const error = new Error('incorrect credentials');
            error.status = 401;
            next(error);
          }
        })
        .catch((error) => {
          next(error);
        });
    })
    .catch((error) => {
      next(error);
    });
};

UserSchema.statics.sanitize = function sanitize(fields) {
  return {
    username: fields.username,
    ...('bio' in fields && { bio: fields.bio }),
    ...('name' in fields && { name: fields.name }),
    ...('email' in fields && { email: fields.email }),
    ...('status' in fields && { status: fields.status }),
    ...('password' in fields && { password: fields.password }),
    ...('type' in fields && { type: fields.type }),
    ...('deleted' in fields && { type: fields.deleted }),
  };
};

UserSchema.statics.getUser = function getUser(username, fields, next) {
  this.findOne({ username }, fields)
    .then((doc) => {
      if (doc) return next(null, doc);
      const error = new Error('user not found');
      error.status = 500;
      next(error);
    })
    .catch(error => next(error));
};

UserSchema.statics.createUser = function createUser(fields, next) {
  const userData = this.sanitize(fields);
  this.create(userData)
    .then((user) => {
      next(null, user);
    })
    .catch(() => {
      const error = new Error('error in validation');
      error.status = 500;
      next(error);
    });
};

UserSchema.statics.updateUser = function updateUser(fields, next) {
  const userData = this.sanitize(fields);
  this.findOne({ username: fields.username })
    .then((doc) => {
      if (!doc) {
        const error = new Error('user not found');
        error.status = 500;
        return next(error);
      }
      doc.set(userData);
      doc
        .save()
        .then((newDoc) => {
          next(null, newDoc);
        })
        .catch(error => next(error));
    })
    .catch(error => next(error));
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
