import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';

import MetamaskConnectSubMenu from './components/MetamaskConnectSubmenu';
import { Divider, Menu } from 'semantic-ui-react';
import Home from './components/topLevel/Home';
import TokenDetailPage from './components/topLevel/TokenDetailPage';
import ConsentPanel from './components/ConsentPanel';
import MintPage from './components/topLevel/MintPage';
import MainMenuWalletDropdown from './components/MainMenuWalletDropdown';
import HomeMenuButtons from './components/menu/HomeMenuButtons';
import TokenSharePage from './components/topLevel/TokenSharePage';
import { AboutPage } from './components/topLevel/AboutPage';
import { aboutRoute } from './routingUtils';
import { WalletDetailPage } from './components/topLevel/WalletDetailPage';
import Footer from './components/Footer';

function App() {

    return (
        <div className="App">
            <Router>
                <Menu secondary>
                    <HomeMenuButtons/>
                    <MetamaskConnectSubMenu/>    
                    <MainMenuWalletDropdown/>
                </Menu>
                <Divider fitted />
                <ConsentPanel/>

                <Routes>
                    <Route path={aboutRoute} element={<AboutPage/>}/> 
                    <Route path="/mint" element={<MintPage/>}/> 
                    <Route path="token/:contractAddress/:tokenId" element={<TokenDetailPage/>}/>
                    <Route path="shareToken/:contractAddress/:tokenId" element={<TokenSharePage/>}/>
                    <Route path="wallet/:walletAddress" element={<WalletDetailPage/>}/>
                    <Route path="/" element={<Home/>}/>
                </Routes>
            </Router>
            <Footer/>
        </div>
    );
}

export default App;
