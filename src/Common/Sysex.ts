/** 
 * Sysex
 */
export class Sysex extends Uint8ClampedArray {};

/**
 * Checks whether sysex1 and sysex2 are equal
 * @param sysex1 
 * @param sysex2  
 */
export const sysexEqual = (sysex1: Readonly<Sysex>, sysex2: Readonly<Sysex>): boolean => {
    if(sysex1.length != sysex2.length) {
        return false;
    }
    for(let i=0; i<sysex1.length; i++) {
        if(sysex1[i] != sysex2[i]) {
            return false;
        }
    }
    return true;
}