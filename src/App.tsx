import React from 'react';
import logo from './logo.svg';
import './App.css';

interface WelcomeProps {
  name: string;
}

const Welcome = (props: WelcomeProps) => {
    return <h1>Hello, {props.name}</h1>;
};

function App() {
    return (
        <div className="App">
            <Welcome name='developer'/>
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                  Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
