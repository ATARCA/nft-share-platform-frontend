import React from "react";
import { Container, Header } from "semantic-ui-react";
import OnboardingCarousel from "../onboarding/OnboardingCarousel";

export const AboutPage = () => {

    return <div>
        <OnboardingCarousel alwaysOpen={true}/>
        <Container text className="Text-block" style={{ paddingTop: '2em', paddingBottom: '5em'}} >
            <Header as='h1'>About</Header>
            <p>
                Talko provides a service for online communities to recognise the valuable contributions of their members. We achieve this by minting a new kind of shareable non-transferable NFTs (sNFTs), or Streamr Award. 
            </p>
            <p>
                Streamr Awards are uniquely sharable, cryptographically protected, certificates, tailored to the needs and visual identity of the community. Awards are minted to show and acknowledge contributions from community members, and in which categories they have been made. For the community, they work as a proof of personal achievements and skills.
            </p>

            <p>
                The first Talko pilot is launched to be used only by the Streamr Network community, and will later be expanded to a range of communities, each featuring their own tailored awards.
            </p>

            <Header as='h3'>How do Streamr Awards work?</Header>
            <p>
                Streamr Award tokens are at first issued by a central authority of that community, in this case the Streamr staff members, based on their mutually agreed criteria about what kind of contributions, and which categories, deserve to be awarded. Once a token has been issued, its original recipient can share it further to others who have also contributed. This is a unique feature of sNFTs, and provides a way to share the acknowledgement and collaborations alongside others.
            </p>

            <Header as='h3'>What are shareable non-transferable NFTs?</Header>
            <p>
                Compared to traditional NFTs, sNFTs have some properties that make them unique. Their ownership is non-transferable, meaning that they cannot be sent to another wallet or person. They are however shareable, meaning that a copy of the token can be minted to someone who is a co-contributor, with that person&apos;s details added to the previously existing token metadata.
            </p>

            <Header as='h3'>How can I support the given awards?</Header>
            <p>
                As a platform user you can like any award and if you have received an award token you can give an endorsement for any award. Liking and endorsing are carried out with token actions. A person mints a Like or Endorsement token to support someone else&apos;s award. The added functionalities of sharing, liking and endorsing tokens have been added to support collaboration and knowledge sharing within the communities, as desired in the research objectives of the project.
            </p>

            

            <Header as='h3'>What is Talko’s goal?</Header>
            <p>
                Talko has been created as part of the ATARCA research project and with funding from the Horizon2020 research and innovation program of the European Union. One of the aims of the project is to create cryptographically protected &apos;anti-rival&apos; tokens and test their applicability to fostering knowledge sharing in communities. The long-term goal is to remove market failures in digital goods which do not follow the classical laws of supply and demand. 
            </p>
            <p> You can read more on the Talko <a href="https://atarca.eu">project website</a>.</p>

        </Container>
    </div>
}
