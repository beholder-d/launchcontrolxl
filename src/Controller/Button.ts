import { ControllerType } from '../Common/ControllerType';
import { messageNameType, MessageType, messageTypeName, messageTypeNameRange, messageTypeRange } from '../Common/MessageType';
import { MidiChannel, midiChannelRange } from '../Common/MidiChannel';
import { ccRange, midiValueRange } from '../Common/NumericRanges';
import { ActionType, actionTypeName, actionTypeRange } from '../Common/ActionType';
import { Sysex } from '../Common/Sysex';
import { SetString } from '../Common/Trasform';
import { Controller, SYSEX_LENGTH } from './Controller';

/**
 * @param id - unit id
 * @param messageType - type of emitting message cc or note
 * @param cc - controller number
 * @param note - note number
 * @param midiChannel - midi channel number
 * @param min - minimum value
 * @param max - maximum value
 * @param pressType - type of action toggle or momentary
 */
type ButtonSetup = {
    id: string;
    messageType?: MessageType.CC,
    cc?: number,
    note?: number,
    midiChannel?: MidiChannel,
    min?: number,
    max?: number,
    pressType?: ActionType
};

type ButtonConfig = SetString<SetString<Required<ButtonSetup>, 'messageType'>, 'pressType'>;

class Button implements Controller {
    id: string = '';
    controllerType: ControllerType.BUTTON = ControllerType.BUTTON;
    // How to typeguard situation that it's either CC or Note
    messageType: MessageType; 
    private _value: number;
    midiChannel: MidiChannel;
    min: number;
    max: number;
    actionType: ActionType;
    //
    get note(): number {
        if(this.messageType === MessageType.CC) {
            throw new Error(`Button ${this.id} is emitting cc`);
        }
        return this._value;
    }
    set note(note: number) {
        if(this.messageType === MessageType.CC) {
            throw new Error(`Button ${this.id} is emitting cc`)
        }
        this._value = note;
    }
    get cc(): number {
        if(this.messageType === MessageType.NOTE) {
            throw new Error(`Button ${this.id} is emitting note`);
        }
        return this._value;
    }
    set cc(cc: number) {
        if(this.messageType === MessageType.NOTE) {
            throw new Error(`Button ${this.id} is emitting note`)
        }
        this._value = cc;
    }
    /**
     * 
     */
    constructor({
        id,
        messageType = MessageType.CC,
        cc = 0,
        note = 0,
        midiChannel = 0,
        min = 0,
        max = 127,
        pressType = ActionType.MOMENTARY
    } : ButtonSetup) {
        this.id = id;
        this.messageType = messageTypeRange(messageType);
        this._value = messageType === MessageType.CC ? cc : note;
        this.midiChannel = midiChannelRange(midiChannel);
        this.min = midiValueRange(min);
        this.max = midiValueRange(max);
        this.actionType = actionTypeRange(pressType)
    };
    /**
     * Converts sysex to configuration
     * @param sysex - SYSEX_LENGTH of bytes of sysex for current controller
     * @returns current instance
     */
    fromSysex(sysex: Sysex): this {
        if(sysex.length !== SYSEX_LENGTH) {
            throw(`Invalid sysex length, must be ${SYSEX_LENGTH} bytes long, ${sysex.length} bytes specified`);
        }
        this.messageType = messageTypeRange(sysex[0]);
        this._value = ccRange(sysex[1]);
        this.min = midiValueRange(sysex[2]);
        this.max = midiValueRange(sysex[3]);
        this.actionType = actionTypeRange(sysex[4]);
        this.midiChannel = midiChannelRange(sysex[5]);
        return this;
    };
    /**
     * Converts current instance to sysex parameters
     * @returns sysex of SYSEX_LENGHT of bytes
     */
    toSysex(): Sysex {
        return new Sysex([
            this.messageType,
            this._value ,
            this.min,
            this.max,
            this.actionType,
            this.midiChannel
        ]);
    };

    fromConfig(config: ButtonConfig) {
        this.id = config.id;
        this.messageType = messageNameType(messageTypeNameRange(config.messageType));
        this._value = this.messageType == MessageType.CC ? config.cc: config.note;
        this.min = config.min;
        this.max = config.max;
        this.midiChannel = config.midiChannel;
        this.actionType = config.pressType === 'momentary' ? ActionType.MOMENTARY : ActionType.TOGGLE;
    }

    toConfig(): ButtonConfig {
        const r = {
            id: this.id,
            messageType: messageTypeName(this.messageType),
            [messageTypeName(this.messageType)]: this._value,
            min: this.min,
            max: this.max,
            midiChannel: this.midiChannel,
            pressType: actionTypeName(this.actionType)
        };
        return (r as ButtonConfig);
    }
};

export { 
    Button,
    ButtonConfig
};