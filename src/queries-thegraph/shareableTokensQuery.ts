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