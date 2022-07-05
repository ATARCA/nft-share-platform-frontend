import { gql } from '@apollo/client'

export const GET_ORIGINAL_TOKENS = gql`
query OriginalTokenQuery {
  shareableTokens ( where: {isOriginal: true}){
    id
    ownerAddress
    contractAddress
    isOriginal
    isSharedInstance
    tokenId
  }
}
`

export const GET_TOKEN_BY_ID = gql`
query ShareableTokenByIdQuery ($id: String!){
  shareableToken( id: $id) {
    id
    ownerAddress
    contractAddress
    isOriginal
    isSharedInstance
    isLikeToken
    tokenId
    sharedChildTokens {
      id
      ownerAddress
    }
    likeTokens {
      id
      ownerAddress
    }
  }
}
`