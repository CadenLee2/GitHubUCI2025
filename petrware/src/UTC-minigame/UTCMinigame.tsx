import './UTCMinigame.css'
import {useRef, useEffect, useState} from "react";
import bottomWallet from "../assets/bottomWallet.png";
import topWallet from "../assets/topWallet.png";
import card from "../assets/card.png";
import swipeScreen from "../assets/Swipe!!!.png";
import tooFastScreen from "../assets/TooFast.png";
import tooSlowScreen from "../assets/TooSlow.png";
import successScreen from "../assets/Success.png";

export default function UTCMinigame(props: { finishGame: (pointsWon: number) => void }) {
    const { finishGame } = props;
    const [animationState, setAnimationState] = useState(0);
    const [cardx, setCardX] = useState(0);
    let cardy = useRef<number>(0);

    const canvas = useRef<null | HTMLCanvasElement>(null);
    const assetCard = useRef<HTMLImageElement>(null);
    const assetBotWallet = useRef<null | HTMLImageElement>(null);
    const assetTopWallet = useRef<null | HTMLImageElement>(null);
    const assetSwipeScreen = useRef<null | HTMLImageElement>(null);
    const assetTooFastScreen = useRef<null | HTMLImageElement>(null);
    const assetTooSlowScreen = useRef<null | HTMLImageElement>(null);
    const assetSuccessScreen = useRef<null | HTMLImageElement>(null);

    let timer = useRef<number>(0); 
    let endTimer = useRef({minLeft:0, secLeft:0});
    let gameOver = useRef<number>(0);
    let currScreen = useRef<CanvasImageSource>(null);
    let is_dragging = false;
    let startY = 0;
    let startX = 0;
    let time = useRef<number>(0);
    let timeEnd = useRef<number>(0);
    let successCountdown = useRef<number>(0);

    function mouseOnCard(x:number, y:number){
        const leftBuffer = (window.innerWidth - 936)/2;
        const topBuffer = 42;
        if(x - leftBuffer < 730  || x-leftBuffer > 770 + 135){
            return false;
        }
        if(y - topBuffer < -10 || y - topBuffer > 230){
            return false;
        }
        return true;
    }

    function mouse_down(event: MouseEvent){
        event.preventDefault();
        
        startY = event.clientY;
        startX = event.clientX;

        if(mouseOnCard(startX, startY)){
            is_dragging = true;
            return;
        }
    }

    function mouse_up(event:MouseEvent){
        event.preventDefault();

        if(!is_dragging){
            return;
        }
        is_dragging = false;
        cardy.current = 0;
        time.current = 0;
        timeEnd.current = 0;
        render();
    }

    function mouse_out(event:MouseEvent){
        event.preventDefault();

        if(!is_dragging){
            return;
        }
        is_dragging = false;
        cardy.current = 0;
        render();
    }

    function mouse_move(event:MouseEvent){
        if(!is_dragging){
            return;
        }
        else{
            event.preventDefault();
            let mouseY = event.clientY;
            
            let dy = mouseY - startY;
            if(dy > 0){
                cardy.current=dy;
            }
            if(dy < 384 && dy > 160){
                if(!timeEnd.current){
                    time.current += 1;
                }
                //40
            }
            if(dy > 384){
                timeEnd.current = 1;
                console.log(time.current);
                check();
            }

        }
    }

    function check(){
        if(time.current < 30){
            currScreen.current = assetTooFastScreen.current;
        }
        else if(time.current > 70){
            currScreen.current = assetTooSlowScreen.current;
        }
        else{
            currScreen.current = assetSuccessScreen.current;
            endTimer.current = timeUntil(timer.current ?? 0);
        }
    }

    function endGame(){
        console.log(endTimer.current.secLeft);
        finishGame((endTimer.current.secLeft + 1) * 100);
    }

    function startTimer(){
        const GAME_DURATION = 60 * 1000;
        timer.current = Date.now() + GAME_DURATION;
    }

    function animate(){
        setCardX(cardx + 2);
        if(cardx == 750){
            setAnimationState(1);
            canvas.current!.onmousedown = mouse_down;
            canvas.current!.onmouseup = mouse_up;
            canvas.current!.onmouseout = mouse_out;
            canvas.current!.onmousemove = mouse_move;
            if(timer.current ==0){
                startTimer();
            }
        }
    }

    function timeUntil(timePoint: number) {
        const timeLeft = timePoint - Date.now();
        const secLeftTotal = Math.floor(timeLeft / 1000);
        const minLeft = Math.floor(secLeftTotal / 60);
        const secLeft = secLeftTotal % 60;
        if(minLeft == 0 && secLeft==0){
            console.log("hi");
            gameOver.current = 1;
        }
        return { minLeft, secLeft };
    }

    function render(){
        const ctx = canvas.current!.getContext("2d")!;
        const width = canvas.current!.offsetWidth;
        const height = canvas.current!.offsetHeight;
        ctx.imageSmoothingEnabled = false;

        ctx.fillStyle = "black";
        ctx.imageSmoothingEnabled = false;
        ctx.fillRect(0, 0, width, height);
        
        if(!gameOver.current)
        {if(animationState == 0){
            animate();
        }

        ctx.drawImage(
            assetTopWallet!.current as CanvasImageSource, 123, 0, 86, 574
        )
        ctx.drawImage(
            assetCard!.current as CanvasImageSource, cardx, cardy.current, 135, 220
        );
        ctx.drawImage(
            assetBotWallet!.current as CanvasImageSource,0,0,123,572
        );
        ctx.drawImage(
            currScreen!.current as CanvasImageSource, 500, 160, 356, 234
        )}
        if (timer.current > 0) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
            ctx.beginPath();
            ctx.roundRect(width - 130, 20, 74, 30, 8);
            ctx.fill();
            ctx.fillStyle = "orange";
            let countdown: {minLeft:number, secLeft:number};

            if(!gameOver.current){
                countdown = timeUntil(timer.current ?? 0);
            }
            else{
                countdown = {minLeft:0,secLeft:0};
            }

            const formatTime = countdown.minLeft + ":" + (countdown.secLeft < 10 ? '0' : '') + countdown.secLeft;
            ctx.font="28px Arial";
            ctx.fillText(formatTime, width - 120, 44);
        }
        if(endTimer.current.secLeft){
            successCountdown.current += 1;
        }
        if(successCountdown.current == 70){
            endGame();
        }
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