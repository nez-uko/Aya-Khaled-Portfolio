import { FREELANCE_ICONS } from "../interfaces/portfolio-interface";

const ColORS= ['#007bff','#28a745','#dc3545','#ffc107','#17a2b8','#6f42c1'];

export function getPlatformDisplay(platform:string){
  const key= platform.toLowerCase().replace(/\s/g,'');
  const iconValue= FREELANCE_ICONS[key];
  if(iconValue){
    if(iconValue.startsWith('fa')){
      return {type:'fa-icon',value:iconValue}
    }else{
      return {type:'svg',value:iconValue}
    }
  }

  const initails= platform
                          .split('')
                          .map(word=>word[0])
                          .join('')
                          .slice(0,2)
                          .toUpperCase();
  const colorIndex= platform.length % ColORS.length;

  return {
    type:'initials',
    value:initails|| '?',
    bgColor:ColORS[colorIndex]
  }
}


