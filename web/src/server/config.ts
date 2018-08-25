import * as path from 'path';
import * as fs from 'fs';

export function getConfig() {
    let configFile = findConfigFileInArguments();    
    if (configFile === undefined) {
        configFile = path.resolve(__dirname, '../../config.json');
    }
    console.log(configFile);
    return JSON.parse(fs.readFileSync(configFile).toString('utf-8'));
}

function findConfigFileInArguments(): string | undefined {
    for (let i = 2 ; i < process.argv.length ; i++) {
        if (process.argv[i] === '--config') {
            if (process.argv.length <= i + 1) {
                throw new Error("--config flag expects a config file");
            }
            return path.resolve(process.cwd(), process.argv[i + 1]);
        }
    }
    return;
}
