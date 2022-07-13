
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

export const subContributorPropertyName = 'subcontributor'
export const subContributionPropertyName = 'subcontribution title'

export const authorPropertyName = 'Author'
export const categoryPropertyName = 'Category'