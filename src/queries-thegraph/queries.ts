import { gql } from '@apollo/client'

export const GET_SHAREABLE_TOKEN = gql`
query ShareableTokenQuery{
  shareableTokens {
    id
    owner
    sharedBy
    sharedWith
  }
}
`

export const GET_TOKEN_BY_ID = gql`
query ShareableTokenByIdQuery ($id: String!){
  shareableToken( id: $id) {
    id
    owner
    sharedBy
    sharedWith
  }
}
`