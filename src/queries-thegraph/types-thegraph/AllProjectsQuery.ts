/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllProjectsQuery
// ====================================================

export interface AllProjectsQuery_projects {
  __typename: "Project";
  id: string;
}

export interface AllProjectsQuery {
  projects: AllProjectsQuery_projects[];
}

export interface AllProjectsQueryVariables {
  filterId: string;
}
