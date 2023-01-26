/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ProjectDetailsQuery
// ====================================================

export interface ProjectDetailsQuery_project_categories {
  __typename: "Category";
  id: string;
}

export interface ProjectDetailsQuery_project {
  __typename: "Project";
  id: string;
  operators: any[];
  shareableContractAddress: any | null;
  likeContractAddress: any | null;
  endorseContractAddress: any | null;
  categories: ProjectDetailsQuery_project_categories[];
}

export interface ProjectDetailsQuery {
  project: ProjectDetailsQuery_project | null;
}

export interface ProjectDetailsQueryVariables {
  projectId: string;
}
