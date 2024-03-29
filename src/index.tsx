import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-less/semantic.less'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import TagManager from 'react-gtm-module';

const gaTagManagerId : string | undefined  = process.env.REACT_APP_GA_TAG_MANAGER

if (gaTagManagerId !== undefined) {
    const tagManagerArgs = {
        gtmId: gaTagManagerId
    }
    TagManager.initialize(tagManagerArgs)
}

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
