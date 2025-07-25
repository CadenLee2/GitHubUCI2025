import './UTCMinigame.css'
import {useRef, useEffect} from "react";
import bottomWallet from "../assets/bottomWallet.png";
import topWallet from "../assets/topWallet.png";
import card from "../assets/card.png";
import swipeScreen from "../assets/Swipe!!!.png";
import tooFastScreen from "../assets/TooFast.png";
import tooSlowScreen from "../assets/TooSlow.png";
import successScreen from "../assets/Success.png";

export default function UTCMinigame(props: { finishGame: (pointsWon: number) => void }) {
    const { finishGame } = props;
    const animationState = useRef(0);
    const cardx = useRef(0);
    const cardy = useRef<number>(0);

    /**
        Kinda painful on small screen since it doesn't resize,
        but a constant width makes it way easier to deal with calculations
    */
    const CANVAS_WIDTH = 996;
    const CANVAS_HEIGHT = 756;

    const canvas = useRef<null | HTMLCanvasElement>(null);
    const assetCard = useRef<HTMLImageElement>(null);
    const assetBotWallet = useRef<null | HTMLImageElement>(null);
    const assetTopWallet = useRef<null | HTMLImageElement>(null);
    const assetSwipeScreen = useRef<null | HTMLImageElement>(null);
    const assetTooFastScreen = useRef<null | HTMLImageElement>(null);
    const assetTooSlowScreen = useRef<null | HTMLImageElement>(null);
    const assetSuccessScreen = useRef<null | HTMLImageElement>(null);

    const timer = useRef<number>(0);
    const endTimer = useRef({minLeft:0, secLeft:0});
    const gameOver = useRef<number>(0);
    const currScreen = useRef<CanvasImageSource>(null);
    const is_dragging = useRef(false);
    const startY = useRef(0);
    const startX = useRef(0);
    const time = useRef<number>(0);
    const timeEnd = useRef<number>(0);
    const successCountdown = useRef<number>(0);

    function mousePosRelativeToCanvas(mouseX: number, mouseY: number) {
        const rect = canvas.current!.getBoundingClientRect();
        const scaleX = canvas.current!.width / rect.width;
        const scaleY = canvas.current!.height / rect.height;

        return {
            x: (mouseX - rect.left) * scaleX,
            y: (mouseY - rect.top) * scaleY
        }
    }

    function mouseOnCard(x:number, y:number){
        // Get relative to canvas to work on all screen sizes
        const relPos = mousePosRelativeToCanvas(x, y);
        const leftBuffer = 750;
        const leftBufferWidth = 135;
        const topBuffer = 0;
        const topBufferHeight = 220;
        if (relPos.x < leftBuffer || relPos.x >= leftBuffer + leftBufferWidth) {
            return false;
        }
        if (relPos.y < topBuffer || relPos.y >= topBuffer + topBufferHeight) {
            return false;
        }
        return true;
    }

    function mouse_down(event: MouseEvent){
        event.preventDefault();
        
        startY.current = event.clientY;
        startX.current = event.clientX;

        if(mouseOnCard(startX.current, startY.current)){
            is_dragging.current = true;
            return;
        }
    }

    function mouse_up(event:MouseEvent){
        event.preventDefault();

        if(!is_dragging.current){
            return;
        }
        is_dragging.current = false;
        cardy.current = 0;
        time.current = 0;
        timeEnd.current = 0;
        render();
    }

    function mouse_out(event:MouseEvent){
        event.preventDefault();

        if(!is_dragging.current){
            return;
        }
        is_dragging.current = false;
        cardy.current = 0;
        render();
    }

    function mouse_move(event:MouseEvent){
        if(!is_dragging.current){
            return;
        }
        else{
            event.preventDefault();
            const mouseY = event.clientY;
            
            const dy = mouseY - startY.current;
            if(dy > 0){
                cardy.current=dy;
            }
            if(dy < 384 && dy > 160){
                if(!timeEnd.current){
                    time.current += 1;
                }
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
        // The useState rerenders made this move faster, so increased the speed
        // to make up for it
        cardx.current += 8;
        if(cardx.current >= 750){
            animationState.current = 1;
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
        // This gets the actual dimensions in terms of rendering
        const width = canvas.current!.width;
        const height = canvas.current!.height;
        ctx.imageSmoothingEnabled = false;

        ctx.fillStyle = "black";
        ctx.imageSmoothingEnabled = false;
        ctx.fillRect(0, 0, width, height);
        
        if(!gameOver.current)
        {if(animationState.current == 0){
            animate();
        }

        ctx.drawImage(
            assetTopWallet!.current as CanvasImageSource, 123, 0, 86, 574
        )
        ctx.drawImage(
            assetCard!.current as CanvasImageSource, cardx.current, cardy.current, 135, 220
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
        currScreen.current = assetSwipeScreen.current as CanvasImageSource;
        render();
        
        const intervalId = window.setInterval(render, 10);

        return () => {
            window.clearInterval(intervalId);
        }
    });

    return(
    <>
        <div id="canvasWrapper">
        <canvas id="canvas" ref={canvas} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}></canvas>
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
