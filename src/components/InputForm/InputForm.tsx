import React from "react";
import { Grid } from "semantic-ui-react";

export const InputForm = ( {children}:{children?:React.ReactNode}) => {
    return <Grid columns={2} verticalAlign='middle' style={{'textAlign':'left'}}>
        {children}
    </Grid>
}