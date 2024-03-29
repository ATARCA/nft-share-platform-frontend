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
    [{image: slideIcon1, title: 'Build for Web3 communities', text: 'Community is everything in Web3. Talko rewards and acknowledges the valuable work done by online community members (starting with Streamr) in the form of shareable NFTs’, or Streamr Awards.'},
        {image: slideIcon2, title: 'Reward and discover contributions',text: 'Streamr Awards are browsable publicly on the site to give visibility to the talent and effort that takes place in the community—and hopefully inspire others!'},
        {image: slideIcon3, title: 'Share the good vibes!', text: 'Unlike traditional awards, sNFT holders can show their appreciation to those who helped by sharing a copy with them. The community can also ‘Like’ other people’s awards on chain—much more personal!'}]

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

    return (
        <div>
            <div className="CarouselOverlayGradient" style={{'zIndex':'99997', 'position':'absolute', 'width':'100%', 'height':`${carouselHeight || 0}px`, 'pointerEvents':'none'}}>  </div >
            {showCloseButton? <Image as='a' onClick={() => onCloseClicked()} src={closeButtonImage} style={{'zIndex':'99998', 'position':'absolute', 'right': '2em', 'paddingTop': '3em', 'width':'4em', 'height':'4em'}} /> : <></>}
           
            <div ref={sliderRef}>
                <Slider >
                    {carouselContent.map( (item,i) =>     
                        <Slide   index={i} key={i}>
                            <div className="OnboardingCarouselBackground">
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