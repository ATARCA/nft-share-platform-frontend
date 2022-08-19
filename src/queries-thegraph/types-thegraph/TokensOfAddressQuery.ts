/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TokensOfAddressQuery
// ====================================================

export interface TokensOfAddressQuery_tokens_project {
  __typename: "Project";
  id: string;
}

export interface TokensOfAddressQuery_tokens_likedParentToken_likeTokens {
  __typename: "Token";
  id: string;
}

export interface TokensOfAddressQuery_tokens_likedParentToken {
  __typename: "Token";
  likeTokens: TokensOfAddressQuery_tokens_likedParentToken_likeTokens[];
}

export interface TokensOfAddressQuery_tokens_sharedChildTokens {
  __typename: "Token";
  id: string;
}

export interface TokensOfAddressQuery_tokens_likeTokens {
  __typename: "Token";
  id: string;
}

export interface TokensOfAddressQuery_tokens {
  __typename: "Token";
  id: string;
  project: TokensOfAddressQuery_tokens_project;
  ownerAddress: any;
  contractAddress: any;
  isOriginal: boolean;
  isSharedInstance: boolean;
  isLikeToken: boolean;
  tokenId: any | null;
  parentTokenId: any | null;
  likedParentToken: TokensOfAddressQuery_tokens_likedParentToken | null;
  sharedChildTokens: TokensOfAddressQuery_tokens_sharedChildTokens[];
  likeTokens: TokensOfAddressQuery_tokens_likeTokens[];
  metadataUri: string | null;
}

export interface TokensOfAddressQuery {
  tokens: TokensOfAddressQuery_tokens[];
}

export interface TokensOfAddressQueryVariables {
  projectId: string;
  address: any;
  isOriginal: boolean;
  isSharedInstance: boolean;
  isLikeToken: boolean;
}
