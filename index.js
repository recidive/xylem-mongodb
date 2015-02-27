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
 * @param {Object} query Optional query object.
 * @param {Function} callback Function to run when data is returned.
 */
MongoDBAdapter.prototype.list = function(modelSettings, query, callback) {
  var collection = this.database.collection(modelSettings.name);
  var data = {};

  var self = this;

  collection.find(query).toArray(function(error, items) {
    if (error) {
      return callback(error);
    }

    callback(null, items);
  });
};

/**
 * List stored items.
 *
 * @param {Object} modelSettings Model settings object.
 * @param {Object} query Optional query object.
 * @param {Function} callback Function to run when data is returned.
 */
MongoDBAdapter.prototype.list = function(modelSettings, query, callback) {
  var collection = this.database.collection(modelSettings.name);
  var data = {};

  var self = this;

  collection.find(query).toArray(function(error, items) {
    if (error) {
      return callback(error);
    }

    callback(null, items);
  });
};

/**
 * Load a stored item.
 *
 * @param {Object} modelSettings Model settings object.
 * @param {String} key Item key to search for.
 * @param {Function} callback Function to run when data is returned.
 */
MongoDBAdapter.prototype.get = function(modelSettings, key, callback) {
  var query = {};
  query[modelSettings.key] = key;

  var collection = this.database.collection(modelSettings.name);
  collection.findOne(query, callback);
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
 * @param {String} key Item key to search for.
 * @param {Function} callback Function to run when data is destroyd.
 */
MongoDBAdapter.prototype.destroy = function(modelSettings, key, callback) {
  var self = this;

  // Get the item to return it to the callback after deleting it. We use the
  // get() method so we return the fully loaded object.
  this.get(modelSettings, key, function(error, item) {
    if (error) {
      return callabck(error);
    }

    var collection = self.database.collection(modelSettings.name);
    collection.remove({_id: item._id}, function(error, count) {
      if (error) {
        return callabck(error);
      }

      callback(null, item);
    });
  });
};

module.exports = MongoDBAdapter;
