import { ControllerType } from '../Common/ControllerType';
import { MessageType } from '../Common/MessageType';
import { MidiChannel, midiChannelRange } from '../Common/MidiChannel';
import { ccRange, midiValueRange } from '../Common/NumericRanges';
import { Sysex } from '../Common/Sysex';
import { Controller, SYSEX_LENGTH } from './Controller';

/**
 * @param id - unit id
 * @param cc - controller number
 * @param midiChannel - midi channel number
 * @param min - minimum value
 * @param max - maximum value
 */
type FaderSetup = {
    id: string;
    cc?: number,
    midiChannel?: MidiChannel,
    min?: number,
    max?: number
};
/**
 * @param id - unit id
 * @param cc - controller number
 * @param midiChannel - midi channel number
 * @param min - minimum value
 * @param max - maximum value
 */
type FaderConfig = Required<FaderSetup>;

class Fader implements Controller {
    controllerType: ControllerType.FADER;
    id: string;
    cc: number;
    messageType: MessageType.CC;    
    midiChannel: MidiChannel;
    min: number;
    max: number;
    /**
     * 
     */
    constructor({
        id,
        cc = 0,
        midiChannel = 0,
        min = 0,
        max = 127
    }: FaderSetup) {
        this.controllerType = ControllerType.FADER;
        this.id = id;
        this.messageType = MessageType.CC
        this.cc = cc;
        this.midiChannel = midiChannel;
        this.min = midiValueRange(min);
        this.max = midiValueRange(max);
    };
    /**
     * Converts fader configuration to configuration object
     * @returns configuration object
     */
    toConfig(): FaderConfig {
        return {
            id: this.id,
            cc: this.cc,
            midiChannel: this.midiChannel,
            min: this.min,
            max: this.max
        };
    }
    /**
     * Converts configuration object to configuration controller
     * @param config configuration object
     * @returns this
     */
    fromConfig(config: FaderConfig): this {
        this.id = config.id;
        this.min = config.min;
        this.max = config.max;
        this.midiChannel = config.midiChannel;
        return this;
    }
    /**
     * Converts sysex to configuration
     * @param sysex - sysex for current controller
     * @returns this
     */
    fromSysex(sysex: Sysex): this {
        if(sysex.length !== SYSEX_LENGTH) {
            throw(`Invalid sysex length. Must be ${SYSEX_LENGTH} bytes long, ${sysex.length} bytes specified`);
        }
        this.cc = ccRange(sysex[0]);
        this.midiChannel = midiChannelRange(sysex[1]);
        this.min = midiValueRange(sysex[2]);
        this.max = midiValueRange(sysex[3]);
        return this;
    };
    /**
     * Converts current instance to sysex parameters
     * @returns sysex of SYSEX_LENGHT of bytes
     */
    toSysex(): Sysex {
        return new Sysex([
            this.cc,
            this.midiChannel,
            this.min,
            this.max,
            0,
            0
        ]);
    };
};

export { 
    Fader, 
    FaderSetup,
    FaderConfig
};