import React from "react";
import { Card, Table } from "semantic-ui-react";
import { TokenByIdQuery_token } from "../queries-thegraph/types-thegraph/TokenByIdQuery";
import { MetadataAttribute } from "../types/NFTMetadata";
import { Link } from "react-router-dom"
import urlRegex from "url-regex";
import { buildWalletPageRoute } from "../routingUtils";
import { shortenAccountAddress } from "../utils";

const TokenAttributesView = ({token, attributes}: { token:TokenByIdQuery_token ,attributes: MetadataAttribute[]}) => {
    return (
        <div>
            <Table basic='very' >
                <Table.Body>
                    {attributes.map( attribute => {
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
                        <TitleTableCell>Likes</TitleTableCell>
                        <ValueTableCell>{token.likeTokens.length}</ValueTableCell> 
                    </Table.Row>
                    <Table.Row>
                        <TitleTableCell>Shares</TitleTableCell>
                        <ValueTableCell>{token.sharedChildTokens.length}</ValueTableCell> 
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

const TitleTableCell = (  {children}: { children: JSX.Element | string} ) => {
    return <Table.Cell collapsing className="Token-attribute-table-title">{children}</Table.Cell>
}

const ValueTableCell = (  {children}: { children: JSX.Element | string | number} ) => {
    return <Table.Cell className="Token-attribute-table-value">{children}</Table.Cell>
}

export default TokenAttributesView