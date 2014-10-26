'use strict';

var utils = require('./utils');
var env = require('ffl-utils').environment;
var amqp = require('amqplib/callback_api');

function Base(connectionString, queue) {
  this.connectionString = connectionString;
  this.queue = queue;
}

Base.createConnectionStringFromEnvironment = function () {
  var format = 'amqp://%s:%s@%s:%s';
  return util.format(format, env.RABBITMQ_USERNAME, env.RABBITMQ_PASSWORD,
    env.RABBITMQ_HOST, env.RABBITMQ_PORT);
};

Base.getConnectionStringFromEnvironment = function () {
  var connectionString = env.RABBITMQ_CONNECTION_STRING;
  return (connectionString) ? connectionString : exports.createConnectionStringFromEnvironment();
};

Base.getQueueFromEnvironment = function () {
  return env.RABBITMQ_QUEUE;
};

function onError(error, connection, callback) {
  if (connection) {
    return connection.close(function () {
      callback(error);
    });
  }

  callback(error);
}

Base.prototype.connect = function (callback) {
  var me = this;

  amqp.connection(me.connectionString, function (error, connection) {
    if (error) {
      return onError(error, connection, callback);
    }

    connection.createChannel(function (error, channel) {
      if (error) {
        return onError(error, connection, callback);
      }

      channel.assertQueue(me.queue, {durable: true}, function (error) {
        if (error) {
          return onError(error, connection, callback);
        }

        callback(null, connection, channel);
      });
    });
  });
};

module.exports = {
  Base: Base,
  create: function (connectionString, queue) {
    return new Base(connectionString || utils.getConnectionStringFromEnvironment(), queue || utils.getQueueFromEnvironment());
  }
};
