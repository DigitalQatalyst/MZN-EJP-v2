import { gql } from '@apollo/client';

// GraphQL Query for Products
const GET_PRODUCTS = gql`
  query GetProducts($take: Int!) {
    products(options: { take: $take }) {
      items {
        id
        createdAt
        name
        slug
        description
        facetValues {
          facet {
            id
            name
            code
          }
          id
          name
          code
        }
        customFields {
          Industry
          BusinessStage
          ProcessingTime
          RegistrationValidity
          Cost
          Steps
          TermsOfService
          RequiredDocuments
          RelatedServices {
            id
            name
            slug
          }
        }
      }
      totalItems
    }
  }
`;

// GraphQL Query for Facets
const GET_FACETS = gql`
  query GetFacets {
    facets(options: { take: 100 }) {
      items {
        id
        name
        code
        values {
          id
          name
          code
        }
      }
    }
  }
`;

export { GET_PRODUCTS, GET_FACETS };