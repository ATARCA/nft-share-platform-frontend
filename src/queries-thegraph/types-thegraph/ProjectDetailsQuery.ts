/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ProjectDetailsQuery
// ====================================================

export interface ProjectDetailsQuery_project {
  __typename: "Project";
  id: string;
  owner: any;
  shareableContractAddress: any;
  likeContractAddress: any;
}

export interface ProjectDetailsQuery {
  project: ProjectDetailsQuery_project | null;
}

export interface ProjectDetailsQueryVariables {
  projectId: string;
}
