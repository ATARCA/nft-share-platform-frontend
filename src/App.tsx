import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';

import Home from './components/topLevel/Home';
import TokenDetailPage from './components/topLevel/TokenDetailPage';
import MintPage from './components/topLevel/MintPage';
import TokenSharePage from './components/topLevel/TokenSharePage';
import { AboutPage } from './components/topLevel/AboutPage';
import { WalletDetailPage } from './components/topLevel/WalletDetailPage';
import PrivacyPolicy from './components/privacyPolicy/PrivacyPolicy';
import Footer from './components/Footer';
import { ManageConsentPage } from './components/topLevel/ManageConsentPage';
import { useConsentNeeded } from './hooks/hooks';
import ProjectPage from './components/topLevel/ProjectPage';
import PageHeaderMenu from './components/PageHeaderMenu';
import { aboutRoute, mintRoute, manageConsentRoute, projectRoute, tokenDetailRoute, tokenShareRoute, walletDetailRoute, homeRoute, faqRoute } from './routingUtils';
import { Container } from 'semantic-ui-react';
import { FaqPage } from './components/topLevel/FaqPage';

function App() {

    const [consentNeeded, refetchConsent] = useConsentNeeded()

    return (
        <Container>
            <div className="App">
                <Router>                
                    <PrivacyPolicy/>
                    {consentNeeded ? <PageHeaderMenu/> :
                        <Routes>
                            <Route path={faqRoute} element={
                                <>
                                    <PageHeaderMenu/>
                                    <FaqPage/>
                                </>}
                            /> 
                            <Route path={aboutRoute} element={
                                <>
                                    <PageHeaderMenu/>
                                    <AboutPage/>
                                </>}
                            /> 
                            <Route path={mintRoute} element={
                                <>
                                    <PageHeaderMenu/>
                                    <MintPage/>
                                </>}
                            /> 
                            <Route path={manageConsentRoute} element={
                                <>
                                    <PageHeaderMenu/>
                                    <ManageConsentPage/>
                                </>}
                            /> 
                            <Route path={projectRoute} element={
                                <>
                                    <PageHeaderMenu/>
                                    <ProjectPage/>
                                </>}
                            />
                            <Route path={tokenDetailRoute} element={
                                <>
                                    <PageHeaderMenu/>
                                    <TokenDetailPage/>
                                </>}
                            />
                            <Route path={tokenShareRoute} element={
                                <>
                                    <PageHeaderMenu/>
                                    <TokenSharePage/>
                                </>}
                            />
                            <Route path={walletDetailRoute} element={
                                <>
                                    <PageHeaderMenu/>
                                    <WalletDetailPage/>
                                </>}
                            />
                        
                            <Route path={homeRoute} element={
                                <>
                                    <PageHeaderMenu/>
                                    <Home/>
                                </>}
                            />
                        </Routes>}
                </Router>
                <Footer/>
            </div>
        </Container>
    );
}

export default App;
