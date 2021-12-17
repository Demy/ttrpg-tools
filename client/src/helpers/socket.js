import io from "socket.io-client";
// import devLog from './logger';

export class Socket {

  static build() {
    const socketIO = io.connect('/');
    const socketHelper = new Socket(socketIO);

    return new Proxy(socketHelper, {
      get: function(target, property) {
        // devLog('Call Socket -> ' + property);
        return target[property] || socketIO[property];
      }
    });
  }

  constructor(socket) {
    this.socket = socket;

    socket.on("connect_error", (e) => {  
      console.log('Socket connection error');
      console.log(e);
      socket.disconnect();  
      setTimeout(() => {    
        socket.connect();  
      }, 1000);
    });

    socket.on("disconnect", (reason) => {
      console.log('Socket event: disconnect');
      console.log(reason);
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