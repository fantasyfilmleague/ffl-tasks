'use strict';

var util = require('util');
var Base = require('./base').Base;

function Dispatcher(connectionString, queue) {
  var me = this;
  Base.call(me, connectionString, queue);
}

util.inherits(Dispatcher, Base);

Dispatcher.prototype.send = function (data, callback) {
  var me = this;

  if (!data) {
    return callback('data is required');
  }

  me.connect(function (error, connection, channel) {
    if (error) {
      return callback(error);
    }

    var message = new Buffer(JSON.stringify(data));
    channel.sendToQueue(me.queue, message);

    channel.close(function () {
      connection.close(callback);
    });
  });
};

module.exports = {
  Dispatcher: Dispatcher,
  create: function (connectionString, queue) {
    return new Dispatcher(connectionString || Base.getConnectionStringFromEnvironment(), queue || Base.getQueueFromEnvironment());
  }
};
