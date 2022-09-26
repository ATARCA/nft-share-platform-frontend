import React from "react";
import { Container, Header } from "semantic-ui-react";

export const ConsentContent = () => {
    return <div>
        <Container text className="Text-block" style={{ paddingTop: '2em', paddingBottom: '5em' }}>
            <Header as='h1'>Consent from Talko platform users and ATARCA research project participants</Header>
            <p>
            Thanks for being part of the Talko user community!The community awards on Talko are minted as new type of cryptographic tokens named Shareable NFTs, or sNFTs.Talko has been developed as part of ATARCA research project and with funding from the European Union&apos;s Horizon 2020 programme.(Read more about the project at <a href="https://atarca.eu">https://atarca.eu</a>).
            </p>
            <p>
            Before proceeding with the use of the platform, we’d like to collect your informed consent for two purposes.
            </p>

            <ul>
                <li>Consent to publish your sNFT tokens on this platform in case you are eligible to receive these tokens. The consent is needed because the token metadata contains details which are considered personal information such as the name (or pseudonym) of the token holder and title of the contribution.</li>
                <li>Consent to collect personal information information about you, such as your contact information and your wallet address, to be used only for purposes of ATARCA research project. As a user of the platform you are part of a research experiment in which we test the applicability of the sNFT tokens to motivate Streamr community members to share their valuable contributions with the community.</li>
            </ul>

            <p>
            If you wish you can withdraw your consent at any time, and in that case your tokens will be removed from the platform.
            </p>

            <p>
            Please read a more detailed description of the consent and your data protection rights by opening the following link: <a href="/talko_consent.pdf">Consent from Talko platform users and ATARCA research participants.</a>
            </p>
        </Container>
    </div>
}