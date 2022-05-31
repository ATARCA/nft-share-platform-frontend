/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddPendingMetadataMutation
// ====================================================

export interface AddPendingMetadataMutation_addPendingMetadata {
  __typename: "Result";
  success: boolean;
  message: string | null;
}

export interface AddPendingMetadataMutation {
  addPendingMetadata: AddPendingMetadataMutation_addPendingMetadata;
}

export interface AddPendingMetadataMutationVariables {
  pendingTxHash: string;
  metadata: string;
  signingAddress: string;
  signature: string;
}
