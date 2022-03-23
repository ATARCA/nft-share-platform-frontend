import { gql } from '@apollo/client'

export const GET_MULTIPLY = gql`
query MultiplyQuery ($value1: Int!, $value2: Int!){
  multiply(value1: $value1, value2: $value2) {
      value
  }
}
`