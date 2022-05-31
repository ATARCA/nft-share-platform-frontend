import { gql } from '@apollo/client'

export const GET_ALL_BOOKS = gql`
query AllBooksQuery{
  allBooks {
      title
      author
  }
}
`

export const GET_MULTIPLY = gql`
query MultiplyQuery ($value1: Int!, $value2: Int!){
  multiply(value1: $value1, value2: $value2) {
      value
  }
}
`

export const GET_MESSAGE_TO_SIGN_FOR_METADATA_UPLOAD = gql`
query GetMessageToSignForMetadataUploadQuery ($txHash: String!, $metadata: String!){
  getMetadataUploadMessageToSign( txHash: $txHash, metadata: $metadata)
}
`

export const GET_CONSENT_MESSAGE_TO_SIGN = gql`
query GetConsentMessageToSignQuery {
  getConsentMessageToSign 
}
`

export const ADD_SIGNED_CONSENT = gql`
mutation AddSignedConsentMutation  ($signingAddress: String!, $signature: String!, $consentText: String!){
  addSignedConsent( signingAddress: $signingAddress, signature: $signature, consentText: $consentText ) {
    success, 
    message
  }
}
`

export const CONSENT_NEEDED = gql`
query ConsentNeededQuery ($address: String!){
  consentNeeded(address: $address) 
}
`

export const ADD_PENDING_METADATA = gql`
mutation AddPendingMetadataMutation  ($pendingTxHash: String!, $metadata: String!, $signingAddress: String!, $signature: String!){
  addPendingMetadata( pendingTxHash: $pendingTxHash, metadata: $metadata, signingAddress: $signingAddress, , signature: $signature ) {
    success, 
    message
  }
}
`