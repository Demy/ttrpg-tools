import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// Redux
import { Provider } from 'react-redux';
import store from './redux';
// Translation
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';
import ttrpg_ru from "./assets/lang/ru/ttrpg.json";
import ttrpg_en from "./assets/lang/en/ttrpg.json";
import Theme from './components/UI/Theme';

const userLang = navigator.language || navigator.userLanguage;
const separator = userLang.indexOf('-');
const langId = separator > 0 ? userLang.substring(0, separator) : userLang;

i18next.init({
  interpolation: { escapeValue: false }, 
  lng: langId ? langId : 'en', 
  fallbackLng: 'en',
  resources: {
    en: {
      ttrpg: ttrpg_en
    },
    ru: {
      ttrpg: ttrpg_ru
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18next}>
        <Theme>
          <App />
        </Theme>
      </I18nextProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
