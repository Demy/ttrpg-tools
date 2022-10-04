import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: 10px 20px;
  cursor: pointer;
  min-width: 85px;
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 5px;
  border: none;
  color: ${(props) => props.theme.colors.textAccent};
`;

export default function SimpleButton(props) {
  return <StyledButton {...props} />;
}