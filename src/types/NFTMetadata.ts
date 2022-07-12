
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

export const subContributorTraitType = 'subcontributor'
export const subContributionTraitType = 'subcontribution title'