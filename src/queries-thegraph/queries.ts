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

export const GET_LIKE_TOKEN_EXISTS = gql`
query LikeTokenExistsQuery ($likeTokenOwnerAddress: String!,$parentTokenEntityId: String!){
  shareableTokens(where: {isLikeToken: true, ownerAddress:$likeTokenOwnerAddress, likedParentToken: $parentTokenEntityId}) {
    id
    ownerAddress
    contractAddress
    isLikeToken
    isOriginal
    isSharedInstance
    likedParentToken {
      id
      ownerAddress
      tokenId
      contractAddress
    }
  }
}
`
