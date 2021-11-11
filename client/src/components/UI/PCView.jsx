import React from 'react';
import styled from 'styled-components';
import { MOBILE_SCREEN } from '../../utils/constans';

const PCViewContainer = styled.div`
  display: none;
  @media (min-width: ${MOBILE_SCREEN}) {
    display: inline-block;
  }
`;

export default function PCView(props) {

  return (
    <PCViewContainer>
      {props.children}
    </PCViewContainer>
  );
}
