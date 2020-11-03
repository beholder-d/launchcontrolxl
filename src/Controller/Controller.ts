import { ControllerType } from '../Common/ControllerType';
import { MessageType } from '../Common/MessageType';
import { MidiChannel } from '../Common/MidiChannel';
import { Sysex } from '../Common/Sysex';

const SYSEX_LENGTH = 6;

type ControllerConfig = {
    id: string;
}

interface Controller {
    controllerType: ControllerType;
    id: string;
    messageType: MessageType;
    midiChannel: MidiChannel;
    min: number;
    max: number;

    fromSysex(sysex: Sysex): this;
    toSysex(): Sysex;   
    fromConfig(config: any): this;
    toConfig(): any;
}

interface ControllerLed extends Controller {
    fromSysexLed(sysex: Sysex): this;
    toSysex(): Sysex;
}

export {
    Controller,
    ControllerLed,
    ControllerConfig,
    SYSEX_LENGTH
}