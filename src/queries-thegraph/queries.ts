import { gql } from '@apollo/client'

export const GET_TOKENS = gql`
query TokensQuery ($isOriginal: Boolean!, $isSharedInstance: Boolean!, $category: String!){
  tokens ( where: {isOriginal: $isOriginal, isSharedInstance: $isSharedInstance, category_starts_with: $category, category_ends_with: $category}){
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
query TokenByIdQuery ($id: ID!){
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
      id
      likeTokens {
        id
      }
    }
  }
}
`

export const GET_LIKE_TOKEN_EXISTS = gql`
query LikeTokenExistsQuery ($likeTokenOwnerAddress: Bytes!,$parentTokenEntityId: String!){
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
query ProjectDetailsQuery ($projectId: ID!){
  project(id: $projectId) {
    id
    operators
    shareableContractAddress
    likeContractAddress
    categories {
      id
    }
  }
}
`

export const GET_TOKENS_OF_ADDRESS = gql`
query TokensOfAddressQuery ($projectId: String!, $address: Bytes!, $isOriginal: Boolean!, $isSharedInstance: Boolean!, $isLikeToken: Boolean!){
  tokens(
    where: {
      project: $projectId, 
    	ownerAddress: $address, 
    	isOriginal: $isOriginal, 
    	isSharedInstance: $isSharedInstance, 
    	isLikeToken: $isLikeToken}) {
    id
    project {
      id
    }
    ownerAddress
    contractAddress
    isOriginal
    isSharedInstance
    isLikeToken
    tokenId
    parentTokenId
    likedParentToken {
      likeTokens {
        id
      }
    }
    sharedChildTokens {
      id
    }
    likeTokens {
      id
    }
    metadataUri
  }
}
`





