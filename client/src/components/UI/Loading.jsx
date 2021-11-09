import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { L18N_NAMESPACE } from '../../utils/constans';

const LoadingText = styled.div`
  padding: 20px;
  color: #c0c0c0;
  ${props => props.middle ? `
    margin-top: 25%;
    font-size: 16pt;
  ` : ''}
`;

export default function Loading(props) {

  const [lang] = useTranslation(L18N_NAMESPACE);

  return (
    <LoadingText middle={props.middle}>
      {lang('loading')}...
    </LoadingText>
  );
}
