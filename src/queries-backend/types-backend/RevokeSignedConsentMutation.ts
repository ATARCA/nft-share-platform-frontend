/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RevokeSignedConsentMutation
// ====================================================

export interface RevokeSignedConsentMutation_revokeSignedConsent {
  __typename: "Result";
  success: boolean;
  message: string | null;
}

export interface RevokeSignedConsentMutation {
  revokeSignedConsent: RevokeSignedConsentMutation_revokeSignedConsent;
}

export interface RevokeSignedConsentMutationVariables {
  signingAddress: string;
  signature: string;
  consentText: string;
}
