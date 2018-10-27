import * as path from 'path';
import * as fs from 'fs';
import * as rt from 'runtypes';


const MysqlConfig = rt.Record({
    type: rt.Literal('mysql'),
    host: rt.String,
    port: rt.Number,
    username: rt.String,
    password: rt.String,
    database: rt.String,
});

const SqliteConfig = rt.Record({
    type: rt.Literal('sqlite'),
    database: rt.String,
});

const Schema = rt.Record({
    "db": rt.Intersect(
        rt.Union(
            MysqlConfig,
            SqliteConfig
        ),
        rt.Record({
            logging: rt.Boolean,
            synchronize: rt.Boolean
        })
    ),
    "game": rt.Record({
        "maxProgramSize": rt.Number
    })
});

export function getConfig(): rt.Static<typeof Schema> {
    let configFile = findConfigFileInArguments();    
    if (configFile === undefined) {
        configFile = path.resolve(__dirname, '../../config.json');
    }
    try {
        return Schema.check(JSON.parse(fs.readFileSync(configFile).toString('utf-8')))
    } catch (e) {
        console.error("Failed to load config file");
        throw e;
    }
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
