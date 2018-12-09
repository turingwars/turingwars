import { Container, injectable } from 'inversify';
import { getConfig } from '../../config';
import { Champion } from './data/Champion';
import { Repository, createConnection, Connection } from 'typeorm';
import { GameLog } from './data/GameLog';
import { seedDatabase } from './data/seed';
import { pause } from 'shared/utils';
import { CHAMPIONS_REPO, GAMES_REPO } from './TuringWarsModuleConstants';
import { TuringWarsServer } from './TuringWarsServer';
import { IModule } from 'server/framework';
import { TournamentEngine } from './TournamentEngine';

const ONE_SECOND_IN_MS = 2000;
const DB_CONNECT_ATTEMPTS = 40;

@injectable()
export class TuringWarsModule implements IModule {

    private connection: Connection;

    private tournament: TournamentEngine;

    public async configure(container: Container) {
        this.connection = await this.tryConnectToDB();
        await seedDatabase(this.connection);
        container.bind<Repository<Champion>>(CHAMPIONS_REPO).toConstantValue(this.connection.getRepository(Champion));
        container.bind<Repository<GameLog>>(GAMES_REPO).toConstantValue(this.connection.getRepository(GameLog));
        container.bind(TuringWarsServer).toSelf();
        container.bind(TournamentEngine).toSelf();
    }

    public async start(container: Container) {
        container.get(TuringWarsServer).attach();
        this.tournament = container.get(TournamentEngine);
        this.tournament.startAutoUpdate();
    }

    public async teardown() {
        await this.tournament.stopAutoUpdate();
        await this.connection.close();
    }

    private async tryConnectToDB() {
        for (let i = 0 ; i < DB_CONNECT_ATTEMPTS ; i++) {
            try {
                return await createConnection({
                    ...getConfig().db,
                    entities: [
                        Champion,
                        GameLog
                    ],
                });
            } catch (e) {
                if (i == DB_CONNECT_ATTEMPTS - 1) {
                    console.log(`Could not connect to DB after ${DB_CONNECT_ATTEMPTS} attempts!`);
                    throw e;
                } else {
                    console.log(e);
                    console.log("Failed to connect. Retrying...");
                }
            }
            await pause(ONE_SECOND_IN_MS);
        }
        throw new Error("Unreachable code reached!");
    }
}
