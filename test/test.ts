import { deepStrictEqual } from 'assert';
import * as fs from 'fs';
import { ControllerType } from '../src/Common/ControllerType';
import { ledColorList } from '../src/Common/LedColor';
import { MessageType } from '../src/Common/MessageType';
import { Sysex } from '../src/Common/Sysex';

import LaunchControlXl from '../src/LaunchControlXl';

const frmt = (x: string) => 
    x.replace(/},/g, '},\n')
    .replace(/(?<!^){/g, '  {')
    .replace(/\[/g,'[\n')
    .replace(/\],/g,'\n],\n')
    .replace(/,"/g,', "')
    .replace(/":/g,'": ')
    .replace(']}', '\n]}');

{ 
    const sysexFilename = './template/test.syx';
    const sysex: Sysex = new Sysex(fs.readFileSync(sysexFilename));
    // init Launch Control XL with test.syx
    const testLcxl = (new LaunchControlXl()).fromSysex(sysex);
    // get lcxl sys and save it
    const diffSysexFilename = './template/test-for-diff.syx';
    const diffSysex = testLcxl.toSysex();
    fs.writeFileSync(diffSysexFilename, diffSysex);

    console.log(`Comparing ${sysexFilename} and ${diffSysexFilename}`);
    deepStrictEqual(sysex, diffSysex, `${sysexFilename} and ${diffSysexFilename} are different`);

    const jsonDiffFilename = './template/test-for-diff.json';
    const testDiffConfig = testLcxl.toConfig();
    fs.writeFileSync(jsonDiffFilename, frmt(JSON.stringify(testDiffConfig)));

    const jsonFilename = './template/test.json';
    const testConfig = JSON.parse(fs.readFileSync(jsonFilename, 'utf8'));

    console.log(`Comparing ${jsonFilename} and ${jsonDiffFilename}`);
    deepStrictEqual(testConfig, testDiffConfig, `${jsonFilename} and ${jsonDiffFilename} are different`);
}
{
    const lcxl = new LaunchControlXl();
    lcxl.controller.forEach((ctrl, i) => {
        ctrl.messageType = MessageType.CC;
        ctrl.cc = 10 + i;
        if(ctrl.controllerType === ControllerType.POTENTIOMETER) {
            ctrl.ledColor = ledColorList[(i % LaunchControlXl.UNITS_PER_ROW) % ledColorList.length];
            ctrl.ledMidiChannel = 0;
        }
    });

    const diffSysex = lcxl.toSysex();
    const diffSysexFilename = './template/inc-for-diff.syx';
    fs.writeFileSync(diffSysexFilename, diffSysex);

    const sysexFilename = './template/inc.syx';
    const sysex: Sysex = new Sysex(fs.readFileSync(sysexFilename));

    console.log(`Comparing ${sysexFilename} and ${diffSysexFilename}`);
    deepStrictEqual(sysex, diffSysex, `${sysexFilename} and ${diffSysexFilename} are different`);
}