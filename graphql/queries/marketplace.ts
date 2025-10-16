import { gql } from "@apollo/client";

export const PRODUCTS = gql`
  query Products {
    products {
      id
      title
      description
      price
      imageUrl
      status
      createdAt
      updatedAt
      seller {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

export const PRODUCT = gql`
  query Product($id: ID!) {
    product(id: $id) {
      id
      title
      description
      price
      imageUrl
      status
      createdAt
      updatedAt
      seller {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      title
      description
      price
      imageUrl
      status
      createdAt
      updatedAt
      seller {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      title
      description
      price
      imageUrl
      status
      updatedAt
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      id
    }
  }
`; 