import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export const backendApolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        uri: 'http://localhost:4000/graphql',
    })
})