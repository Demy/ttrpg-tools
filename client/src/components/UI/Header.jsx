import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom'
import styled from 'styled-components';
import { L18N_NAMESPACE } from '../../utils/constans';
import Die from '../Dice/Die';
import LanguageSelector from './LanguageSelector';

const HeaderContainer = styled.header`
  text-align: left;
  background: #f5f5f5;
  border: 1px solid #898989;
  display: relative;
`;
const LogoButton = styled.div`
  cursor: pointer;
  padding: 2px 10px;
  display: inline-block;
  vertical-align: middle;
`;
const Title = styled.div`
  display: inline-block;
  vertical-align: middle;
  margin: 12px 5px;
  & a {
    text-decoration: none;
    color: #000000;
  }
`;

export default function Header(props) {

  const [lang] = useTranslation(L18N_NAMESPACE);

  const history = useHistory();

  const handleLogoClick = () => {
    history.push('/');
  };

  return (
    <HeaderContainer>
      <LogoButton onClick={handleLogoClick}>
        <Die sides={10} color="white" value={10} size="tiny" />
      </LogoButton>
      <Title><Link to="/">TTRPG Tools</Link></Title>
      <LanguageSelector />
    </HeaderContainer>
  );
}
