/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TokensQuery
// ====================================================

export interface TokensQuery_shareableTokens_sharedChildTokens {
  __typename: "ShareableToken";
  id: string;
}

export interface TokensQuery_shareableTokens_likeTokens {
  __typename: "ShareableToken";
  id: string;
}

export interface TokensQuery_shareableTokens_likedParentToken_likeTokens {
  __typename: "ShareableToken";
  id: string;
}

export interface TokensQuery_shareableTokens_likedParentToken {
  __typename: "ShareableToken";
  likeTokens: TokensQuery_shareableTokens_likedParentToken_likeTokens[];
}

export interface TokensQuery_shareableTokens {
  __typename: "ShareableToken";
  id: string;
  ownerAddress: any;
  contractAddress: any;
  isOriginal: boolean;
  isSharedInstance: boolean;
  isLikeToken: boolean;
  tokenId: any | null;
  sharedChildTokens: TokensQuery_shareableTokens_sharedChildTokens[];
  likeTokens: TokensQuery_shareableTokens_likeTokens[];
  likedParentToken: TokensQuery_shareableTokens_likedParentToken | null;
}

export interface TokensQuery {
  shareableTokens: TokensQuery_shareableTokens[];
}

export interface TokensQueryVariables {
  isOriginal: boolean;
  isSharedInstance: boolean;
}
