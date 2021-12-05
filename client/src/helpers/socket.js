import io from "socket.io-client";

export class Socket {

  static build() {
    console.log('=== Build socket proxy ===');

    const socketIO = io.connect('/');
    const socketHelper = new Socket(socketIO);

    return new Proxy(socketHelper, {
      get: function(target, property) {
        console.log('Call Socket -> ' + property);
        return target[property] || socketIO[property];
      }
    });
  }

  constructor(socket) {
    this.socket = socket;

    this.socket.addEventListener('error', (e) => {
      console.log('addEventListener fired');
      console.log(e);
    });

    this.socket.on('error', (e) => {
      console.log('on error fired');
      console.log(e);
    });

    socket.on('connect_error', (e) => {
      console.log('Socket connection error');
      console.log(e);
    });
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