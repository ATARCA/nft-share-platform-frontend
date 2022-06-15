import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

if (process.env.REACT_APP_BACKEND_URI === undefined) {
    throw new Error('environment variable BACKEND_URI not defined')
}

export const backendApolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        uri: process.env.REACT_APP_BACKEND_URI + '/graphql',
    })
})