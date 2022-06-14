import React, { useState } from "react";
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext, DotGroup } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { Button, Container, Grid, Icon, Image, Modal, Rail, Segment } from "semantic-ui-react";
import guitar1 from '../../images/guitar1.jpg';
import guitar2 from '../../images/guitar2.jpg';
import guitar3 from '../../images/guitar3.jpg';
import useCookie from 'react-use-cookie';
import { useTutorialCompletedCookie } from "../../hooks/hooks";

interface CarouselEntry {
    image: string;
    text: string;
}

const carouselContent : CarouselEntry[] = 
    [{image: guitar1, text: 'I am the first Slide.'},
        {image: guitar2, text: 'I am the second Slide.'},
        {image: guitar3, text: 'I am the third Slide.'}]

const OnboardingCarousel = () => {

    return (
        <Container textAlign="center" text>
            <CarouselProvider
                naturalSlideWidth={1.35}
                naturalSlideHeight={1}
                totalSlides={3}>
                <Slider>
                    {carouselContent.map( (item,i) =>     
                        <Slide index={i} key={i}>
                            <Image src={item.image}/>
                            {item.text}
                        </Slide>
                    )}
                </Slider>

                <DotGroup />
               
                <Button as={ButtonBack}><Icon name="arrow left"/></Button>
                <Button as={ButtonNext}>Next <Icon name="arrow right"/></Button>
            </CarouselProvider>
        </Container>
    )
}

//TODO next cookie value

const OnboardingCarouselModal = () => {

    const [tutorialCompleted, setTutorialCompleted] = useTutorialCompletedCookie();
    return (
        <Modal
            closeIcon
            onClose={() => setTutorialCompleted(true)}
           
            open={!tutorialCompleted}>

            <OnboardingCarousel/>

        </Modal>
    )
}

export default OnboardingCarouselModal