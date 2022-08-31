import React from "react";
import { Grid, Table } from "semantic-ui-react";

export const InputLine = ( {children}:{children?:React.ReactNode}) => {
    return <Table.Row>
        {React.Children.map(children, (child, index) =><Table.Cell 
            collapsing={index===0? true:false}
            style={{ 'borderTop':'none'}}>
                {child}
            
            </Table.Cell>)}
    </Table.Row>
}
