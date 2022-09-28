import React from "react";
import { Image, Grid, Item, Divider, Table } from "semantic-ui-react";
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
                    <Grid textAlign='left' stackable>
                        <Grid.Row columns={3}>
                            <Grid.Column>
                                Talko has been created as part of ATARCA research project. Project website: <Item href="https://atarca.eu">atarca.eu</Item>
                            </Grid.Column>
                            <Grid.Column>
                                General inquiries: <Item href="mailto: info@talkoapp.io">info@talkoapp.io</Item> <br/> Privacy related matters: <Item href="mailto: privacy@atarca.eu">privacy@atarca.eu</Item>
                            </Grid.Column>
                            <Grid.Column>
                                Please read our <Item href="/talko_privacy.pdf" download>Privacy policy</Item> and <Item href="/talko_consent.pdf" download>Consent</Item> from platform users.
                            </Grid.Column>
                        </Grid.Row>
                        <Divider></Divider>
                        <Table basic={'very'} className='FooterText'>
                            <Table.Row>
                                <Table.Cell>
                                    <Image className='margin-vertical-main-menu eu-flag' src={eu_flag} size='tiny'/>
                                </Table.Cell>
                                <Table.Cell>
                                    This project has received funding from the European Union&apos;s Horizon 2020 Research and Innovation Programme under Grant Agreement Nº 964678.
                                </Table.Cell>
                            </Table.Row>
                        </Table>
                    </Grid>
                </div>
            </div>
        </>
    );
}

export default Footer;