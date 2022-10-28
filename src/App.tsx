import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';

import MetamaskConnectSubMenu from './components/MetamaskConnectSubmenu';
import { Divider, Menu, Container } from 'semantic-ui-react';
import Home from './components/topLevel/Home';
import TokenDetailPage from './components/topLevel/TokenDetailPage';
import ConsentPanel from './components/ConsentPanel';
import MintPage from './components/topLevel/MintPage';
import MainMenuWalletDropdown from './components/MainMenuWalletDropdown';
import HomeMenuButtons from './components/menu/HomeMenuButtons';
import TokenSharePage from './components/topLevel/TokenSharePage';
import { AboutPage } from './components/topLevel/AboutPage';
import { aboutRoute, manageConsentRoute, mintRoute } from './routingUtils';
import { WalletDetailPage } from './components/topLevel/WalletDetailPage';
import PrivacyPolicy from './components/privacyPolicy/PrivacyPolicy';
import Footer from './components/Footer';
import { ManageConsentPage } from './components/topLevel/ManageConsentPage';
import { useConsentNeeded } from './hooks/hooks';

function App() {

    const [consentNeeded, refetchConsent] = useConsentNeeded()

    return (
        <Container>
            <div className="App">
                <Router>
                    <Menu secondary stackable={true}>
                        <HomeMenuButtons/>
                        <MetamaskConnectSubMenu/>    
                        <MainMenuWalletDropdown/>
                    </Menu>
                    <Divider fitted />
                    <ConsentPanel/>
                    
                    <PrivacyPolicy/>
                    {consentNeeded ? <></> :
                        <Routes>
                            <Route path={aboutRoute} element={<AboutPage/>}/> 
                            <Route path={mintRoute} element={<MintPage/>}/> 
                            <Route path={manageConsentRoute} element={<ManageConsentPage/>}/> 
                            <Route path="token/:contractAddress/:tokenId" element={<TokenDetailPage/>}/>
                            <Route path="shareToken/:contractAddress/:tokenId" element={<TokenSharePage/>}/>
                            <Route path="wallet/:walletAddress" element={<WalletDetailPage/>}/>
                            <Route path="/" element={<Home/>}/>
                        </Routes>}
                </Router>
                <Footer/>
            </div>
        </Container>
    );
}

export default App;
