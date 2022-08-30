import React from "react";
import { Grid } from "semantic-ui-react";

export const InputLine = ( {children}:{children?:React.ReactNode}) => {
    return <Grid.Row className="padding-vertical">
        {React.Children.map(children, (child) =><Grid.Column>{child}</Grid.Column>)}
    </Grid.Row>
}
