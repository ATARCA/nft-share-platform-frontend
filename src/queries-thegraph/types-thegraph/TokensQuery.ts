/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TokensQuery
// ====================================================

export interface TokensQuery_tokens_sharedChildTokens {
  __typename: "Token";
  id: string;
}

export interface TokensQuery_tokens_likeTokens {
  __typename: "Token";
  id: string;
}

export interface TokensQuery_tokens_likedParentToken_likeTokens {
  __typename: "Token";
  id: string;
}

export interface TokensQuery_tokens_likedParentToken {
  __typename: "Token";
  likeTokens: TokensQuery_tokens_likedParentToken_likeTokens[];
}

export interface TokensQuery_tokens {
  __typename: "Token";
  id: string;
  ownerAddress: any;
  contractAddress: any;
  isOriginal: boolean;
  isSharedInstance: boolean;
  isOriginalOrShared: boolean;
  isLikeToken: boolean;
  tokenId: any | null;
  metadataUri: string | null;
  sharedChildTokens: TokensQuery_tokens_sharedChildTokens[];
  likeTokens: TokensQuery_tokens_likeTokens[];
  likedParentToken: TokensQuery_tokens_likedParentToken | null;
}

export interface TokensQuery {
  tokens: TokensQuery_tokens[];
}

export interface TokensQueryVariables {
  isOriginalOrShared: boolean;
  category: string;
  project: string;
}
