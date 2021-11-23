import React from 'react';
import styled from 'styled-components';
import Popup from './Popup';

const ContentContainer = styled.div`
  margin: 0 auto;
  background-color: #ffffff;
  border: 1px solid #c0c0c0;
  padding: 20px 15px;
  ${props => props.width ? `width: ${props.width}px` : ''}
`;

export default function PopupWindow(props) {

  return (
    <Popup 
      show={props.show} 
      hide={props.hide}
      style={{
        left: 0,
        right: 0,
        top: '20%',
        bottom: 0
      }}
    >
      <ContentContainer width={props.width}>
        {props.children}
      </ContentContainer>
    </Popup>
  );
}