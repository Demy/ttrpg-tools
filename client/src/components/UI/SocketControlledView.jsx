import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Loading from './Loading';
import { useHistory } from 'react-router';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: inline-block;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: none;
  ${props => props.show ? `
    display: inline-block;
  ` : ''}
`;

export default function SocketControlledView(props) {

  const socket = useSelector(state => state.room.socket);

  const [isConnected, setConnected] = useState(socket && socket.connected);

  const history = useHistory();

  useEffect(() => {
    const onConnected = () => {
      setConnected(true);
    };
    const onDisconnected = () => {
      history.go(0);
    };

    if (socket) {
      socket.on('connect', onConnected);
      socket.on('disconnect', onDisconnected);

      return () => {
        socket.off('connect', onConnected);
        socket.off('disconnect', onDisconnected);
      };
    }

    return () => {};
  }, [history, socket]);

  return (
    <Container>
      {isConnected ? <></> : <Loading />}
      <Content show={isConnected}>
        {props.children}
      </Content>
    </Container>
  );
}
