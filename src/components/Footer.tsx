import React from "react";
import { Image, Grid, Item, Divider } from "semantic-ui-react";
import talco_logo from '../images/talko_logo_white.svg';
import eu_flag from '../images/flag_of_europe.svg';

const Footer = () => {
    return (
        <>
            <div className='Footer'>
                <div>
                    <Image className='margin-vertical-main-menu talko' src={talco_logo} size='small'/>
                </div>
                <div>
                    <Grid textAlign='left'>
                        <Grid.Row columns={3}>
                            <Grid.Column>
                                Talko has been created as part of ATARCA research project. Project website: <Item href="https://atarca.eu">atarca.eu</Item>
                            </Grid.Column>
                            <Grid.Column>
                                General inquiries: <Item href="mailto: info@atarca.eu">info@atarca.eu</Item> <br/> Privacy related matters: <Item href="mailto: privacy@atarca.eu">privacy@atarca.eu</Item>
                            </Grid.Column>
                            <Grid.Column>
                                Please read our <Item href="#">Privacy policy</Item> and <Item href="#">Consent</Item> from platform users.
                            </Grid.Column>
                        </Grid.Row>
                        <Divider></Divider>
                        <Grid.Row columns={2}>
                            <Grid.Column width={2}>
                                <Image className='margin-vertical-main-menu eu-flag' src={eu_flag} size='tiny'/>
                            </Grid.Column>
                            <Grid.Column width={12}>
                                This project has received funding from the European Union’s Horizon 2020 Research and Innovation Programme under Grant Agreement Nº 964678. Any dissemination of results here presented reflects only the consortium view.
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            </div>
        </>
    );
}

export default Footer;