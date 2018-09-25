
/* tslint:disable */
// This file was generated from a topside template.
// Do not edit this file, edit the original template instead.

import * as __escape from 'escape-html';
__escape;
import { Champion } from '../entities/Champion';
import __parent, { __Params as __ParentParams } from 'views/layout.top'
export interface __Section {
    (parent: () => string): () => string;
}
export type __Params = {
            champions: Champion[]
} & __ParentParams

function __identity<T>(t: T): T {
    return t;
}
__identity;

function __safeSection(section?: __Section): __Section {
        return section ? section : __identity;
}
__safeSection;

export default function(__params: __Params, __childSections?: {
            'styles'?: __Section;
            'content'?: __Section;
            'scripts'?: __Section;
        }): string {
    const champions = __params.champions;

    let __safeChildSections: {
            'styles'?: __Section;
            'content'?: __Section;
            'scripts'?: __Section;
        } = __childSections || {};
    __safeChildSections;
    const __sections: {
            'styles': __Section;
            'content': __Section;
            'scripts': __Section;
        } = {
        "styles": __safeSection(__safeChildSections["styles"]),
        "content": __safeSection(__safeChildSections["content"]),
        "scripts": __safeSection(__safeChildSections["scripts"])
    };
    __sections;
    const __text = "\n\n\n" + (() => {
            const __sectionName = "styles";
            __sections[__sectionName] = ((__parent: () => string) => __safeSection(__safeChildSections[__sectionName])(() => "\n<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.31.0/codemirror.css\">\n<link rel=\"stylesheet\" href=\"/css/editor.css\">\n<link rel=\"stylesheet\" href=\"/css/isotope.css\">\n"));
            return "";
        })() + "\n" + (() => {
            const __sectionName = "content";
            __sections[__sectionName] = ((__parent: () => string) => __safeSection(__safeChildSections[__sectionName])(() => "\n\n    <div id=\"innerBody\" class=\"index\">\n        <h1 id=\"title1\">Turing Wars</h1>\n\n        <div id=\"champSelect\">\n            <div id=\"separator\"></div>\n\n            <h2 id=\"player1\">Player 1 &nbsp; &#9662;</h2>\n\n            <div id=\"player2champ\" class=\"champBox\">\n                <table>\n                    <tr>\n                        <td class=\"hidden\"></td>\n                        " + 
(function() {
    if (champions.length > 0) {
        return (" <td class=\"player2\" data-player-id=\"" + __escape("" + (champions[0].id)) + "\">" + __escape("" + (champions[0].name)) + "</td> ");
    }
    return "";}()) + "                        " + 
(function() {
    if (champions.length > 1) {
        return (" <td class=\"player2\" data-player-id=\"" + __escape("" + (champions[1].id)) + "\">" + __escape("" + (champions[1].name)) + "</td> ");
    }
    return "";}()) + "                    </tr>\n                    <tr>\n                        " + 
(function() {
    if (champions.length > 2) {
        return (" <td class=\"player2\" data-player-id=\"" + __escape("" + (champions[2].id)) + "\">" + __escape("" + (champions[2].name)) + "</td> ");
    }
    return "";}()) + "                        " + 
(function() {
    if (champions.length > 3) {
        return (" <td class=\"player2\" data-player-id=\"" + __escape("" + (champions[3].id)) + "\">" + __escape("" + (champions[3].name)) + "</td> ");
    }
    return "";}()) + "                        " + 
(function() {
    if (champions.length > 4) {
        return (" <td class=\"player2\" data-player-id=\"" + __escape("" + (champions[4].id)) + "\">" + __escape("" + (champions[4].name)) + "</td> ");
    }
    return "";}()) + "                    </tr>\n                </table>\n            </div>\n\n            <div id=\"player1champ\" class=\"champBox\">\n                <table>\n                    <tr>\n                        " + 
(function() {
    if (champions.length > 0) {
        return (" <td class=\"player1\" data-player-id=\"" + __escape("" + (champions[0].id)) + "\">" + __escape("" + (champions[0].name)) + "</td> ");
    }
    return "";}()) + "                        " + 
(function() {
    if (champions.length > 1) {
        return (" <td class=\"player1\" data-player-id=\"" + __escape("" + (champions[1].id)) + "\">" + __escape("" + (champions[1].name)) + "</td> ");
    }
    return "";}()) + "                        " + 
(function() {
    if (champions.length > 2) {
        return (" <td class=\"player1\" data-player-id=\"" + __escape("" + (champions[2].id)) + "\">" + __escape("" + (champions[2].name)) + "</td> ");
    }
    return "";}()) + "                    </tr>\n                    <tr>\n                        " + 
(function() {
    if (champions.length > 3) {
        return (" <td class=\"player1\" data-player-id=\"" + __escape("" + (champions[3].id)) + "\">" + __escape("" + (champions[3].name)) + "</td> ");
    }
    return "";}()) + "                        " + 
(function() {
    if (champions.length > 4) {
        return (" <td class=\"player1\" data-player-id=\"" + __escape("" + (champions[4].id)) + "\">" + __escape("" + (champions[4].name)) + "</td> ");
    }
    return "";}()) + "                        <td class=\"hidden\"></td>\n                    </tr>\n                </table>\n                <a id=\"editChamp\" class=\"disabled\" href=\"/\">Edit Source</a>\n            </div>\n\n            <h2 id=\"player2\">&#9652; &nbsp; Player 2</h2>\n\n            <h3 id=\"start\">Go &#x25B8; &#x25B8;</h3>\n\n        </div>\n    </div>\n    <div style=\"display:none\">\n    " + 
(function() {
    let __acc = "";
    for (let champ of champions) {
        __acc += ("\n        <li><a href=\"/champion/" + __escape("" + (champ.id)) + "\">" + __escape("" + (champ.name)) + "</a></li>\n    ");
    }
    return __acc;
}()) + "    </div>\n"));
            return "";
        })() + "    \n" + (() => {
            const __sectionName = "scripts";
            __sections[__sectionName] = ((__parent: () => string) => __safeSection(__safeChildSections[__sectionName])(() => "\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js\"></script>\n    <script src=\"https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/jquery-color/2.1.2/jquery.color.min.js\"></script>\n    <script src='https://cdn.rawgit.com/admsev/jquery-play-sound/master/jquery.playSound.js'></script>\n    <script src=\"/dist/index.js\"></script>\n"));
            return "";
        })() + "";
    __text;
    return __parent(__params, __sections);
};
//# sourceMappingURL=index.top.ts.map