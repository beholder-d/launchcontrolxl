# **launchcontrolxl**
## Novation LaunchControl XL programmatic configurator 
* Loads/Saves confgituation sysex
* Loads/Saves simple JSON configuration
* Programmatic approoach to LCXL configuration

### Code
Create new instance
>const lcxl = new LaunchControlXl();  
Load from sysex
>const sysexFilenmae = './test-data/test.syx';
>const sysex: Sysex = new Sysex(fs.readFileSync(sysexFilename));
>lclx.fromSysex(sysex);
Save to sysex
>const sysex: Sysex - lclx.toSysex();
You can export it to Json too with
>JSON.stringify(lclx.toJson());

### Build, test and run
Run following commands to setup, build and test project:
> npm install --save-dev  
> npm run build  
> npm run test

### Examples
To run example use: 
> npm run example

then check folder:
> ls ./template-data/

For more deails on examples visit:
> ./src/Example/

And check build script:
> see package.json
