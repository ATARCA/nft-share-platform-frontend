/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OriginalTokenQuery
// ====================================================

export interface OriginalTokenQuery_shareableTokens {
  __typename: "ShareableToken";
  id: string;
  ownerAddress: any;
  contractAddress: any;
  isOriginal: boolean;
  isSharedInstance: boolean;
  tokenId: any | null;
}

export interface OriginalTokenQuery {
  shareableTokens: OriginalTokenQuery_shareableTokens[];
}
