import React from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom'
import styled from 'styled-components';
import Die from '../Dice/Die';
import LanguageSelector from './LanguageSelector';
import { theme } from './Theme';

const HeaderContainer = styled.header`
  text-align: left;
  background: ${props => props.theme.colors.primary};
  border-bottom: 1px solid ${props => props.theme.colors.primaryDark};
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
    color: ${props => props.theme.colors.textAccent};
  }
`;

export default function Header(props) {

  const history = useHistory();

  const handleLogoClick = () => {
    history.push('/');
  };

  return (
    <HeaderContainer>
      <LogoButton onClick={handleLogoClick}>
        <Die sides={10} color={theme.colors.textAccent} value={10} size="tiny" />
      </LogoButton>
      <Title><Link to="/">TTRPG Tools</Link></Title>
      <LanguageSelector />
    </HeaderContainer>
  );
}
