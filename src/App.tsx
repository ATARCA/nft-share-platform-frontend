import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Welcome from './components/Welcome';
import { gql, useQuery, useLazyQuery } from '@apollo/client'
//import { testQuery } from './queries/types/testQuery';
//import { multiplyQuery, multiplyQueryVariables } from './queries/types/multiplyQuery';
//import allBooksQuery from './queries/allBooksQuery';
//import multiplyQuery from './queries/multiplyQuery';

function App() {



    //const { loadingMultiply, dataMultiply } = useQuery<multiplyQuery,multiplyQueryVariables>(multiplyQuery);
    //const { loadingBooks, dataBooks } = useQuery<testQuery,Number>(allBooksQuery);

    interface Book {
        title: string,
        author: string
    }

    interface AllBooksData {
        allBooks: Book[];
    }

    interface AllBooksQueryVars {
    }

    const GET_ALL_BOOKS = gql`
    query {
      allBooks {
          title
          author
      }
    }
    `

    const GET_MULTIPLY = gql`
    query multiplyQuery ($value1X: Int!, $value2X: Int!){
      multiply(value1: $value1X, value2: $value2X) {
          value
      }
    }
    `
    
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

    interface MultiplyDataVars {
        value1X: number,
        value2X: number
    }

    interface MultiplyQuery {
        multiply: MultiplyResultData;
      }

    interface MultiplyResultData {
        value: number
    }

    const allBooksResult = useQuery<AllBooksData,AllBooksQueryVars>(GET_ALL_BOOKS);
    // const [getAllBooks, allBooksResult2] = useLazyQuery<AllBooksData, AllBooksQueryVars>(GET_ALL_BOOKS)

    /*  const  multiplyResult = useQuery<MultiplyQuery, MultiplyDataVars>(GET_MULTIPLY,{variables: {value1X: 2, value2X: 3},
        onError: (error) => {
            console.log(error)
        }
    })
*/
    const [getMultiply, multiplyResult] = useLazyQuery<MultiplyQuery, MultiplyDataVars>(GET_MULTIPLY,{variables: {value1X: Number(value1), value2X: Number(value2)},
        onError: (error) => {
            console.log(error)
        }
    })

    

    useEffect(() => {
        //  const data: MultiplyDataVars = {value1: Number(value1), value2: Number(value2)};
        //  getMultiply({variables: data})
        // getMultiply({variables: {value1: 2, value2: 3}});
        //console.log('running effect')
        //getAllBooks()
        getMultiply()
    }, [value1, value2])

    //console.log('allBooksResult2',allBooksResult2.data)

    //const data: MultiplyDataVars = {value1: 2, value2: 3};
    //getMultiply({variables: data})
    /* try {
        getMultiply({variables: {a: 2, b: 3}});
    } catch (error) {
        console.error(error)
    }*/

    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault()
    }

    console.log("multiplyResult",multiplyResult.data?.multiply.value)

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
                
            </div>
        </form>
    }
    //TODO to print result {multiplyResult.data}
    return (
        <div className="App">
            <Welcome name='developer'/>
            {renderBooks()}
            {renderValuesForm()}
        </div>
    );
}

export default App;
