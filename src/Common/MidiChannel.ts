/** 
 * Midi Channel
 */
export type MidiChannel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;
// Transform
// Don't like it
export const midiChannelRange = (x: number): MidiChannel => (0 <= x && x <= 15 ? x : 0) as MidiChannel;