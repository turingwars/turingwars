import * as path from 'path';
import * as fs from 'fs';
import * as t from 'io-ts';

import { reporter } from 'io-ts-reporters';

const MysqlConfig = t.type({
    type: t.literal('mysql'),
    host: t.string,
    port: t.number,
    username: t.string,
    password: t.string,
    database: t.string,
});

const SqliteConfig = t.type({
    type: t.literal('sqlite'),
    database: t.string,
});

const schema = t.type({
    "db": t.intersection([
        t.union([
            MysqlConfig,
            SqliteConfig
        ]),
        t.type({
            logging: t.boolean,
            synchronize: t.boolean
        })
    ])
});

export function getConfig(): t.TypeOf<typeof schema> {
    let configFile = findConfigFileInArguments();    
    if (configFile === undefined) {
        configFile = path.resolve(__dirname, '../../config.json');
    }
    const decoded = schema.decode(JSON.parse(fs.readFileSync(configFile).toString('utf-8')))
    if (decoded.isLeft()) {
        throw new Error(reporter(decoded).join('\n'));
    }
    return decoded.value;
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
