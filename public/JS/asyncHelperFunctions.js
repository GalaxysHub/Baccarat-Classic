"use strict";
const asyncHelperFunctions = (()=>{

  function createPromImgArr(pictures, imgMap, loc){
    return pictures.map((imgName)=>{
      let prom = new Promise((resolve,reject)=>{
        let img = new Image();
        img.onload= ()=>{
          imgMap.set(imgName.split('.')[0], img);
          resolve();
        };
        img.src = loc+imgName;
      });
      return prom;
    });
  }

  return{createPromImgArr:createPromImgArr}

})()
