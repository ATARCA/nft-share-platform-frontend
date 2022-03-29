/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ShareableTokenByIdQuery
// ====================================================

export interface ShareableTokenByIdQuery_shareableToken {
  __typename: "ShareableToken";
  id: string;
  owner: any;
  sharedBy: any[];
  sharedWith: any[];
}

export interface ShareableTokenByIdQuery {
  shareableToken: ShareableTokenByIdQuery_shareableToken | null;
}

export interface ShareableTokenByIdQueryVariables {
  id: string;
}
