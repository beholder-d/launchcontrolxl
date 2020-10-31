/**
 * Led Color
 */ 
export enum LedColor {
    BLACK = 0,
    RED = 15,
    YELLOW = 62,
    GREEN = 60,
    AMBER = 47
};
export type LedColorName = 'black' | 'red' | 'yellow' | 'green' | 'amber';
export const ledColorNameMap: { [key in LedColor]: LedColorName } = {
    [LedColor.BLACK]: 'black',
    [LedColor.RED]: 'red',
    [LedColor.YELLOW]: 'yellow',
    [LedColor.GREEN]: 'green',
    [LedColor.AMBER]: 'amber'
};
export const ledNameColorMap: { [key in LedColorName]: LedColor } = {
    'black': LedColor.BLACK,
    'red': LedColor.RED,
    'yellow': LedColor.YELLOW,
    'green': LedColor.GREEN,
    'amber': LedColor.AMBER
};
export const ledColorList = Object.values(ledNameColorMap);
/** 
 * Transform
 */
export const ledColorName = (x: LedColor): LedColorName => ledColorNameMap[x];
export const ledNameColor = (x: LedColorName): LedColor => ledNameColorMap[x];
export const ledColorRange = (x: number): LedColor => x in LedColor ? x : LedColor.BLACK;
export const ledColorNameRange = (x: string): LedColorName => x in ledNameColorMap ? (x as LedColorName) : 'black';