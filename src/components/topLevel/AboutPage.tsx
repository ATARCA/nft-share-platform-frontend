import React from "react";
import { Container, Header } from "semantic-ui-react";
import OnboardingCarousel from "../onboarding/OnboardingCarousel";

export const AboutPage = () => {

    return <div>
        <OnboardingCarousel alwaysOpen={true}/>
        <Container text className="Text-block" style={{ paddingTop: '2em', paddingBottom: '5em'}} >
            <Header as='h1'>About</Header>
            <p>
                Talko is a service where online communities such as Web3 projects can recognise the valuable contributions that their members do to support their community. This takes place by minting new kind of crypto tokens named &apos;shareable non-transferable NFTs&apos;, or community awards as are called on Talko. Community awards are cryptographically protected certificates, tailored to the needs and visual identity of the community, that can be used within the community to show what contributions and in which categories have been made. Outside the community they work as a proof of community and personal achievements and skills.
            </p>
            <p>
                The first setup of Talko is launched to be used only by one extremely vibrant community, the Streamr Network community, with the idea that it will later on host a range of communities, each featuring their own community awards.
            </p>

            <Header as='h3'>How community awards work</Header>
            <p>
                Community award tokens are at first issued by a central authority of that community, in this case the Streamr staff members, based on their mutually agreed criteria about what kind of contributions and in which categories deserve to be awarded. Once a token has been issued its original recipient can share it further to others who have also contributed. This is a great way to share the acknowledgement and show that collaboration matters.
            </p>

            <Header as='h3'>Shareable non-transferable NFTs</Header>
            <p>
                Compared to traditional NFTs, community awards have some properties that make them stand apart. They are non-transferable, meaning that they cannot be sent to another wallet or people. They are however shareable, meaning that a copy of the token can be minted to someone who is a co-contributor, with that person&apos;s details added to the previously existing token metadata. Liking and endorsing are also carried out with token actions, by minting a Like or Endorsement token for the community member him/herself who wants to support someone else&apos;s award. The added functionalities of sharing, liking and endorsing tokens have been added to support collaboration and knowledge sharing within the communities as desired in the research objectives of the project.
            </p>

            <Header as='h3'>Talko as a research experiment</Header>
            <p>
                Talko has been created as part of the ATARCA research project and with funding from the Horizon2020 research and innovation program of the European Union. One of the aims of the project is to create cryptographically protected &apos;anti-rival&apos; tokens and test their applicability to fostering knowledge sharing in communities. The long-term goal is to remove market failures in digital goods which do not follow the classical laws of supply and demand. You can read more on the project website at <a href="https://atarca.eu">https://atarca.eu</a>.
            </p>

        </Container>
    </div>
}
