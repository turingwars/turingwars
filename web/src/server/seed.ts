import { Connection } from 'typeorm';

import { Champion } from './entities/Champion';

/* Some more neat champions:


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
    champion.code =
`; === Miner ===
; Mines, and then goes back to mining, forever
mine %id
jmp -1`;
    return champion;
}

function impChampion(): Champion {
    const champion = new Champion();
    champion.name = 'Imp';
    champion.code =
`; === Imp ===
; Copies the instruction it is executing to the next instruction.
; It will keep moving forward and execute the same instruction over
; and over, erasing everything on its path
mov 1 0`;
    return champion;
}

function dwarfChampion(): Champion {
    const champion = new Champion();
    champion.name = 'Seeder';
    champion.code =
`; === Seeder ===
; Seeds the map with his own 'mine' instruction in the hope that someone will eventually execute it

; Increments the address counter
add b(3) 4
; Copies the 'mine' instruction to the address pointed by the counter
mov b(2) 2
; Goes back to the top
jmp -2

; This instruction has a b-field even though it is unused.
; We store the address counter in it.
mine %id
`;
    return champion;
}

function dwarf2Champion(): Champion {
    const champion = new Champion();
    champion.name = 'Dwarf';
    champion.code =
`; === Dwarf ===
; Plants tunnels to its own mine then goes to work


; Control loop:

; Increment the target address
add a(2) 8
; Updates the tunnel so that its relative offset still points to our trap
sub a(3) 8
; Copy the tunnel to the next target address
mov 1 2
; This is replaced by a tunnel when the offset wraps around the core,
; meaning that we start mining after we are done flooding the core with tunnels.
jmp -3

; This is the tunnel that is being copied around.
; Note that victims will actually land on the "mine" and not
; on "jmp* two instructions below because we initialize the
; "mov" above with an offset of 1
jmp 2

; The trap
mine %id
jmp -1`;
    return champion;
}
