/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ShareableTokenQuery
// ====================================================

export interface ShareableTokenQuery_shareableTokens {
  __typename: "ShareableToken";
  id: string;
  owner: any;
  sharedBy: any[];
  sharedWith: any[];
}

export interface ShareableTokenQuery {
  shareableTokens: ShareableTokenQuery_shareableTokens[];
}
