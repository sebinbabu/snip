const mongoose = require('mongoose');

const { Schema } = mongoose;

const SnipSchema = new Schema(
  {
    snipname: {
      type: String,
      required: [true, "can't be blank"],
      match: [/^[a-z0-9]+$/, 'is invalid'],
      index: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      default: '',
    },
    owner: {
      type: String,
      default: 'Guest',
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    strict: true,
    strictQuery: true,
  },
);

SnipSchema.statics.getSnip = function getSnip(snipname, fields) {
  return new Promise((resolve, reject) => {
    this.findOne({ snipname }, fields)
      .exec()
      .then((doc) => {
        if (doc && !doc.deleted) resolve(doc.toObject());
        else {
          const error = new Error('snip not found');
          error.status = 500;
          reject(error);
        }
      })
      .catch(error => reject(error));
  });
};

SnipSchema.statics.setSnip = function setSnip(snipname, fields) {
  return new Promise((resolve, reject) => {
    this.findOneAndUpdate({ snipname }, fields, {
      upsert: true,
    })
      .exec()
      .then((doc) => {
        if (doc) resolve(doc.toObject());
        else {
          const error = new Error('snip not found');
          error.status = 500;
          reject(error);
        }
      })
      .catch(error => reject(error));
  });
};

const Snip = mongoose.model('Snip', SnipSchema);
module.exports = Snip;
