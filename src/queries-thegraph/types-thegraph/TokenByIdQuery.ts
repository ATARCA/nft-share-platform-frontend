/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TokenByIdQuery
// ====================================================

export interface TokenByIdQuery_token_project {
  __typename: "Project";
  id: string;
}

export interface TokenByIdQuery_token_sharedChildTokens {
  __typename: "Token";
  id: string;
}

export interface TokenByIdQuery_token_likeTokens {
  __typename: "Token";
  id: string;
}

export interface TokenByIdQuery_token_likedParentToken_likeTokens {
  __typename: "Token";
  id: string;
}

export interface TokenByIdQuery_token_likedParentToken {
  __typename: "Token";
  id: string;
  likeTokens: TokenByIdQuery_token_likedParentToken_likeTokens[];
}

export interface TokenByIdQuery_token {
  __typename: "Token";
  id: string;
  ownerAddress: any;
  contractAddress: any;
  isOriginal: boolean;
  isSharedInstance: boolean;
  isLikeToken: boolean;
  isEndorseToken: boolean;
  tokenId: any | null;
  parentTokenId: any | null;
  metadataUri: string | null;
  project: TokenByIdQuery_token_project;
  sharedChildTokens: TokenByIdQuery_token_sharedChildTokens[];
  likeTokens: TokenByIdQuery_token_likeTokens[];
  likedParentToken: TokenByIdQuery_token_likedParentToken | null;
}

export interface TokenByIdQuery {
  token: TokenByIdQuery_token | null;
}

export interface TokenByIdQueryVariables {
  id: string;
}
