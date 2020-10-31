import { Sysex } from '../Common/Sysex';

const SYSEX_LENGTH = 6;

interface Controller {
    id: string;
    fromSysex(sysex: Sysex): this;
    toSysex(): Sysex;   
}

interface ControllerLed extends Controller {
    fromSysexLed(sysex: Sysex): this;
    toSysex(): Sysex;
}

export {
    Controller,
    ControllerLed,
    SYSEX_LENGTH
}