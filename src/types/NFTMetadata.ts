
export interface MetadataAttribute {
    trait_type: string,
    value: string
}

export interface NFTMetadata {
    description: string,
    name: string,
    image: string,
    attributes: MetadataAttribute[]
}

export const subContributorPropertyName = 'Subcontributor'
export const subContributionPropertyName = 'Subcontribution title'

export const authorPropertyName = 'Author'
export const categoryPropertyName = 'Category'