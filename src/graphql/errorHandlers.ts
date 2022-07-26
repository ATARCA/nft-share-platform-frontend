import { ApolloError } from "@apollo/client"

export const defaultErrorHandler = (error: ApolloError) => {
    console.error('error', error)
}