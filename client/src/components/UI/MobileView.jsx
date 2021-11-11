import React from 'react';
import styled from 'styled-components';
import { MOBILE_SCREEN } from '../../utils/constans';

const MobileViewContainer = styled.div`
  @media (min-width: ${MOBILE_SCREEN}) {
    display: none;
  }
`;

export default function MobileView(props) {

  return (
    <MobileViewContainer>
      {props.children}
    </MobileViewContainer>
  );
}
