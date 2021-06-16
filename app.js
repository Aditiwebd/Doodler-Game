document.addEventListener("DOMContentLoaded",() => {
    const grid=document.querySelector('.grid');
    const doodler=document.createElement('div');
    let doodlerLeftSpace=50;
    let startPoint =150;
    let doodlerBottom=startPoint;
    let isGameisOver=false;
    let platformCount=5;
    let platformsArray=[];
    let upTimerId;
    let downTimerId;
    let isJumping =true;
    let isGoingLeft=false;
    let isGoingRight=false;
    let leftTimerId;
    let rightTimerId;
    let score=0;

    function createDoodler(){
        grid.appendChild(doodler);
        doodler.classList.add('doodler');
        doodlerLeftSpace = platformsArray[0].left;
        doodler.style.left=doodlerLeftSpace +'px';
        doodler.style.bottom=doodlerBottom+'px';
    }

    class Platform{
        constructor(newPlatformBottom){
            this.bottom=newPlatformBottom;
            this.left=Math.random()*315;
            this.visual = document.createElement('div');

            const visual=this.visual;
            visual.classList.add('platform');
            visual.style.left=this.left+'px';
            visual.style.bottom=this.bottom+'px';
            grid.appendChild(visual);
            //console.log(visual);
        }
    }

    function createPlatforms(){
        for(let i=0;i<platformCount;i++){
            let platformGap=600/platformCount;
            let newPlatformBottom=100+i*platformGap;
            let newPlatform= new Platform(newPlatformBottom);
            platformsArray.push(newPlatform);
            console.log(platformsArray);
        }
    }

    function movePlatforms(){
        if(doodlerBottom > 200){
            platformsArray.forEach(platform => {
                platform.bottom -= 4;
                let visual = platform.visual;
                visual.style.bottom=platform.bottom+'px';

                if(platform.bottom <10){
                    let firstPlatform = platformsArray[0].visual;
                    firstPlatform.classList.remove('platform');
                    platformsArray.shift();
                    score++;
                    console.log(score);
                    let newPlatform = new Platform(600);
                    platformsArray.push(newPlatform);
                }
            })
        }
    }

    function jump(){
        clearInterval(downTimerId);
        isJumping = true;
        upTimerId = setInterval(function (){
            doodlerBottom +=20;
            doodler.style.bottom =doodlerBottom+'px';
            if(doodlerBottom > startPoint+200)
                fall();
        },30);
    }

    function fall(){
        clearInterval(upTimerId);
        isJumping = false;
        downTimerId = setInterval(function(){
            doodlerBottom -=5;
            doodler.style.bottom=doodlerBottom + 'px';
            if(doodlerBottom <= 0)
                gameOver();

            platformsArray.forEach(platform => {
                if((!isJumping) && 
                (doodlerBottom >= platform.bottom) &&
                (doodlerBottom <= platform.bottom+15) &&
                (doodlerLeftSpace+60 >= platform.left) &&
                (doodlerLeftSpace <= platform.left+85)
                ){
                    console.log('landed');
                    startPoint = doodlerBottom;
                    jump();
                }
            });

        },30);
    }

    function gameOver(){
        console.log('game over');
        isGameisOver=true;
        while(grid.firstChild){
            grid.removeChild(grid.firstChild);
        }
        grid.innerHTML=score;
        clearInterval(upTimerId);
        clearInterval(downTimerId);
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);
    }

    function control(e){
        if(e.key === "ArrowLeft"){
            moveLeft();
        } else if(e.key === "ArrowRight"){
            moveRight();
        } else if(e.key === "ArrowUp"){
            moveStraight();
        }
    }

    function moveLeft(){
        if(isGoingRight){
            clearInterval(rightTimerId);
            isGoingRight=false;
        }
       isGoingLeft=true;
       leftTImerId=setInterval(function () {
           if(doodlerLeftSpace >=0){
            doodlerLeftSpace -=5;
            doodler.style.left = doodlerLeftSpace +'px';
           }
           else {
            clearInterval(leftTimerId);
            clearInterval(rightTimerId);
               moveRight();
           }
       },20);
    }

    function moveRight(){
        if(isGoingLeft){
            clearInterval(leftTimerId);
            isGoingLeft=false;
        }
       isGoingRight=true;
       rightTimerId=setInterval(function (){
           if(doodlerLeftSpace <= 340){
               doodlerLeftSpace +=5;
               doodler.style.left=doodlerLeftSpace+'px';
           }
       },20); 
    }

    function moveStraight(){
        isGoingLeft=false;
        isGoingRight=false;
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);
    }

    function start(){
        if(!isGameisOver){
            createPlatforms();
            createDoodler();
            setInterval(movePlatforms,30);
            document.addEventListener('keyup',control);
            jump();
        }
    }

    //attach a button to it;
    start();
   

});