import io from "socket.io-client";

export class Socket {

  static build() {
    const socketIO = io.connect('/');
    const socketHelper = new Socket(socketIO);

    return new Proxy(socketHelper, {
      get: function(target, property) {
        // console.log('Call Socket -> ' + property);
        return target[property] || socketIO[property];
      }
    });
  }

  constructor(socket) {
    this.socket = socket;
  }

  executeWhenConnected(action) {
    if (this.socket.connected) {
      if (action) action.call(null);
      return;
    }
    const doAction = () => {
      if (action) action.call(null);
      this.socket.off('connect', doAction);
    };
    this.socket.on('connect', doAction);
    this.socket.connect();
  }
}