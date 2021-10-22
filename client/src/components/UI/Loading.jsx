import React from 'react';
import styled from 'styled-components';

const LoadingText = styled.div`
  padding: 20px;
  color: #c0c0c0;
  ${props => props.middle ? `
    margin-top: 25%;
    font-size: 16pt;
  ` : ''}
`;

export default function Loading(props) {

  return (
    <LoadingText middle={props.middle}>Loading...</LoadingText>
  );
}
