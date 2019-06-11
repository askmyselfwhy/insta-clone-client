const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var CollectionNames = require('../constants/collectionNames');

const collectionName = CollectionNames.SUBSCRIPTIONS;

var Model = mongoose.model('Subscription', new Schema({
    endpoint: String,
    expirationTime: Date,
    keys: {
      p256dh: String,
      auth: String
    }
  }),
  collectionName
);

module.exports = Model;