import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';

import MetamaskConnectSubMenu from './components/MetamaskConnectSubmenu';
import { Menu } from 'semantic-ui-react';
import Home from './components/topLevel/Home';
import TokenDetailPage from './components/topLevel/TokenDetailPage';
import ConsentPanel from './components/ConsentPanel';


function App() {
    
    return (
        <div className="App">
            <Router>
                <Menu>
                    <MetamaskConnectSubMenu/>    
                </Menu>
                <ConsentPanel/>

                <Routes>
                    <Route path="token/:tokenId" element={<TokenDetailPage/>}/>
                    <Route path="/" element={<Home/>}/>
                </Routes>
            </Router>
         
        </div>
    );
}

export default App;
