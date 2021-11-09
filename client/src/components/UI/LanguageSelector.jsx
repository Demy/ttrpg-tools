import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { L18N_NAMESPACE } from '../../utils/constans';

export default function LanguageSelector() {

  const [lang, setLang] = useState('');
  const [t, i18n] = useTranslation(L18N_NAMESPACE);

  const handleChange = (langId) => {
    if (langId !== i18n.language && langId !== lang && 
        i18n.hasResourceBundle(langId, L18N_NAMESPACE)) {
      i18n.changeLanguage(langId);
      setLang(langId);
    }
  };

  return (
    <></>
  );
}
