const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

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

SnipSchema.plugin(uniqueValidator, { message: '{PATH} already exists' });

SnipSchema.statics.getSnip = function getSnip(snipname, fields) {
  return this.findOne({ snipname }, fields).exec();
};

SnipSchema.statics.createSnip = function createSnip(fields) {
  return this.findOneAndUpdate({ snipname: fields.snipname }, fields, {
    upsert: true,
  }).exec();
};

const Snip = mongoose.model('Snip', SnipSchema);
module.exports = Snip;
