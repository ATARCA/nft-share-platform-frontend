import React, { useContext, useEffect, useRef, useState } from "react";
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext, CarouselContext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { Button, Header, Icon, Image} from "semantic-ui-react";
import slideIcon1 from '../../images/slide_icon1.png';
import slideIcon2 from '../../images/slide_icon2.png';
import slideIcon3 from '../../images/slide_icon3.png';
import closeButtonImage from '../../images/btn_close.svg';
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

const OnboardingCarouselSlider = ( { onCloseClicked, showCloseButton } : {onCloseClicked: () => void, showCloseButton: boolean}) => {

    const carouselContext = useContext(CarouselContext);
    const sliderRef = useRef<HTMLDivElement>(null)

    const [ carouselHeight, setCarouselHeight]= useState(0)

    const [currentSlide, setCurrentSlide] = useState(carouselContext.state.currentSlide);
    useEffect(() => {
        function onChange() {
            setCurrentSlide(carouselContext.state.currentSlide);
        }
        carouselContext.subscribe(onChange);
        return () => carouselContext.unsubscribe(onChange);
    }, [carouselContext]);

    const isLastSlide = currentSlide !== carouselContent.length -1

    useEffect(() => {
        setCarouselHeight(sliderRef.current?.clientHeight || 0)
    },[sliderRef.current?.clientHeight])
    

    const renderNextOrCloseButton = () => {
        if (isLastSlide) return <Button as={ButtonNext}>Next <Icon name="arrow right"/></Button>
        else if (showCloseButton) return <Button onClick={onCloseClicked}>Close</Button>
        return <></>
    }

    console.log('height',sliderRef.current?.clientHeight)

    return (
        <div>
            <div className="CarouselOverlayGradient" style={{'zIndex':'99997', 'position':'absolute', 'width':'100%', 'height':`${carouselHeight || 0}px`, 'pointerEvents':'none'}}>  </div >
            {showCloseButton? <Image as='a' onClick={() => onCloseClicked()} src={closeButtonImage} style={{'zIndex':'99998', 'position':'absolute', 'right': '2em', 'paddingTop': '3em', 'width':'4em', 'height':'4em'}} /> : <></>}
           
            <div ref={sliderRef}>
                <Slider >
                    {carouselContent.map( (item,i) =>     
                        <Slide   index={i} key={i}>
                            <div style={{'padding':'4vw', margin:'2vw 4vw 1vw 4vw'}} className="OnboardingCarouselBackground">
                                <Image size="small" centered src={item.image}/>
                                <Header textAlign="left">{item.title}</Header>    
                                <p className="OnboardingCarouselTextParagraph">{item.text}</p>
                            </div>
                            <p className="OnboardingCarouselSlideIndex">{i+1} of {carouselContent.length}</p>
                        </Slide>
                    )}
                </Slider>
            </div>
            <Button as={ButtonBack}><Icon name="arrow left"/></Button>
            
            {renderNextOrCloseButton()}
        </div>
    )
}

const OnboardingCarousel = ( {alwaysOpen=false} : {alwaysOpen?: boolean}) => {

    const [tutorialCompleted, setTutorialCompleted] = useTutorialCompletedCookie();

    return (
        <CarouselProvider
            naturalSlideWidth={3.3}
            naturalSlideHeight={1}
            totalSlides={carouselContent.length}
            isIntrinsicHeight={true}>
            {!tutorialCompleted || alwaysOpen ? <OnboardingCarouselSlider onCloseClicked={() => setTutorialCompleted(true)} showCloseButton={!alwaysOpen}/> : <></>} 
        </CarouselProvider>

    )
}

export default OnboardingCarousel