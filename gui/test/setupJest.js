global.fetch = require("jest-fetch-mock");
global.WebSocket = require("mock-socket").WebSocket;
global.window.history.replaceState = jest.fn();
global.window.confirm = function() {
  return true;
};
