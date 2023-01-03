/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: EndorseTokensOfTokenQuery
// ====================================================

export interface EndorseTokensOfTokenQuery_tokens_project {
  __typename: "Project";
  id: string;
}

export interface EndorseTokensOfTokenQuery_tokens_endorsedParentToken {
  __typename: "Token";
  id: string;
}

export interface EndorseTokensOfTokenQuery_tokens {
  __typename: "Token";
  id: string;
  project: EndorseTokensOfTokenQuery_tokens_project;
  ownerAddress: any;
  contractAddress: any;
  isOriginal: boolean;
  isSharedInstance: boolean;
  isLikeToken: boolean;
  isEndorseToken: boolean;
  tokenId: any | null;
  metadataUri: string | null;
  endorsedParentToken: EndorseTokensOfTokenQuery_tokens_endorsedParentToken | null;
}

export interface EndorseTokensOfTokenQuery {
  tokens: EndorseTokensOfTokenQuery_tokens[];
}

export interface EndorseTokensOfTokenQueryVariables {
  parentTokenEntityId: string;
}
