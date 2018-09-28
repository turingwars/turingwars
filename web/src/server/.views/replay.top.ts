
/* tslint:disable */
// This file was generated from a topside template.
// Do not edit this file, edit the original template instead.

import * as __escape from 'escape-html';
__escape;

import __parent, { __Params as __ParentParams } from 'views/layout.top'
export interface __Section {
    (parent: () => string): () => string;
}
export type __Params = {
            PLAYER_1_NAME: string,
            PLAYER_2_NAME: string
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
    const PLAYER_1_NAME = __params.PLAYER_1_NAME;
    const PLAYER_2_NAME = __params.PLAYER_2_NAME;

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
    const __text = "\n" + (() => {
            const __sectionName = "styles";
            __sections[__sectionName] = ((__parent: () => string) => __safeSection(__safeChildSections[__sectionName])(() => "\n\n"));
            return "";
        })() + "\n\n" + (() => {
            const __sectionName = "content";
            __sections[__sectionName] = ((__parent: () => string) => __safeSection(__safeChildSections[__sectionName])(() => "\n\n<div id=\"innerBody\">\n    <div id=\"app\"></div>\n</div>\n\n"));
            return "";
        })() + "\n" + (() => {
            const __sectionName = "scripts";
            __sections[__sectionName] = ((__parent: () => string) => __safeSection(__safeChildSections[__sectionName])(() => "\n        <script src=\"https://unpkg.com/react@16/umd/react.development.js\" crossorigin></script>\n    <script src=\"https://unpkg.com/react-dom@16/umd/react-dom.development.js\" crossorigin></script>\n    <script src=\"https://unpkg.com/redux@4.0.0/dist/redux.js\" crossorigin></script>\n    <script src=\"https://unpkg.com/react-redux@5.0.7/dist/react-redux.js\" crossorigin></script>\n    <script src=\"https://unpkg.com/axios/dist/axios.min.js\"></script>\n\n        <script>\n        var PLAYER_1_NAME = \"" + __escape("" + (PLAYER_1_NAME)) + "\";\n        var PLAYER_2_NAME = \"" + __escape("" + (PLAYER_2_NAME)) + "\";\n    </script>\n    <script src=\"/dist/replay.js\"></script>\n"));
            return "";
        })() + "";
    __text;
    return __parent(__params, __sections);
};
//# sourceMappingURL=replay.top.ts.map