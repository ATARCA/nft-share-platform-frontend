/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FirstTokensQuery
// ====================================================

export interface FirstTokensQuery_tokens_sharedChildTokens {
  __typename: "Token";
  id: string;
}

export interface FirstTokensQuery_tokens_likeTokens {
  __typename: "Token";
  id: string;
}

export interface FirstTokensQuery_tokens_likedParentToken_likeTokens {
  __typename: "Token";
  id: string;
}

export interface FirstTokensQuery_tokens_likedParentToken {
  __typename: "Token";
  likeTokens: FirstTokensQuery_tokens_likedParentToken_likeTokens[];
}

export interface FirstTokensQuery_tokens {
  __typename: "Token";
  id: string;
  ownerAddress: any;
  contractAddress: any;
  isOriginal: boolean;
  isSharedInstance: boolean;
  isOriginalOrShared: boolean;
  isLikeToken: boolean;
  isEndorseToken: boolean;
  tokenId: any | null;
  metadataUri: string | null;
  sharedChildTokens: FirstTokensQuery_tokens_sharedChildTokens[];
  likeTokens: FirstTokensQuery_tokens_likeTokens[];
  likedParentToken: FirstTokensQuery_tokens_likedParentToken | null;
}

export interface FirstTokensQuery {
  tokens: FirstTokensQuery_tokens[];
}

export interface FirstTokensQueryVariables {
  project: string;
  first: number;
}
