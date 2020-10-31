/**
 * Range Checks
 */
const inRange = (x: number, min: number, max: number) => x < min ? min : x > max ? max : x;
const uint7Range = (x: number) => inRange(x, 0, 127);

export const midiValueRange = uint7Range;
export const ccRange = uint7Range;
export const noteRange = uint7Range;