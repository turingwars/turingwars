
/* Base palette. This is not exported so we force users have to think about a color's function. */

const GOLD = '#f09609';
const GOLD_0 = '#C97F08';
const GOLD_1 = GOLD;
const GOLD_2 = '#FFA10A';

const PURPLE = '#ff0097';
const PURPLE_0 = '#D80082';
const PURPLE_1 = PURPLE;
const PURPLE_2 = '#FF0098';

const BLUE = '#1ba1e2';
const BLUE_0 = '#1685BC';
const BLUE_1 = BLUE;
const BLUE_2 = '#1EB4FF';


/* Theme colors */

export const COLOR_PRIMARY = GOLD;
export const COLOR_PRIMARY_0 = GOLD_0;
export const COLOR_PRIMARY_1 = GOLD_1;
export const COLOR_PRIMARY_2 = GOLD_2;
export const COLOR_SECONDARY = PURPLE;
export const COLOR_SECONDARY_0 = PURPLE_0;
export const COLOR_SECONDARY_1 = PURPLE_1;
export const COLOR_SECONDARY_2 = PURPLE_2;

/* Grayscale */

export const GRAY = '#666';
export const BLACK = '#000';
export const GRAY_0 = '#333';
export const GRAY_1 = GRAY;
export const GRAY_2 = '#ccc';
export const WHITE = '#fff';


/* Typography */

export const COLOR_TEXT = WHITE;
export const COLOR_ERROR = '#f00';

/* Gameplay colors */

export const COLOR_P1 = BLUE;
export const COLOR_P1_0 = BLUE_0;
export const COLOR_P1_1 = BLUE_1;
export const COLOR_P1_2 = BLUE_2;

export const COLOR_P2 = PURPLE;
export const COLOR_P2_0 = PURPLE_0;
export const COLOR_P2_1 = PURPLE_1;
export const COLOR_P2_2 = PURPLE_2;


/* Memory map colors */

const BLUEGOLD = '#1dd300';
const PURPLEGOLD = '#ff6a00';
export const COLOR_INSTR_MINE = GOLD;
export const COLOR_INSTR_MINE_P1 = BLUEGOLD;
export const COLOR_INSTR_MINE_P2 = PURPLEGOLD;
export const COLOR_INSTR_NOP = GRAY;
export const COLOR_CHANGED_INSTR = WHITE;

/* Effects */

export const CRT_GLITCH_TEXT_LG = `text-shadow: 3px 1px 2px ${PURPLE}, -2px 1px 2px ${BLUE}, 0px 0px 2px #ccc, 0px 1px 1px #fff;`;
export const CRT_GLITCH_BOX_LG = `box-shadow: 3px 1px 2px ${PURPLE}, -2px 1px 2px ${BLUE}, 0px 0px 2px #ccc, 0px 1px 1px #fff;`;