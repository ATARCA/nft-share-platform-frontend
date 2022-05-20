
export interface MetadataAttribute {
    trait_type: string,
    value: string
}

export interface NFTMetadata {
    description: string,
    name: string,
    attributes: MetadataAttribute[]
}
