export const ROUTE_HOME = "/";
export const ROUTE_CREATE_HERO = "/creator";
export const ROUTE_EDITOR = "/editor";
export const ROUTE_IMPORT_HERO = "/editor/load";
export const ROUTE_REPLAY = "/replay";
export const ROUTE_MATCHMAKING = "/match";
export const URL_ABOUT = "https://github.com/turingwars/turingwars#readme";

export function navigateTo(target: string) {
    window.location.hash = target;
}
