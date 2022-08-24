import React, { useContext, useEffect, useState } from "react";
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext, CarouselContext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { Button, Container, Header, Icon, Image} from "semantic-ui-react";
import slideIcon1 from '../../images/slide_icon1.png';
import slideIcon2 from '../../images/slide_icon2.png';
import slideIcon3 from '../../images/slide_icon3.png';
import { useTutorialCompletedCookie } from "../../hooks/hooks";

interface CarouselEntry {
    image: string;
    title: string;
    text: string;
}

const carouselContent : CarouselEntry[] = 
    [{image: slideIcon1, title: 'Build for online communities', text: 'Talko is a service for online communities (starting with Streamr) to award  the valuable work done by their members in the form ‘shareable NFTs’, or community awards.'},
        {image: slideIcon2, title: 'Shareable awards',text: 'Community awards highlight the talent, activities and knowledge sharing taking place in the community. They are kept in everyone’s own wallet and can be  publicly browsed on the Talko site. '},
        {image: slideIcon3, title: 'All about the good vibes!', text: 'If you get an award you can show your appreciation to those who helped you by sharing a copy with them. You can also ‘like’ other people’s awards. Share the good vibes!'}]

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
           
            <Slider style={{'paddingTop':'4em'}}>
                {carouselContent.map( (item,i) =>     
                    <Slide   index={i} key={i}>
                        <div style={{'padding':'4em'}} className="OnboardingCarouselBackground">
                            <Image size="small" centered src={item.image}/>
                            <Header textAlign="left">{item.title}</Header>    
                            <p className="OnboardingCarouselTextParagraph">{item.text}</p>
                        </div>
                        <p className="OnboardingCarouselSlideIndex">{i+1} of {carouselContent.length}</p>
                    </Slide>
                )}
            </Slider>
               
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
        <CarouselProvider
            naturalSlideWidth={1.8}
            naturalSlideHeight={1}
            totalSlides={carouselContent.length}
            isIntrinsicHeight={true}
            >
            <OnboardingCarousel onCloseClicked={() => setTutorialCompleted(true)}/>
        </CarouselProvider>

    )
}

export default OnboardingCarouselModal