import React, { useState } from "react";
import { Accordion, AccordionTitleProps, Container, Divider, Header, Icon } from "semantic-ui-react";

export const FaqPage = () => {

    const INDEX_NO_SELECTION = -1

    const [activeIndex, setActiveIndex] = useState<number>(INDEX_NO_SELECTION)

    const handleClick = (e: React.MouseEvent, titleProps: AccordionTitleProps) => {
        const { index } = titleProps 
        const indexNumber = Number.parseInt( index?.toString() || '' )
        const newIndex = activeIndex === indexNumber ? INDEX_NO_SELECTION : indexNumber 
    
        setActiveIndex( newIndex )
    }

    interface FaqUIEntry {
        question: string;
        answer: string;
    }

    const faqItems: FaqUIEntry[] = [
        {question: "Who gives these award tokens, and how can I get them?", answer: "The minting of Community awards is done by the administration of each community. In the case of Streamr it's the Streamr Community team. We're looking at different ways of opening up the selection of award candidates to the community itself."},
        {question: "How are sNFTs (shareable NFTs) different from regular NFTs?", answer: "sNFTs are not transferable and therefore they cannot be sold like regular NFTs. They have been created for community use, and sharing them refers to minting a new copy of the award token for someone who has co-contributed or supported the original contribution. Sharing is recommended, it's like giving a big 'thank you'."},
        {question: "How can I share award tokens?", answer: "As a recipient of an award, and with your wallet connected you can share an award on the Talko site by clicking 'Share award'. You'll then need to provide the wallet address and Discord handle of the sub-contributor, and the title of his/her sub-contribution in relation to your award. It's a good idea to ask about the wallet address beforehand (as you might not have it yet), and also say that this kind of award is about to come on the Talko site. You'll need a very small amount of MATIC token for the gas fees."},
        {question: "How can I like award tokens?", answer: "With your wallet connected, you can like someone else's award by clicking 'Like' on the token details page. You'll need a small amount of MATIC token for the gas fees. In technical terms, when liking an award you mint a specific 'Like token' to your own wallet."},
        {question: "Why aren't sNFT tokens transferable?", answer: "The tokens are meant to be used as awards and minted specifically for a certain individual. We don't want to create an aftermarket for them."},
        {question: "Why don't you just hand out exchangeable cryptos or regular NFTs as reward or award, why these sNFTs?", answer: "There's clearly a place for monetary rewards to community members but it's not always in alignment with the idea of voluntary work in communities. On the Talko platform, and in alignment of the goals of the ATARCA research project we aim to experiment with non-monetary rewards and anti-rival exchange of value. What's needed in many cases is some recognition for the efforts of the individuals contributing to the community, and Talko is a great tool for that."},
        {question: "I want to transfer my sNFTs to another wallet. How can that happen?", answer: "Talko doesn't support this for the moment. We're investigating how to make it possible for those cases where this is needed to change from one wallet to another."},
        {question: "Why should I share my awards, what's the use of it?", answer: "Sharing your award is a great way to give recognition and to say 'thank you' to those who have made your contribution possible. It's the kind of community spirit we want to encourage."},
        {question: "If I share my award token with someone, will it be split to half?", answer: "No, you'll still have your own token and the other person will get a new copy minted for him/her. A shared token is not half the award but a double award! Your token will be labelled and recognized as an 'Original award' while the shared token will be a 'Shared award'."},
        {question: "Which crypto assets and how much do I need for the gas fees to share my awards?", answer: "Sharing and liking consume approximately 100 000 gas and depending on the network congestion you'll need approximately 0.01 amount of MATIC token in your wallet for the sharing and liking of awards."},
        {question: "Why is award sharing needed - why not just hand out similar tokens to all equal contributors?", answer: "Our intention is indeed to mint the same kind of original award tokens to each member in a team of contributors. This is however not always enough since there are in many cases people who have helped or in some indirect way made the contribution possible. It could be about support in technical questions, mentoring, writing, or just keeping up the spirit, and award sharing is made for this."},
        {question: "If I share or like someone's awards, can I change my mind and unshare or unlike them later?", answer: "Award sharing cannot be undone (since a shared award is a new token in someone else's wallet), however you can erase a Like token from your wallet through token burning it."},
        {question: "What value do sNFTs have?", answer: "sNFTs are not transferable and they don't have monetary value for this reason. They are valuable to their holders as a recognition for their contributions, and as a proof of skills and achievements both to other community members and people outside (eg. clients, employers, the whole professional community)."},
        {question: "Are Talko platform and the community awards GDPR compliant?", answer: "Yes. We've taken great care to minimise the personal information that's collected from the site users, used for research purposes, and published on the tokens. We collect personal information only with your informed consent which can be withdrawn at any moment. To read more and see what rights you have as a Talko user please check our privacy policy and Talko platform use and research policy."},
        {question: "Are these award tokens implemented 100% on-chain?", answer: "While the sNFTs are genuine crypto tokens in Polygon network, their metadata is stored on a centralised backend. This is to make it possible to change or erase them, and in legal terms, make them compliant with the European data protection regulation (GDPR)."},
        {question: "Why did you decide to do this project?", answer: "Talko is one of the pilot projects that have been carried out within ATARCA research project in years 2021-2023, and with funding from the European Union's Horizon2020 research and innovation program. The project aims to create cryptographically protected 'anti-rival' tokens and test their applicability to fostering knowledge sharing in communities. The long-term goal in ATARCA is to remove market failures in digital goods which unlike traditional products don't follow the classical laws of supply and demand. More on the project website at https://atarca.eu."},
        {question: "Our community wants to join the platform and start minting these awards. How can we do it?", answer: "Please get in touch with us at info@talkoapp.io. We're planning to expand Talko by making it available for new communities in the near future"},
        {question: "What does that name 'Talko' stand for?", answer: "As many of our team members have their roots in Finland, the name refers to the traditional Finnish concept of 'talkoot' which is voluntary and unpaid communal work session together with other community members. This kind of inputs are after all what keep the communities ticking. More about communal work: https://en.wikipedia.org/wiki/Communal_work."},
    ]

    return <div>
        <Container text className="Text-block" style={{ paddingTop: '2em', paddingBottom: '5em'}} >
            <Header as='h1'>FAQ</Header>
            <Accordion>
                {faqItems.map((faq, index) => 
                    <div key={index}>
                        <Accordion.Title
                            active={activeIndex === index}
                            index={index}
                            onClick={ (e, data) => handleClick(e, data)}>
                           
                            {activeIndex === index ? <b>{faq.question}</b> : <>{faq.question}</>}
                            <span className="ExpandableTitleIconSpan">
                                {activeIndex === index ? <b>-</b> : <b>+</b>}
                            </span>
                        </Accordion.Title>
                        {activeIndex === index ? <></> : <Divider/>}
                        <Accordion.Content active={activeIndex === index}>
                            <p>
                                {faq.answer}
                            </p>
                            {activeIndex !== index ? <></> : <Divider/>}
                        </Accordion.Content>
                    </div>
                )}
            </Accordion>
        </Container>
    </div>
}
