import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { L18N_NAMESPACE } from '../../utils/constans';

const LanguagePanel = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;
const Dropdown = styled.div`
  text-align: right;
  position: relative;
  display: inline-block;
  &:hover > div {
    position: relative;
    display: block;
  }
  ${props => props.open ? `
    & > div {
      position: relative;
      display: block;
    }
  ` : ''}
`;
const DropdownButton = styled.div`
  text-align: right;
  padding: 12px;
  font-size: 18px;
  border: none;
  cursor: pointer;
  user-select: none;
  display: inline-block;
`;
const DropdownContent = styled.div`
  display: none;
  position: absolute;
  text-align: left;
  background-color: #f9f9f9;
  box-shadow: -4px 8px 16px 0px rgba(0,0,0,0.4);
  right: 0;
  cursor: pointer;
  padding: 13px;
  user-select: none;
  z-index: 1;
  &:hover {
    background-color: ${props => props.theme.colors.secondaryLight};
  }
`;
const LanguageIcon = styled.div`
  border-radius: 50%;
  background-color: ${props => props.theme.colors.secondary};
  width: 25px;
  height: 25px;
  font-size: 0.8em;
  text-align: center;
  line-height: 1.7;
`;

const languages = {
  'en': { symbol: 'En', name: 'English' },
  'ru': { symbol: 'Ру', name: 'Русский' },
};

export default function LanguageSelector() {

  const [lang, i18n] = useTranslation(L18N_NAMESPACE);

  const [isOpen, setOpen] = useState(false);

  const handleChange = (langId) => {
    if (langId !== i18n.language && 
        i18n.hasResourceBundle(langId, L18N_NAMESPACE)) {
      i18n.changeLanguage(langId);
    }
  };

  const handleLangClick = () => {
    setOpen(!isOpen);
  };

  return (
    <LanguagePanel>
      <Dropdown open={isOpen}>
        <DropdownButton onClick={handleLangClick}>
          <LanguageIcon>
            {languages[i18n.language].symbol}
          </LanguageIcon>
        </DropdownButton>
        {Object.keys(languages).map(ln => (
          <DropdownContent key={`lang-${ln}`} onClick={handleChange.bind(null, ln)}>
            {languages[ln].name}
          </DropdownContent>
        ))}
      </Dropdown>
    </LanguagePanel>
  );
}
