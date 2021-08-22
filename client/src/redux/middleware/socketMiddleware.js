import io from 'socket.io-client';

export default function socketMiddleware() {
  const socket = io('/');

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