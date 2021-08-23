import React from 'react';
import styled from 'styled-components';

const WithOverlay = styled.div`
  position: absolute;
  top: 30px;
  ${props => props.visible ? '' : 'display: none;'}
`;
const PopupView = styled.div`
  position: relative;
  z-index: 3; 
`;
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
`;

export default function Popup(props) {

  return (
    <WithOverlay visible={props.show}>
      <Overlay onClick={props.hide} />
      <PopupView>
        {props.children}
      </PopupView>
    </WithOverlay>
  );
}