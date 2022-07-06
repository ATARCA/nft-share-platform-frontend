/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: LikeTokenExistsQuery
// ====================================================

export interface LikeTokenExistsQuery_shareableTokens_likedParentToken {
  __typename: "ShareableToken";
  id: string;
  ownerAddress: any;
  tokenId: any | null;
  contractAddress: any;
}

export interface LikeTokenExistsQuery_shareableTokens {
  __typename: "ShareableToken";
  id: string;
  ownerAddress: any;
  contractAddress: any;
  isLikeToken: boolean;
  isOriginal: boolean;
  isSharedInstance: boolean;
  likedParentToken: LikeTokenExistsQuery_shareableTokens_likedParentToken | null;
}

export interface LikeTokenExistsQuery {
  shareableTokens: LikeTokenExistsQuery_shareableTokens[];
}

export interface LikeTokenExistsQueryVariables {
  likeTokenOwnerAddress: string;
  parentTokenEntityId: string;
}
