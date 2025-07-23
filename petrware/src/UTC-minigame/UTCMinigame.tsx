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
    const timer = useRef<null | number>(null); 
    let currScreen = useRef<CanvasImageSource>(null);

    
    
    function handleMouseEvent(event: MouseEvent){
        event.preventDefault();
        
        let startY = event.clientY;
        console.log(event);
        console.log(startY);
        console.log(cardy);
        setCardY(startY -42);
    }

    function startTimer(){
        const GAME_DURATION = 60 * 1000;
        timer.current = Date.now() + GAME_DURATION;
    }

    function animate(){
        setCardX(cardx + 1);
        if(cardx == 750){
            setAnimationState(1);
            canvas.current!.onmousedown = handleMouseEvent;
            startTimer();
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
            assetTopWallet!.current as CanvasImageSource, 123, 0, 86, 574
        )
        ctx.drawImage(
            assetCard!.current as CanvasImageSource, cardx, cardy, 135, 220
        );
        ctx.drawImage(
            assetBotWallet!.current as CanvasImageSource,0,0,123,572
        );
        ctx.drawImage(
            currScreen!.current as CanvasImageSource, 500, 160, 356, 234
        )
    }
    
    useEffect(() => {
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
        <canvas id="canvas" ref={canvas} width={936} height={655}></canvas>
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