import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export const theGraphApolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        uri: 'https://api.thegraph.com/subgraphs/name/atarca/nft-share-platform-goerli',
    })
})