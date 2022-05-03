/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddSignedConsentMutation
// ====================================================

export interface AddSignedConsentMutation_addSignedConsent {
  __typename: "Result";
  success: boolean;
  message: string | null;
}

export interface AddSignedConsentMutation {
  addSignedConsent: AddSignedConsentMutation_addSignedConsent;
}

export interface AddSignedConsentMutationVariables {
  signingAddress: string;
  signature: string;
  consentText: string;
}
