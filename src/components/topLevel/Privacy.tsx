import React from "react";
import { Container, Header } from "semantic-ui-react";

export const PrivacyPage = () => {
    return <div>
        <Container text className="Text-block" style={{ paddingTop: '2em', paddingBottom: '5em'}} >
            <Header as='h1'>Sorry to see you go!</Header>
            <p>
               Accepting privacy policy is required to be able to use the Talko platform.
            </p>
        </Container>

    </div>
}