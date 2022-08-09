import { gql } from '@apollo/client'

export const GET_TOKENS = gql`
query TokensQuery ($isOriginal: Boolean!, $isSharedInstance: Boolean!){
  tokens ( where: {isOriginal: $isOriginal, isSharedInstance: $isSharedInstance}){
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
query TokenByIdQuery ($id: String!){
  token( id: $id) {
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
  tokens(where: {isLikeToken: true, ownerAddress:$likeTokenOwnerAddress, likedParentToken: $parentTokenEntityId}) {
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

export const GET_PROJECT_DETAILS = gql`
query ProjectDetailsQuery ($projectId: String!){
  project(id: $projectId) {
    id
    owner
    shareableContractAddress
    likeContractAddress
  }
}
`
