"use strict";

const animationCanvas = document.getElementById('animationCanvas');

animationCanvas.style.position = 'absolute';
animationCanvas.width = cWidth;
animationCanvas.height = cHeight;

const anictx = animationCanvas.getContext('2d');

const gamePlay = (()=>{

  let canPlay = true;
  const numDecks = 6;
  let shoe = [];
  const cutCard = 16;
  let betOutcome, outcome;
  const coinSize = Math.floor(cWidth/10),
    cardWidth = Math.floor(cWidth/10),
    cardHeight = Math.floor(cardWidth*1.4);
  const xDif = Math.floor(cardWidth/2);
  // Make Player and Banker into objects with same properties
  const pHandX = Math.floor(cWidth*0.25)-cardWidth/2-xDif,
    bHandX = Math.floor(cWidth*0.75)-cardWidth/2-xDif,
    handY = Math.floor(cHeight*0.5)-cardHeight/2;
  const pHand = [], bHand = [];
  let pValue, bValue;

//Game Mechanics

  function startGame(){shoe = setUp.createShoe(numDecks);}

  function setbetOutcomePlayer(){betOutcome = 'P'; drawInitialCards();
    ctx.drawImage(setUp.miscImgMap.get('bitcoin'),cWidth*.25-coinSize/2,cHeight*.25-coinSize/2,coinSize,coinSize);}

  function setbetOutcomeTie(){betOutcome = 'T';drawInitialCards();
    ctx.drawImage(setUp.miscImgMap.get('bitcoin'),cWidth*0.5-coinSize/2,cHeight*.25-coinSize/2,coinSize,coinSize);}

  function setbetOutcomeBanker(){betOutcome = 'B';drawInitialCards();
    ctx.drawImage(setUp.miscImgMap.get('bitcoin'),cWidth*0.75-coinSize/2,cHeight*.25-coinSize/2,coinSize,coinSize);}

  function calcHandValue(hand){
    let value = 0;
    hand.forEach((card)=>{value+=calcValue(card);})
    return value%10;
  }

  function calcValue(card){
    let v = card[0];
    if(v=='A') {return 1;}
    else if(['K','Q','J','1'].includes(v)) {return 10;}
    else {return parseInt(v);}
  }

  function draw(shoe){
    //Replace create deck with procedurally generated card drawing
    return shoe.pop();
  }

  function drawCard(hand,xLoc,cx,cardPos,cb){
    const n = 20,
      inc = cardWidth/10;
    let s = 20*(cardPos);
    let cardback = setUp.miscImgMap.get('CardBack');

    let card = draw(shoe);
    let cardPic = setUp.cardImgMap.get(card)
    hand.push(card);

    const xStart = cWidth+2*cardWidth,
      yStart = -cardHeight,
      xFin = xLoc+xDif*cardPos,
      yFin = handY;
    animations.slide(cardback,xStart,yStart,xFin,yFin,cardWidth,cardHeight,n,s,cx,()=>{
      animations.flip(cardback,cardPic,xFin+cardWidth/2,handY,cardWidth,cardHeight,20,inc,cx,()=>{
        ctx.drawImage(cardPic,xFin,handY,cardWidth,cardHeight);
        cb();
      });
    });
  }

  function discard(){
    const n = 40,
      s = 0;
    const yStart = handY,
      xFin = -cardWidth,
      yFin = -cardHeight;
    anictx.clearRect(0,yStart,cWidth,cardHeight);
    ctx.clearRect(0,yStart,cWidth,cardHeight*1.5);
    //Simplify 2 loops below into one
    let len = pHand.length;
    for(let i = 0; i<len; i++){
      let xStart = pHandX+xDif*i;
      let cardPic = setUp.cardImgMap.get(pHand[i]);
      animations.slide(cardPic,xStart,yStart,xFin,yFin,cardWidth,cardHeight,n,s,anictx,()=>{});
    }

    len = bHand.length;
    for(let i = 0; i<len; i++){
      let xStart = bHandX+xDif*i;
      let cardPic = setUp.cardImgMap.get(bHand[i]);
      animations.slide(cardPic,xStart,yStart,xFin,yFin,cardWidth,cardHeight,n,s,anictx,()=>{});
    }
  }

//Game logic
  //Draws first 2 cards for player and banker
  function drawInitialCards(){
    if(shoe.length<cutCard){startGame();}
    if(canPlay==true){
      canPlay = false;
      animationCanvas.style.zIndex = 10;
      ctx.clearRect(0,0,cWidth,cHeight*.7);
      anictx.clearRect(pHandX,handY,cWidth,cardHeight*2);
      pHand.length = bHand.length = 0;
      pValue = bValue = 0;

      drawCard(pHand,pHandX,anictx,0,displayPlayerPoints);
      drawCard(pHand,pHandX,anictx,1,displayPlayerPoints);

      pValue = calcHandValue(pHand);
      //Need alternative to setTimeout. If only Promises would work with SYNCHRONOUS animations
      setTimeout(()=>{
        drawCard(bHand,bHandX,anictx,0,displayBankerPoints);
        drawCard(bHand,bHandX,anictx,1,displayBankerPoints);
        bValue = calcHandValue(bHand);
        playGame();
      },500);
    }
  }

  function playGame(){
    //Natural win conditions
    if(pValue==9||bValue==9||pValue==8||bValue==8){
      //Need to find alternative for setTimeout
      setTimeout(determineWinner,2000);
    }else{//Conditions for player drawing third card
      if(pValue<6){
        setTimeout(()=>{
          drawCard(pHand,pHandX,anictx,2,displayPlayerPoints);
          pValue = calcHandValue(pHand);
          setTimeout(()=>{
            thirdBankerCard();
            bValue = calcHandValue(bHand);
          },500)
        },500);
      }else if(bValue<6){//Conditions for Banker third card if player stands
        setTimeout(()=>{
          drawCard(bHand,bHandX,anictx,2,displayBankerPoints);
          bValue = calcHandValue(bHand);
        },500);
      }
      setTimeout(determineWinner,3000);
    }
  }

  //Checks conditions for drawing banker's third based on player's third card
  function thirdBankerCard(){
    let p3 = calcValue(pHand[2]);
    if((bValue<3)||(bValue==3&&p3!=8)||(bValue==4&&p3>1&&p3<8)||(bValue==5&&p3>3&&p3<8)||(bValue==6&&p3>5&&p3<8)){drawCard(bHand,bHandX,anictx,2,displayBankerPoints);
    }else{return;}
  }

  function determineWinner(){
    if(pValue==bValue){outcome='T';
    }else{pValue<bValue?outcome='B':outcome='P';}

    let payout;
    if(betOutcome!=outcome){payout=-bet;
    }else{
      if(betOutcome=='P'){payout=bet;
      }else if(betOutcome=='T'){payout=bet*8;
      }else{payout=bet*0.95;}
    }
    balance+=payout;
    accountDisplay.updateBalance(payout);
    discard();
    canPlay = true;
  }

  function pointDisplay(points, xLoc){
    let font = Math.floor(cHeight/20);
    ctx.font = font.toString() +"px Arial";
    let y = handY+cardHeight+font;
    ctx.clearRect(xLoc-font,handY+cardHeight,font*2,font*2);
    ctx.fillText(points,xLoc-font/4,y);
  }

  function displayPlayerPoints(){pointDisplay(pValue,cWidth*0.25)}
  function displayBankerPoints(){pointDisplay(bValue,cWidth*0.75)}

  function displayPoints(){
    displayPlayerPoints();
    displayBankerPoints();
  }

  return{
    setbetOutcomePlayer: setbetOutcomePlayer,
    setbetOutcomeTie: setbetOutcomeTie,
    setbetOutcomeBanker: setbetOutcomeBanker,
  }
})()
