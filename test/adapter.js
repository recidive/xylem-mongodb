var assert = require('assert');
var Adapter = require('../');
var adapter;

// Database connection settings.
var databaseSettings = {
  hostname: 'localhost',
  database: 'test-xylem-mongodb'
};

// Model settings.
var modelSettings = {
  key: 'id',
  name: 'contact'
};

// Sample data.
var sample = {
  id: 1,
  name: 'John',
  email: 'john@example.com'
};

describe('MongoDBAdapter', function(done) {
  beforeEach(function(done) {
    adapter = new Adapter(databaseSettings);
    adapter.init(function() {
      done();
    })
  });

  it('should save an item', function(done) {
    adapter.save(modelSettings, sample, function(error, item) {
      if (error) {
        throw error;
      }

      assert.ok(item);
      done();
    });
  });

  it('should list items', function(done) {
    adapter.save(modelSettings, sample, function(error, item) {
      if (error) {
        throw error;
      }

      adapter.list(modelSettings, {}, function(error, items) {
        if (error) {
          throw error;
        }

        assert.ok(items);
        assert.ok(items instanceof Array);
        assert.equal(items.length, 1);
        done();
      });
    });
  });

  it('should get an item by its key', function(done) {
    adapter.save(modelSettings, sample, function(error, item) {
      if (error) {
        throw error;
      }

      adapter.get(modelSettings, sample.id, function(error, item) {
        if (error) {
          throw error;
        }

        assert.ok(item);
        done();
      });
    });
  });

  it('should destroy an item', function(done) {
    adapter.save(modelSettings, sample, function(error, item) {
      if (error) {
        throw error;
      }

      adapter.destroy(modelSettings, sample.id, function(error, item) {
        if (error) {
          throw error;
        }

        assert.ok(item);

        adapter.get(modelSettings, sample.id, function(error, item) {
          if (error) {
            throw error;
          }

          assert.ifError(item);
          done();
        });
      });
    });
  });

});
