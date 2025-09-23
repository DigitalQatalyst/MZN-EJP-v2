import { gql } from "@apollo/client";

// Product-related GraphQL queries
export const GETPRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      slug
      description
      customFields {
        CustomerType
        BusinessStage
        Nationality
        LegalStructure
        CustomerType
        Industry
        ProcessingTime
        RegistrationValidity
        Cost
        Steps
        TermsOfService
        RequiredDocuments
        RelatedServices {
          id
          name
        }
      }
    }
  }
`;

export default GETPRODUCT;
