import React, { useEffect, useState } from 'react';
import './App.css';
import Welcome from './components/Welcome';
import { GET_ALL_BOOKS } from './queries/allBooksQuery';
import { GET_MULTIPLY } from './queries/multiplyQuery';
import { useQuery, useLazyQuery } from '@apollo/client'
import { MultiplyQuery, MultiplyQueryVariables } from './queries/types/multiplyQuery';
import { AllBooksQuery } from './queries/types/allBooksQuery';
import MetamaskConnectSubMenu from './components/MetamaskConnectSubmenu';
import { Menu } from 'semantic-ui-react';
import { SendDemoTransaction } from './components/SendDemoTransaction';

function App() {
    
    const [value1, setValue1] = useState('');
    const [value2, setValue2] = useState('');

    const renderBooks = () => {
        if (allBooksResult.loading)
            return <div>Loading</div>
        else
            return (
                allBooksResult.data?.allBooks.map( (b) => <div key={b.title}>{b.author} {b.title}</div>)
            )
    }

    const allBooksResult = useQuery<AllBooksQuery,undefined>(GET_ALL_BOOKS);
   
    const [getMultiply, multiplyResult] = useLazyQuery<MultiplyQuery, MultiplyQueryVariables>(GET_MULTIPLY,{
        onError: (error) => {
            console.log('error', error)
        }
    })

    useEffect(() => {
        getMultiply({variables: {value1: Number(value1), value2: Number(value2)}})
    }, [value1, value2, getMultiply])

    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault()
    }

    const renderValuesForm = () => {
        return <form onSubmit={handleSubmit}>
            <label> Value1
                <input type="text" 
                    value={value1}
                    onChange={({ target }) => setValue1(target.value)}/>
            </label>
            <label> Value2
                <input type="text"
                    value={value2}
                    onChange={({ target }) => setValue2(target.value)}/>
            </label>
            <div>
                {multiplyResult.data?.multiply.value}
            </div>
        </form>
    }

    return (
        <div className="App">
            <Menu>
                <MetamaskConnectSubMenu/>
            </Menu>
            <Welcome name='developer'/>
            {renderBooks()}
            {renderValuesForm()}
            <SendDemoTransaction/>
        </div>
    );
}

export default App;
