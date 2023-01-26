import { gql } from '@apollo/client'

export const GET_TOKENS = gql`
query TokensQuery ($isOriginalOrShared: Boolean!, $category: String!, $project: String!){
  tokens ( orderBy: mintBlock, orderDirection: desc, where: {isOriginalOrShared: $isOriginalOrShared, category_starts_with: $category, category_ends_with: $category, project: $project}){
    id
    ownerAddress
    contractAddress
    isOriginal
    isSharedInstance
    isOriginalOrShared
    isLikeToken
    isEndorseToken
    tokenId
    metadataUri
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

export const GET_FIRST_X_TOKENS = gql`
query FirstTokensQuery ($project: String!, $first: Int!){
  tokens ( orderBy: mintBlock, orderDirection: desc, first: $first, where: {isOriginal: true, project: $project}){
    id
    ownerAddress
    contractAddress
    isOriginal
    isSharedInstance
    isOriginalOrShared
    isLikeToken
    isEndorseToken
    tokenId
    metadataUri
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
    isEndorseToken
    tokenId
    parentTokenId
    metadataUri
    project {
      id
    }
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
    endorseContractAddress
    categories {
      id
    }
  }
}
`

export const GET_ALL_PROJECTS = gql`
query AllProjectsQuery ( $filterId: ID!) {
  projects (where: {id_not: $filterId}){
    id
  } 
}
`

export const GET_TOKENS_OF_ADDRESS = gql`
query TokensOfAddressQuery ($address: Bytes!, $isOriginal: Boolean!, $isSharedInstance: Boolean!, $isLikeToken: Boolean!, $isEndorseToken: Boolean!){
  tokens(
    where: {
    	ownerAddress: $address, 
    	isOriginal: $isOriginal, 
    	isSharedInstance: $isSharedInstance, 
    	isLikeToken: $isLikeToken,
      isEndorseToken: $isEndorseToken}) {
    id
    project {
      id
    }
    ownerAddress
    contractAddress
    isOriginal
    isSharedInstance
    isLikeToken
    isEndorseToken
    tokenId
    parentTokenId
    metadataUri
    likedParentToken {
      likeTokens {
        id
      }
    }
    endorsedParentToken {
      id
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

export const GET_ENDORSE_TOKENS_OF_TOKEN = gql`
query EndorseTokensOfTokenQuery ($parentTokenEntityId: String!){
  tokens(
    where: {
    	endorsedParentToken: $parentTokenEntityId, 
      isEndorseToken: true}) {
    id
    project {
      id
    }
    ownerAddress
    contractAddress
    isOriginal
    isSharedInstance
    isLikeToken
    isEndorseToken
    tokenId
    metadataUri
    endorsedParentToken {
      id
    }
    metadataUri
  }
}
`





