import React, { useContext, useEffect, useState } from "react";
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext, DotGroup, CarouselContext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { Button, Container, Icon, Image, Modal } from "semantic-ui-react";
import guitar1 from '../../images/guitar1.jpg';
import guitar2 from '../../images/guitar2.jpg';
import guitar3 from '../../images/guitar3.jpg';
import { useTutorialCompletedCookie } from "../../hooks/hooks";

interface CarouselEntry {
    image: string;
    text: string;
}

const carouselContent : CarouselEntry[] = 
    [{image: guitar1, text: 'I am the first Slide.'},
        {image: guitar2, text: 'I am the second Slide.'},
        {image: guitar3, text: 'I am the third Slide.'}]

const OnboardingCarousel = ( { onCloseClicked } : {onCloseClicked: () => void}) => {

    const carouselContext = useContext(CarouselContext);
    const [currentSlide, setCurrentSlide] = useState(carouselContext.state.currentSlide);
    useEffect(() => {
        function onChange() {
            setCurrentSlide(carouselContext.state.currentSlide);
        }
        carouselContext.subscribe(onChange);
        return () => carouselContext.unsubscribe(onChange);
    }, [carouselContext]);

    const isLastSlide = currentSlide !== carouselContent.length -1

    return (
        <Container textAlign="center" text>
           
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
            
            { isLastSlide ? 
                <Button as={ButtonNext}>Next <Icon name="arrow right"/></Button>
                :
                <Button onClick={onCloseClicked}>Close</Button>
            }
            
        </Container>
    )
}

const OnboardingCarouselModal = () => {

    const [tutorialCompleted, setTutorialCompleted] = useTutorialCompletedCookie();

    return (
        <Modal
            closeIcon
            onClose={() => setTutorialCompleted(true)}
           
            open={!tutorialCompleted}>

            <CarouselProvider
                naturalSlideWidth={1.35}
                naturalSlideHeight={1}
                totalSlides={3}>
                <OnboardingCarousel onCloseClicked={() => setTutorialCompleted(true)}/>
            </CarouselProvider>

        </Modal>
    )
}

export default OnboardingCarouselModal