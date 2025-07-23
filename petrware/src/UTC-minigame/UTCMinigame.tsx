import './UTCMinigame.css'
import {useRef, useEffect, use, useState} from "react";
import bottomWallet from "../assets/bottomWallet.png";
import topWallet from "../assets/topWallet.png";
import card from "../assets/card.png";
import swipeScreen from "../assets/Swipe!!!.png";
import tooFastScreen from "../assets/TooFast.png";
import tooSlowScreen from "../assets/TooSlow.png";
import successScreen from "../assets/Success.png";

export default function UTCMinigame(props: { finishGame: (pointsWon: number) => void }) {
    const [screenState, setScreenState] = useState(0);
    const [animationState, setAnimationState] = useState(0);
    const [cardx, setCardX] = useState(0);
    const [cardy, setCardY] = useState(0);

    const canvas = useRef<null | HTMLCanvasElement>(null);
    const assetCard = useRef<HTMLImageElement>(null);
    const assetBotWallet = useRef<null | HTMLImageElement>(null);
    const assetTopWallet = useRef<null | HTMLImageElement>(null);
    const assetSwipeScreen = useRef<null | HTMLImageElement>(null);
    const assetTooFastScreen = useRef<null | HTMLImageElement>(null);
    const assetTooSlowScreen = useRef<null | HTMLImageElement>(null);
    const assetSuccessScreen = useRef<null | HTMLImageElement>(null);
    let currScreen = useRef<CanvasImageSource>(null);

    function animate(){
        setCardX(cardx + 1);
        if(cardx == 240){
            setAnimationState(1);
        }
    }

    function render(){
        const ctx = canvas.current!.getContext("2d")!;
        const width = canvas.current!.offsetWidth;
        const height = canvas.current!.offsetHeight;
        ctx.imageSmoothingEnabled = false;

        ctx.fillStyle = "black";
        ctx.imageSmoothingEnabled = false;
        ctx.fillRect(0, 0, width, height);

        if(animationState == 0){
            animate();
        }

        ctx.drawImage(
            assetTopWallet!.current as CanvasImageSource, 123/5, 0, 86/5, 574/5
        )
        ctx.drawImage(
            assetCard!.current as CanvasImageSource, cardx, cardy, 135/5, 220/5
        );
        ctx.drawImage(
            assetBotWallet!.current as CanvasImageSource,0,0,123/5,572/5
        );
        ctx.drawImage(
            currScreen!.current as CanvasImageSource, 140, 40, 356/3, 234/3
        )
    }
    
    useEffect(() => {
        console.log('hi');
        currScreen = assetSwipeScreen;
        render();

        const intervalId = window.setInterval(render, 10);

        return () => {
            window.clearInterval(intervalId);
        }
    });

    return(
    <>
        <div id="canvasWrapper">
        <canvas id="canvas" ref={canvas}></canvas>
        </div>
        <div id="assets">
            <img src={card} ref={assetCard}/>
            <img src={bottomWallet} ref={assetBotWallet}/>
            <img src={topWallet} ref={assetTopWallet}/>
            <img src={swipeScreen} ref={assetSwipeScreen}/>
            <img src={tooFastScreen} ref={assetTooFastScreen}/>
            <img src={tooSlowScreen} ref={assetTooSlowScreen}/>
            <img src={successScreen} ref={assetSuccessScreen}/>
        </div>
    </>
    );
}