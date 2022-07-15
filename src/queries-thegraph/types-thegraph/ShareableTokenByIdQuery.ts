/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ShareableTokenByIdQuery
// ====================================================

export interface ShareableTokenByIdQuery_shareableToken_sharedChildTokens {
  __typename: "ShareableToken";
  id: string;
}

export interface ShareableTokenByIdQuery_shareableToken_likeTokens {
  __typename: "ShareableToken";
  id: string;
}

export interface ShareableTokenByIdQuery_shareableToken_likedParentToken_likeTokens {
  __typename: "ShareableToken";
  id: string;
}

export interface ShareableTokenByIdQuery_shareableToken_likedParentToken {
  __typename: "ShareableToken";
  likeTokens: ShareableTokenByIdQuery_shareableToken_likedParentToken_likeTokens[];
}

export interface ShareableTokenByIdQuery_shareableToken {
  __typename: "ShareableToken";
  id: string;
  ownerAddress: any;
  contractAddress: any;
  isOriginal: boolean;
  isSharedInstance: boolean;
  isLikeToken: boolean;
  tokenId: any | null;
  sharedChildTokens: ShareableTokenByIdQuery_shareableToken_sharedChildTokens[];
  likeTokens: ShareableTokenByIdQuery_shareableToken_likeTokens[];
  likedParentToken: ShareableTokenByIdQuery_shareableToken_likedParentToken | null;
}

export interface ShareableTokenByIdQuery {
  shareableToken: ShareableTokenByIdQuery_shareableToken | null;
}

export interface ShareableTokenByIdQueryVariables {
  id: string;
}
