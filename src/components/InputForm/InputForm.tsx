import React from "react";
import { Grid, Table } from "semantic-ui-react";

export const InputForm = ( {children}:{children?:React.ReactNode}) => {
    return <Table  basic='very' verticalAlign='middle' style={{'textAlign':'left'}}>
        <Table.Body>
            {children}
        </Table.Body>
    </Table>
}