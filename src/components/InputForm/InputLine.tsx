import React from "react";
import { Grid } from "semantic-ui-react";

export const InputLine = ( {children}:{children?:React.ReactNode}) => {
    return <Grid.Row>
        {React.Children.map(children, (child, index) =><Grid.Column width={index===0? 7:9}>{child}</Grid.Column>)}
    </Grid.Row>
}
