import { gql } from '@apollo/client'

export const GET_TOKENS = gql`
query TokensQuery ($isOriginal: Boolean!, $isSharedInstance: Boolean!){
  shareableTokens ( where: {isOriginal: $isOriginal, isSharedInstance: $isSharedInstance}){
    id
    ownerAddress
    contractAddress
    isOriginal
    isSharedInstance
    isLikeToken
    tokenId
    sharedChildTokens {
      id
    }
    likeTokens {
      id
    }
    likedParentToken {
      likeTokens {
        id
      }
    }
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
    }
    likeTokens {
      id
    }
    likedParentToken {
      likeTokens {
        id
      }
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
