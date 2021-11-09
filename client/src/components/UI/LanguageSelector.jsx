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
`;
const DropdownContent = styled.div`
  display: none;
  position: absolute;
  text-align: left;
  background-color: #f9f9f9;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  right: 0;
  cursor: pointer;
  padding: 12px;
  user-select: none;
  z-index: 1;
`;

const languages = {
  'en': { symbol: '🇬🇧', name: 'english' },
  'ru': { symbol: '🇷🇺', name: 'russian' },
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
        <DropdownButton onClick={handleLangClick}>{languages[i18n.language].symbol}</DropdownButton>
        {Object.keys(languages).map(ln => (
          <DropdownContent key={`lang-${ln}`} onClick={handleChange.bind(null, ln)}>
            {languages[ln].symbol} {lang(languages[ln].name)}
          </DropdownContent>
        ))}
      </Dropdown>
    </LanguagePanel>
  );
}
