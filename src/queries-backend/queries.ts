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