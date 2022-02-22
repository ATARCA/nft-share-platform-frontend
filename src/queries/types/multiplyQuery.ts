/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MultiplyQuery
// ====================================================

export interface MultiplyQuery_multiply {
  __typename: "MultiplyResult";
  value: number;
}

export interface MultiplyQuery {
  multiply: MultiplyQuery_multiply;
}

export interface MultiplyQueryVariables {
  value1: number;
  value2: number;
}
