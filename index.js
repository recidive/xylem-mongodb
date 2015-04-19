/*
 * Xylem MongoDB Adapter.
 */

var MongoClient = require('mongodb').MongoClient
var extend = require('extend');

/**
 * MongoDB Adapter constructor.
 *
 * @constructor
 * @param {Object} settings Adapter settings.
 */
function MongoDBAdapter(settings) {
  this.settings = settings || {};

  // Database connection.
  this.database = null;
};

/**
 * Initialize database connection.
 */
MongoDBAdapter.prototype.init = function(callback) {
  var self = this;
  MongoClient.connect('mongodb://' + this.settings.hostname + '/' + this.settings.database, function(error, database) {
    if (error) {
      return callback(error);
    }

    self.database = database;
    callback();
  });
};

/**
 * List stored items.
 *
 * @param {Object} modelSettings Model settings object.
 * @param {Query} query Xylem query object.
 * @param {Function} callback Function to run when data is returned.
 */
MongoDBAdapter.prototype.list = function(modelSettings, query, callback) {
  var collection = this.database.collection(modelSettings.name);
  var data = {};

  // @todo: sort and limit results.
  collection.find(query.criteria).toArray(callback);
};

/**
 * Get a stored item.
 *
 * @param {Object} modelSettings Model settings object.
 * @param {Query} query Xylem query object.
 * @param {Function} callback Function to run when data is returned.
 */
MongoDBAdapter.prototype.get = function(modelSettings, query, callback) {
  var collection = this.database.collection(modelSettings.name);
  collection.findOne(query.criteria, callback);
};

/**
 * Save a item.
 *
 * @param {Object} modelSettings Model settings object.
 * @param {Object} item Object representing the item.
 * @param {Function} callback Function to run when data is saved.
 */
MongoDBAdapter.prototype.save = function(modelSettings, item, callback) {
  var collection = this.database.collection(modelSettings.name);

  if (!item[modelSettings.key]) {
    callback(new Error('Error saving ' + modelSettings + '. Missing key ' + modelSettings.key + '.'));
  }

  var query = {};
  query[modelSettings.key] = item[modelSettings.key];

  collection.findAndModify(query, [modelSettings.key, 'ascending'], item, {upsert: true},  function(err, savedItem) {
    extend(item, savedItem);
    callback(null, item);
  });
};

/**
 * Destroy an item.
 *
 * @param {Object} modelSettings Model settings object.
 * @param {Object} item Object representing the item.
 * @param {Function} callback Function to run when data is destroyd.
 */
MongoDBAdapter.prototype.destroy = function(modelSettings, item, callback) {
  var collection = this.database.collection(modelSettings.name);
  collection.remove({_id: item._id}, function(error, count) {
    if (error) {
      return callabck(error);
    }

    callback(null, item);
  });
};

module.exports = MongoDBAdapter;
