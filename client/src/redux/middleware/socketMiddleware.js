import io from 'socket.io-client';

export default function socketMiddleware() {
  const socket = io(process.env.REACT_APP_SOCKET_URL);
  socket.on('connect_error', (e) => {
    console.log('Socket connection error: ' + process.env.REACT_APP_SOCKET_URL);
    console.log(e);
    socket.connect();
  });

  return store => next => (action) => {
    const dispatch = store.dispatch;
    if (typeof action === 'function') {
      return next(action);
    }

    const { event, leave, handle, emit, payload, ...rest } = action;

    if (!event) {
      return next(action);
    }

    if (leave) {
      socket.removeListener(event);
      return;
    }

    if (emit) {
      socket.emit(event, payload);
      return;
    }

    let handleEvent = handle;
    if (typeof handleEvent === 'string') {
      handleEvent = result => dispatch({ type: handle, result, ...rest });
    }
    
    return socket.on(event, (data) => handleEvent(data));
  };
}