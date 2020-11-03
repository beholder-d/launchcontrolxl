/**
 * This file is generating templates with all controllers assigned to 
 * incremental cc starting from 10-65 midi channels 0-7
 * see ./example/incremental
 * node ./build/src/Example/inc-cc-ch1-ch8.js
 */
import * as fs from 'fs';
import LaunchControlXl from '../LaunchControlXl';
import { ControllerType } from '../Common/ControllerType';
import { ledColorList } from '../Common/LedColor';
import { MessageType } from '../Common/MessageType';
import { midiChannelRange } from '../Common/MidiChannel';

{
    const path = `./template-example`
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }

    const lcxl = new LaunchControlXl();
    for(let channel=0; channel<8; channel++) {
        lcxl.controller.forEach((ctrl, i) => {
            ctrl.messageType = MessageType.CC;
            if(ctrl.messageType === MessageType.CC) {
                ctrl.cc = 10 + i;
            }
            ctrl.midiChannel = midiChannelRange(channel);
            if(ctrl.controllerType === ControllerType.POTENTIOMETER) {
                ctrl.ledColor = ledColorList[((i % LaunchControlXl.UNITS_PER_ROW) + 1) % ledColorList.length];
                ctrl.ledMidiChannel = midiChannelRange(channel);
            }
        });

        const sysex = lcxl.toSysex();
        const sysexFilename = `${path}/inc-cc-ch${channel+1}.syx`;
        fs.writeFileSync(sysexFilename, sysex);
    }
}