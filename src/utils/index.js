

export const OPEN='Open';
export const CLOSED='Closed';
export const Progress='In-Progress';

export const updateStatus= events=>{
    
     switch(events.length){
         case  1:
           return Progress
         default:
           return OPEN;
     }
}