const fs = require('fs');
const { exit } = require('process');

const out = (str) => process.stdout.write(str);
const displayPrompt = () => {
    out(`parsesysex <filename.syx>\n`);
};

const DEFAULT_ORDER = 10;
const orderPad = (order) => order == 10 ? 3 : 2;
const byteToString = (byte, order) => byte.charCodeAt(0).toString(order).toUpperCase().padStart(orderPad(order), '0'); 

const outblock = (title, bytes, separator, disp) => {
    separator = separator || '\n';
    disp = disp || DEFAULT_ORDER; 
    out(title);
    out(bytes.split('').map(byte => byteToString(byte, disp)).join(' ') + separator);
}

const argv = Array.isArray(process.argv) ? process.argv.slice(2) : [];
if(!argv.length) {
    displayPrompt();
    process.exit(1);
}

const filename = argv[0];
if(!fs.existsSync(filename)) {
    out(`${filename} doesn't exist`)
}

const contents = fs.readFileSync(filename, {flag: 'r', encoding: 'binary'});
let position = 0;
/* F0 00 20 29 02 11 77 00 - Novation, Launch Control XL Sysex header */
outblock('Sysex Start: ', contents.slice(position, position += 8), '\n', 16);
const sep = (unit) => unit % 2 ?  undefined : '  |  ';
for(let row=1; row<4; row++) {
    for(let unit=0; unit<8; unit++) {
        outblock(`Row ${row}, Pot    ${unit}: `, contents.slice(position, position += 6), sep(unit));
    }
}
out('\n');
for(let unit=0; unit<8; unit++) {
    outblock(`Row 4, Fader  ${unit}: `, contents.slice(position, position += 6), sep(unit));
}
out('\n');
for(let row=1; row<3; row++) {
    for(let unit=0; unit<8; unit++) {
        outblock(`Row ${row}, Button ${unit}: `, contents.slice(position, position += 6), sep(unit));
    }
}
out('\n');
for(let unit=0; unit<4; unit++) {
    outblock(`Rgt-Dn Button ${unit}: `, contents.slice(position, position += 6), sep(unit));
}
for(let unit=0; unit<4; unit++) {
    outblock(`Rgt-Up Button ${unit}: `, contents.slice(position, position += 6), sep(unit));
}
out('\n');
for(let row=1; row<4; row++) {
    for(let unit=0; unit<8; unit++) {
        outblock(`Row ${row}, Pot ${unit} Led ?, Color, Ch: `, contents.slice(position, position += 3), sep(unit))
    }
}

outblock('Sysex End: ', contents.slice(position, position += 1), '\n', 16);

out('\n');
exit(0);