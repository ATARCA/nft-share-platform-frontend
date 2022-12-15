import React from "react";
import { Card, Table } from "semantic-ui-react";
import { TokenByIdQuery_token } from "../queries-thegraph/types-thegraph/TokenByIdQuery";
import { MetadataAttribute, NFTMetadata } from "../types/NFTMetadata";
import { Link } from "react-router-dom"
import urlRegex from "url-regex";
import { buildWalletPageRoute, tokenDetailRoute } from "../routingUtils";
import { shortenAccountAddress } from "../utils";
import { CHAINS, getAddChainParameters,BasicChainInformation, ExtendedChainInformation, DESIRED_CHAIN_ID } from '../chains';


const TokenAttributesView = ({token, metadata}: { token:TokenByIdQuery_token, metadata: NFTMetadata}) => {
    return (
        <div>
            <Table basic='very' >
                <Table.Body>
                    <Table.Row>
                        <TitleTableCell>Description</TitleTableCell>
                        <ValueTableCell>{metadata.description}</ValueTableCell> 
                    </Table.Row>
                    {metadata.attributes.map( attribute => {
                        return <Table.Row key={attribute.trait_type}>
                            <TitleTableCell>{attribute.trait_type}</TitleTableCell>
                            <ValueTableCell>{formatAsLinkIfLink(attribute.value)}</ValueTableCell> 
                        </Table.Row>
                    })}
                    <Table.Row>
                        <TitleTableCell>Owner</TitleTableCell>
                        <ValueTableCell><Link to={buildWalletPageRoute(token.ownerAddress)}>{shortenAccountAddress(token.ownerAddress)}</Link></ValueTableCell> 
                    </Table.Row>
                    <Table.Row>
                        <TitleTableCell>On-chain likes</TitleTableCell>
                        <ValueTableCell>{token.likeTokens.length}</ValueTableCell> 
                    </Table.Row>
                    <Table.Row>
                        <TitleTableCell>On-chain shares</TitleTableCell>
                        <ValueTableCell>{token.sharedChildTokens.length}</ValueTableCell> 
                    </Table.Row>
                    <Table.Row>
                        <TitleTableCell>Link to contract</TitleTableCell>
                        <ValueTableCell><a href={convertToChainexplorerLink(token)}>{shortenAccountAddress(token.contractAddress)}</a></ValueTableCell> 
                    </Table.Row>
                </Table.Body>
            </Table>
        </div>
    )
}

const formatAsLinkIfLink = ( text: string ) => {
    if (urlRegex().test(text))
        return <a style={{wordBreak: 'break-all'}} href={text}>{text}</a>
    else return text
}

const convertToChainexplorerLink = ( token: TokenByIdQuery_token ) => {
    const chainInformation = CHAINS[DESIRED_CHAIN_ID]

    // Check if the chainInformation is an instance of the ExtendedChainInformation interface
    if (isExtendedChainInformation(chainInformation)) {
        // If it is, you can access the blockExplorerUrls property from the chainInformation object
        const blockExplorerUrls = chainInformation.blockExplorerUrls;
        return blockExplorerUrls + '/token/' + token.contractAddress + '?a='+ token.tokenId;
    }
    return '';
}

const TitleTableCell = (  {children}: { children: JSX.Element | string} ) => {
    return <Table.Cell collapsing className="Token-attribute-table-title">{children}</Table.Cell>
}

const ValueTableCell = (  {children}: { children: JSX.Element | string | number} ) => {
    return <Table.Cell className="Token-attribute-table-value">{children}</Table.Cell>
}

function isExtendedChainInformation(
    chainInformation: BasicChainInformation | ExtendedChainInformation
): chainInformation is ExtendedChainInformation {
    return !!(chainInformation as ExtendedChainInformation).nativeCurrency
}

export default TokenAttributesView