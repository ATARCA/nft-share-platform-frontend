import React, { useEffect, useState } from 'react';
import './App.css';
import Welcome from './components/Welcome';
import { GET_ALL_BOOKS } from './queries-backend/allBooksQuery';
import { GET_MULTIPLY } from './queries-backend/multiplyQuery';
import { useQuery, useLazyQuery } from '@apollo/client'
import { MultiplyQuery, MultiplyQueryVariables } from './queries-backend/types-backend/MultiplyQuery';
import { AllBooksQuery } from './queries-backend/types-backend/AllBooksQuery';
import MetamaskConnectSubMenu from './components/MetamaskConnectSubmenu';
import { Menu } from 'semantic-ui-react';
import { SendDemoTransaction } from './components/SendDemoTransaction';
import { backendApolloClient } from './graphql/backendApolloClient';
import { GET_SHAREABLE_TOKEN } from './queries-thegraph/shareableTokensQuery';
import { ShareableTokenQuery } from './queries-thegraph/types-thegraph/ShareableTokenQuery';
import { theGraphApolloClient } from './graphql/theGraphApolloClient';
import { Token } from 'graphql';
import TokenGrid from './components/TokenGrid';

function App() {
    
    const [value1, setValue1] = useState('');
    const [value2, setValue2] = useState('');

    const allgraphShareTokensResult = useQuery<ShareableTokenQuery,undefined>(GET_SHAREABLE_TOKEN, {client: theGraphApolloClient, pollInterval: 5000});
    const renderBooks = () => {
        if (allBooksResult.loading)
            return <div>Loading</div>
        else
            return (
                allBooksResult.data?.allBooks.map( (b) => <div key={b.title}>{b.author} {b.title}</div>)
            )
    }

    const allBooksResult = useQuery<AllBooksQuery,undefined>(GET_ALL_BOOKS, {client: backendApolloClient});
   
    const [getMultiply, multiplyResult] = useLazyQuery<MultiplyQuery, MultiplyQueryVariables>(GET_MULTIPLY,{ client: backendApolloClient,
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
            <TokenGrid tokens={allgraphShareTokensResult.data?.shareableTokens || []} isLoading={allgraphShareTokensResult.loading}/>
        </div>
    );
}

export default App;
