import { Potentiometer, PotentiometerConfig } from './Controller/Potentiometer';
import { Fader, FaderConfig } from './Controller/Fader';
import { Button, ButtonConfig } from './Controller/Button';
import { Sysex, sysexEqual } from './Common/Sysex';
import { SYSEX_LENGTH } from './Controller/Controller';

const arrayIncr = (length: number): Array<number> => Array.from({length: length}, (_, i) => i);
const arrayRows = (rowLenght: number, rows: number): Array<{r: number, i: number}> => 
    Array.from({length: rowLenght * rows}, (_, i) => ({r: Math.trunc(i / rowLenght), i: i % rowLenght }));

/**
 * @param x - Sysex part
 * @return '77 77 77'
 */
const sysexToHexstr = (x: Sysex): string => 
    x.reduce((a, n) => a + n.toString(16).toUpperCase().padStart(2, '0') + ' ', '').trim();
/**
 * @param x - '77 77 77'
 * @return Sysex part
 */
const hexstrToSysex = (x: string): Sysex => new Sysex((x.match(/[0-9A-Za-z]{2}/g) || []).map(x => parseInt(x,16)));

type LaunchControlXlConfig = {
    potentiometer: PotentiometerConfig[], 
    fader: FaderConfig[], 
    button: ButtonConfig[], 
    upperButton: ButtonConfig[]
    lowerButton: ButtonConfig[]
};

class LaunchControlXl {
    static readonly UNITS_PER_ROW = 8;
    static readonly POTENTIOMETER_ROWS = 3;
    static readonly BUTTON_ROWS = 2;
    static readonly UD_BUTTONS_PER_GROUP = 4;

    potentiometer: Array<Potentiometer>;
    fader: Array<Fader>
    button: Array<Button>;
    upperButton: Array<Button>;
    lowerButton: Array<Button>;

    controller: Array<Potentiometer | Fader | Button>;
    controllerLed: Array<Potentiometer>;

    constructor() {
        this.potentiometer = arrayRows(LaunchControlXl.UNITS_PER_ROW, LaunchControlXl.POTENTIOMETER_ROWS)
            .map(({r, i}) => new Potentiometer({id: `P${r}:${i}` }));
        this.fader = arrayIncr(LaunchControlXl.UNITS_PER_ROW).map(i => new Fader({id: `F${i}`}));
        this.button = arrayRows(LaunchControlXl.UNITS_PER_ROW, LaunchControlXl.BUTTON_ROWS)
            .map(({r, i}) => new Button({id: `B${r}:${i}`}));
        this.upperButton = arrayIncr(LaunchControlXl.UD_BUTTONS_PER_GROUP).map(i => new Button({id: `UB${i}`}));
        this.lowerButton = arrayIncr(LaunchControlXl.UD_BUTTONS_PER_GROUP).map(i => new Button({id: `LB${i}`}));

        this.controller = [
            ...this.potentiometer, 
            ...this.fader, 
            ...this.button,
            ...this.lowerButton, 
            ...this.upperButton
        ];
        this.controllerLed = this.potentiometer;
    }
    /**
     * @returns config object
     */
    toConfig(): LaunchControlXlConfig {
        return {
            potentiometer: this.potentiometer.map(x => x.toConfig()),
            fader: this.fader.map(x => x.toConfig()),
            button: this.button.map(x => x.toConfig()),
            upperButton: this.upperButton.map(x => x.toConfig()),
            lowerButton: this.lowerButton.map(x => x.toConfig())
        }
    }
    /**
     * 
     */
    fromConfig(config: LaunchControlXlConfig): this {
        this.potentiometer.forEach((x, i) => x.fromConfig(config.potentiometer[i]));
        this.fader.forEach((x, i) => x.fromConfig(config.fader[i]));
        this.button.forEach((x, i) => x.fromConfig(config.button[i]));
        this.upperButton.forEach((x, i) => x.fromConfig(config.upperButton[i]));
        this.lowerButton.forEach((x, i) => x.fromConfig(config.lowerButton[i]));
        return this;
    }
    /**
     * Novation, Launch Control XL Sysex header 
     */
    static readonly SYSEX_HEADER = hexstrToSysex('F0 00 20 29 02 11 77 00');
    static readonly SYSEX_TAIL = hexstrToSysex('F7');
    /**
     * Reads sysex configures surface
     * @param sysex - sysex string
     * @returns this
     */
    fromSysex(sysex: Sysex): this {
        let pos = 0;
        const header = sysex.slice(pos, pos += LaunchControlXl.SYSEX_HEADER.length);
        if(!sysexEqual(header, LaunchControlXl.SYSEX_HEADER)) {
            throw new Error('Sysex header is inavlid:' + sysexToHexstr(header) 
                + 'instead of' + sysexToHexstr(LaunchControlXl.SYSEX_HEADER));
        }
        this.controller.forEach((x) => x.fromSysex(sysex.slice(pos, pos += SYSEX_LENGTH)));
        this.controllerLed.forEach((x) => x.fromSysexLed(sysex.slice(pos, pos += x.sysexLedLength())));

        const tail = sysex.slice(pos, pos += LaunchControlXl.SYSEX_TAIL.length);
        if(!sysexEqual(tail, LaunchControlXl.SYSEX_TAIL)) {
            throw new Error('Sysex tail is inavlid:' + sysexToHexstr(tail) 
                + 'instead of' + sysexToHexstr(LaunchControlXl.SYSEX_TAIL));
        }
        return this;
    }
    /**
     * Reads surface configuration saves sysex
     * @returns sysex 
     */
    toSysex(): Sysex {
        return new Sysex([
            ...LaunchControlXl.SYSEX_HEADER,
            ...this.controller.reduce((a: number[], x) => a.concat(...x.toSysex()), []),
            ...this.controllerLed.reduce((a: number[], x) => a.concat(...x.toSysexLed()), []),
            ...LaunchControlXl.SYSEX_TAIL
        ]);
    }
};

export {
    LaunchControlXl as default
}