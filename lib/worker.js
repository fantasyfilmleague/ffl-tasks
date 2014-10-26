'use strict';

var util = require('util');
var Base = require('./base').Base;
var Listener = require('./listener').Listener;

function Worker(connectionString, queue, handlers) {
  var me = this;
  Listener.call(me, connectionString, queue);
  me.handlers = handlers;
}

util.inherits(Worker, Listener);

Worker.prototype.onMessageReceived = function (channel, message) {
  var me = this;

  var data = null;
  var type;
  var handler;
  var body = message.content.toString();

  try {
    data = JSON.parse(body);
    type = data.type;
    handler = me.handlers[type];
  } finally {
    if (handler) {
      handler(data, function () {});
    }
  }

  Listener.prototype.onMessageReceived.apply(me, arguments);
};

module.exports = {
  Worker: Worker,
  // todo: this deviation is not great but allows for defaults..revisit
  create: function (handlers, connectionString, queue) {
    return new Worker(connectionString || Base.getConnectionStringFromEnvironment(), queue || Base.getQueueFromEnvironment(), handlers);
  }
};
