import React from 'react';

interface WelcomeProps {
    name: string;
  }

export const Welcome = (props: WelcomeProps) => {
    return <h1>Hello, {props.name}</h1>;
};

export default Welcome;