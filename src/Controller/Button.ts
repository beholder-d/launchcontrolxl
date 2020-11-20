import { actionNameType, ActionType, actionTypeName, ActionTypeName, actionTypeNameRange, actionTypeRange } from "../Common/ActionType";
import { ControllerType } from "../Common/ControllerType";
import { messageNameType, MessageType, messageTypeNameRange, messageTypeRange } from "../Common/MessageType";
import { MidiChannel, midiChannelRange } from "../Common/MidiChannel";
import { ccRange, midiValueRange } from "../Common/NumericRanges";
import { Sysex } from "../Common/Sysex";
import { Controller, SYSEX_LENGTH } from "./Controller";

type ButtonSetup = {
    id: string;
    midiChannel?: MidiChannel;
    min?: number;
    max?: number;
    actionType?: ActionType;
}

type ButtonCCSetup = ButtonSetup & {
    messageType: MessageType.CC;
    cc: number;
}

type ButtonNoteSetup = ButtonSetup & {
    messageType: MessageType.NOTE;
    note: number
}

type ButtonCCConfig = Required<Omit<ButtonSetup, 'actionType'>> & {
    messageType: 'cc';
    cc: number;
    actionType: ActionTypeName;
};

type ButtonNoteConfig = Required<Omit<ButtonSetup, 'actionType'>> & {
    messageType: 'note';
    note: number;
    actionType: ActionTypeName;
};

interface ButtonMain extends Controller {
    controllerType: ControllerType.BUTTON;
    actionType: ActionType;
};

interface ButtonCC extends ButtonMain {
    messageType: MessageType.CC;
    cc: number;
};

interface ButtonNote extends ButtonMain {
    messageType: MessageType.NOTE;
    note: number;
};

class Button implements ButtonMain {
    controllerType: ControllerType.BUTTON = ControllerType.BUTTON;
    id: string;
    messageType: MessageType;
    cc: number;
    note: number;
    midiChannel: MidiChannel;
    min: number;
    max: number;
    actionType: ActionType;
    constructor (setup: ButtonSetup | ButtonCCSetup | ButtonNoteSetup) {
        this.id = setup.id;
        // Defaults
        this.note = 0;
        this.cc = 0;
        if(!('messageType' in setup)) {
            this.messageType = MessageType.NOTE;
        } else {
            this.messageType = messageTypeRange(setup.messageType || MessageType.NOTE);           
            if(setup.messageType === MessageType.CC) {
                this.cc = setup.cc;
            } else {
                this.note = setup.note;
            } 
        }
        this.midiChannel = midiChannelRange(setup.midiChannel ?? 0);
        this.min = midiValueRange(setup.min ?? 0);
        this.max = midiValueRange(setup.max ?? 127);
        this.actionType = actionTypeRange(setup.actionType ?? ActionType.TOGGLE);
    }
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
        if (this.messageType === MessageType.CC) {
            this.cc = ccRange(sysex[1]);
        } else {
            this.note = ccRange(sysex[1]);
        }
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
            this.messageType === MessageType.CC ? this.cc : this.note,
            this.min,
            this.max,
            this.actionType,
            this.midiChannel
        ]);
    };
    /**
     * Converts configuration object to configuration controller
     * @param config configuration object
     * @returns this
     */
    fromConfig(config: ButtonCCConfig | ButtonNoteConfig): this {
        this.id = config.id;
        this.messageType = messageNameType(messageTypeNameRange(config.messageType));
        if (config.messageType === 'cc') {
            this.cc = ccRange(config.cc);
        } else {
            this.note = ccRange(config.note);
        }
        this.min = midiValueRange(config.min || 0);
        this.max = midiValueRange(config.max || 0);
        this.midiChannel = midiChannelRange(config.midiChannel || 0);
        this.actionType = actionNameType(actionTypeNameRange(config.actionType));
        return this;
    }
    /**
     * Converts fader configuration to configuration object
     * @returns configuration object
     */
    toConfig(): ButtonCCConfig | ButtonNoteConfig {
        if(this.messageType == MessageType.CC) {
            return {
                id: this.id,
                messageType: 'cc',
                cc: this.cc,
                midiChannel: this.midiChannel,
                max: this.max,
                min: this.min,
                actionType: actionTypeName(this.actionType)
            };
        } else {
            return {
                id: this.id,
                messageType: 'note',
                note: this. note,
                midiChannel: this.midiChannel,
                max: this.max,
                min: this.min,
                actionType: actionTypeName(this.actionType)
            };
        }
    }

}

export { 
    Button,
    ButtonCC,
    ButtonNote,
    ButtonCCConfig,
    ButtonNoteConfig
};