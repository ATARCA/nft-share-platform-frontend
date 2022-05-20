import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';

import MetamaskConnectSubMenu from './components/MetamaskConnectSubmenu';
import { Dropdown, Menu } from 'semantic-ui-react';
import Home from './components/topLevel/Home';
import TokenDetailPage from './components/topLevel/TokenDetailPage';
import ConsentPanel from './components/ConsentPanel';
import MintPage from './components/topLevel/MintPage';
import MainMenuDropdown from './components/MainMenuDropdown';
import HomeMenuButton from './components/HomeMenuButton';

function App() {

    return (
        <div className="App">
            <Router>
                <Menu>
                    <HomeMenuButton/>
                    <MetamaskConnectSubMenu/>    
                    <MainMenuDropdown/>
                </Menu>
                <ConsentPanel/>

                <Routes>
                    <Route path="/mint" element={<MintPage/>}/> 
                    <Route path="token/:contractAddress/:tokenId" element={<TokenDetailPage/>}/>
                    <Route path="/" element={<Home/>}/>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
