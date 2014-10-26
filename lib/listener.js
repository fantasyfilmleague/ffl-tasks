'use strict';

var util = require('util');
var Base = require('./base').Base;

function Listener(connectionString, queue) {
  var me = this;
  Base.call(me, connectionString, queue);
}

util.inherits(Listener, Base);

Listener.prototype.onMessageReceived = function (channel, message) {
  channel.ack(message);
};

Listener.prototype.listen = function (callback) {
  var me = this;

  me.connect(function (error, connection, channel) {
    if (error) {
      return callback(error);
    }

    channel.consume(me.queue, me.onMessageReceived.bind(me, channel), {noAck: false});

    me._connection = connection;

    callback();
  });
};

Listener.prototype.close = function (callback) {
  var me = this;

  // this is a no-op
  if (!me._connection) {
    return (callback) ? callback() : false;
  }

  me._connection.close(callback);
};

module.exports = {
  Listener: Listener,
  create: function (connectionString, queue) {
    return new Listener(connectionString || Base.getConnectionStringFromEnvironment(), queue || Base.getQueueFromEnvironment());
  }
};
