import { ControllerType } from '../Common/ControllerType';
import { LedColor, ledColorName, ledColorNameRange, ledColorRange, ledNameColor } from '../Common/LedColor';
import { MessageType } from '../Common/MessageType';
import { MidiChannel, midiChannelRange } from '../Common/MidiChannel';
import { ccRange, midiValueRange } from '../Common/NumericRanges';
import { Sysex } from '../Common/Sysex';
import { SetString } from '../Common/Trasform';
import { ControllerLed, SYSEX_LENGTH } from './Controller';

/**
 * @param ledMidiChannel - what midi channel for led on/off
 * @param ledColor - led color
 */
type PotentiometerConfigInit = {
    id: string;
    cc?: number,
    midiChannel?: MidiChannel,
    min?: number,
    max?: number,
    ledMidiChannel?: MidiChannel,
    ledColor?: LedColor
};

type PotentiometerConfig = SetString<Required<PotentiometerConfigInit>, 'ledColor'>;

class Potentiometer implements ControllerLed {
    controllerType: ControllerType.POTENTIOMETER;
    id: string;
    cc: number;
    messageType: MessageType.CC;    
    midiChannel: MidiChannel;
    min: number;
    max: number;
    ledMidiChannel: MidiChannel;
    ledColor: LedColor;
    /**
     * 
     */
    constructor({
        id,
        cc = 0,
        midiChannel = 0,
        min = 0,
        max = 127,
        ledMidiChannel = 0,
        ledColor = LedColor.BLACK
    }: PotentiometerConfigInit) {
        this.controllerType = ControllerType.POTENTIOMETER;
        this.id = id;
        this.messageType = MessageType.CC;
        this.cc = cc;
        this.midiChannel = midiChannel;
        this.min = midiValueRange(min);
        this.max = midiValueRange(max);
        this.ledMidiChannel = ledMidiChannel;
        this.ledColor = ledColor;
    };
    /**
     * Converts fader configuration to configuration object
     * @returns configuration object
     */
    toConfig(): PotentiometerConfig {
        return {
            id: this.id,
            cc: this.cc,
            midiChannel: this.midiChannel,
            min: this.min,
            max: this.max,
            ledMidiChannel: this.ledMidiChannel,
            ledColor: ledColorName(this.ledColor)
        };
    };
    /**
     * Converts configuration object to configuration controller
     * @param config configuration object
     * @returns this
     */
    fromConfig(config: PotentiometerConfig): this {
        this.id = config.id;
        this.min = config.min;
        this.max = config.max;
        this.midiChannel = config.midiChannel;
        this.ledMidiChannel = config.ledMidiChannel;
        this.ledColor = ledNameColor(ledColorNameRange(config.ledColor));
        return this;
    }
    /**
     * Converts sysex to configuration
     * @param sysex - sysex for current controller
     * @returns this
     */
    fromSysex(sysex: Sysex): this {
        if(sysex.length !== SYSEX_LENGTH) {
            throw(`Invalid sysex length, must be ${SYSEX_LENGTH} bytes long, ${sysex.length} bytes specified`);
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
    /**
     * Length of led sysex
     */
    static readonly SYSEX_LED_LENGTH = 3;
    /**
     * @returns lenght of led sysex for this unit
     */
    sysexLedLength(): number {
        return Potentiometer.SYSEX_LED_LENGTH;
    }
    /**
     * Converts led sysex to led configuration
     * @param sysex - SYSEX_LENGTH of bytes of sysex for current controller
     * @returns this
     */
    fromSysexLed(sysex: Sysex): this {
        if(sysex.length !== Potentiometer.SYSEX_LED_LENGTH) {
            throw(`Invalid led sysex length, must be ${Potentiometer.SYSEX_LED_LENGTH} bytes long not ${sysex.length}`);
        }       
        this.ledColor = ledColorRange(sysex[1]);
        this.ledMidiChannel = midiChannelRange(sysex[2]);
        return this;
    };
    /**
     * Converts led configuration to led sysex
     * @returns sysex of LED_SYSEX_LENGTH of bytes
     */
    toSysexLed(): Sysex {
        return new Sysex([
            0,
            this.ledColor,
            this.ledMidiChannel
        ]);
    }
};

export { 
    Potentiometer,
    PotentiometerConfig
};