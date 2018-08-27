"use strict";

const acntCanvas = document.getElementById('accountCanvas');
const acntctx = acntCanvas.getContext('2d');
acntCanvas.width = cWidth;
acntCanvas.height = cHeight;

//Need to make these variables private
let balance=100000,
  bet=100;

//Centers Player, Banker, Tie Buttons
(function(){
  let xPos = Math.floor(cWidth/2)+'px';
  let yPos = Math.floor(cHeight*0.35)+"px";
  var b = document.getElementById('Buttons');
  b.style.width = cWidth+'px';
  b.style.top = yPos;
})()

const accountDisplay=(()=>{
  const account = document.getElementById('Account');
  const chips = document.getElementsByClassName('chips');
  const btns = document.getElementsByClassName('btns');

  const chipValues = [100,200,500];
  let chipSelect= chipValues[0];
  const chipSize = Math.floor(cWidth/15);
  const btnSize = Math.floor(cWidth/25);

  const yCord = cHeight*0.82;
  const xBalance = cWidth*0.75;
  const acntFont = Math.floor(cHeight/15);
  const chipFont = Math.floor(chipSize/5);

  for(let i=0; i<chips.length; i++){chips[i].style.width = chips[i].style.height = chipSize+"px";}

  for(let i=0; i<btns.length; i++){
    btns[i].style.marginBottom = (chipSize-btnSize)/2+"px";
    btns[i].style.width = btns[i].style.height = btnSize+"px";
  }

  account.style.left = cWidth/4-btnSize-1.5*chipSize+'px';//centers chips at under player symbol
  account.style.top = cHeight-chipSize-cHeight/30+'px';
  account.style.zIndex = 5;

  acntctx.font = acntFont+'px TheBlacklist';
  acntctx.textBaseline = "middle";
  acntctx.textAlign = 'right';
  acntctx.fillText('Balance ',cWidth*0.75,yCord);
  acntctx.textAlign = 'left';
  acntctx.fillText(balance,xBalance,yCord)

  //Draws under canvas. Fix in future versions
  // const chipValueTextStart = cWidth/4-chipSize;
  // function writeChipValues(){
  //   acntctx.font = chipFont+'px Arial';
  //   acntctx.textAlign = 'center';
  //   let yPos = cHeight-cHeight/30-chipSize/2;
  //   let j=chipValues.length;
  //   for(let i = 0; i<j; i++){//
  //      acntctx.fillText('Test ',chipValueTextStart+i*chipSize,yPos);
  //   }
  // }
  //
  // writeChipValues();

  function displayChipSelected(){
    let xPos = Math.floor(cWidth/3);
    let yPos = yCord;
    acntctx.font = acntFont+'px Quantico';
    acntctx.textAlign = 'right';
    acntctx.fillText('Chip Value ',xPos,yPos);
    acntctx.textAlign = 'left';
    acntctx.clearRect(xPos,yPos-acntFont/2,acntFont*4,acntFont);
    acntctx.fillText(chipSelect,xPos,yPos);
  }
  displayChipSelected();

  function displayBet(){
    let xPos = Math.floor(cWidth*3/4);
    let yPos = yCord+acntFont*1.2;
    acntctx.font = acntFont+'px Quantico';
    acntctx.textAlign = 'right';
    acntctx.fillText('Bet Size ',xPos,yPos);
    acntctx.textAlign = 'left';
    acntctx.clearRect(xPos,yPos-acntFont/2,acntFont*4,acntFont);
    acntctx.fillText(bet,xPos,yPos);
  }
  displayBet();

  function updateBalance(win){
    acntctx.textAlign = 'left';
    acntctx.font = acntFont+'px Quantico';
    acntctx.clearRect(xBalance,yCord-acntFont/2,acntFont*4,acntFont);
    acntctx.fillText(balance,xBalance,yCord)
    if(win>0){
      animations.fadeOut(win,anictx,1,xBalance+acntFont*1.5,yCord,'up',()=>{
        animationCanvas.style.zIndex = 0;
        gamePlay.canPlay=true;
      });
    }else{
      animations.fadeOut(bet,anictx,1,xBalance+acntFont*1.5,yCord,'down',()=>{
        animationCanvas.style.zIndex = 0;
        gamePlay.canPlay=true;
      });
    }
  }

  function blueSelect(){chipSelect=chipValues[0]; displayChipSelected();}
  function greenSelect(){chipSelect=chipValues[1]; displayChipSelected();}
  function redSelect(){chipSelect=chipValues[2]; displayChipSelected();}

  // function setBalance(newBalance){balance=newBalance}
  function decBet(){
    let newBet = bet-=chipSelect;
    if(newBet>minBet){bet=newBet;
    }else{bet=maxBet;}
  }

  function incBet(){
    let newBet = bet+=chipSelect;
    if(newBet<maxBet){bet=newBet;
    }else{bet=maxBet;}
    displayBet();
  }

  return{
    updateBalance: updateBalance,
    blueSelect: blueSelect,
    greenSelect: greenSelect,
    redSelect: redSelect,
    incBet: incBet,
    decBet: decBet,
  }

})()
