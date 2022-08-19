/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: LikeTokenExistsQuery
// ====================================================

export interface LikeTokenExistsQuery_tokens_likedParentToken {
  __typename: "Token";
  id: string;
  ownerAddress: any;
  tokenId: any | null;
  contractAddress: any;
}

export interface LikeTokenExistsQuery_tokens {
  __typename: "Token";
  id: string;
  ownerAddress: any;
  contractAddress: any;
  isLikeToken: boolean;
  isOriginal: boolean;
  isSharedInstance: boolean;
  likedParentToken: LikeTokenExistsQuery_tokens_likedParentToken | null;
}

export interface LikeTokenExistsQuery {
  tokens: LikeTokenExistsQuery_tokens[];
}

export interface LikeTokenExistsQueryVariables {
  likeTokenOwnerAddress: any;
  parentTokenEntityId: string;
}
