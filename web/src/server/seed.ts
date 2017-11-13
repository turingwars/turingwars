import { Connection } from 'typeorm';

import { Champion } from './entities/Champion';

/**
 * Ensures some demo data is loaded in the database when first loaded.
 *
 * @param connection A working database connection
 */
export async function seedDatabase(connection: Connection): Promise<void> {
    const repo = connection.getRepository(Champion);

    if (await repo.findOne() == null) {
        await repo.save([
            impChampion(),
            minerChampion(),
            dwarfChampion(),
            dwarf2Champion()
        ]);
    }
}

function minerChampion(): Champion {
    const champion = new Champion();
    champion.name = 'Miner';
    champion.code = `mine %id`;
    return champion;
}

function impChampion(): Champion {
    const champion = new Champion();
    champion.name = 'Imp';
    champion.code = `mov 1 0`;
    return champion;
}

function dwarfChampion(): Champion {
    const champion = new Champion();
    champion.name = 'Dwarf';
    champion.code =
`add b(3) 4
mov b(2) 2
jmp -2
mine %id`;
    return champion;
}

function dwarf2Champion(): Champion {
    const champion = new Champion();
    champion.name = 'Dwarf2.0';
    champion.code =
`nop
nop
add b(3) 4
mov b(2) 2
jmp -2
mine %id`;
    return champion;
}
