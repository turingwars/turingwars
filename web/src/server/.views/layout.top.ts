
/* tslint:disable */
// This file was generated from a topside template.
// Do not edit this file, edit the original template instead.

import * as __escape from 'escape-html';
__escape;


export interface __Section {
    (parent: () => string): () => string;
}
export type __Params = {

} 

function __identity<T>(t: T): T {
    return t;
}
__identity;

function __safeSection(section?: __Section): __Section {
        return section ? section : __identity;
}
__safeSection;

export default function(__params?: __Params, __childSections?: {
            'styles'?: __Section;
            'content'?: __Section;
            'scripts'?: __Section;
        }): string {


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
    const __text = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\">\n    <meta http-equiv=\"Pragma\" content=\"no-cache\">\n\n    <link rel=\"shortcut icon\" href=\"icons/icon32.ico\" />\n    <link rel=\"shortcut icon\" href=\"icons/icon32.png\" />\n    <link rel=\"shortcut icon\" href=\"icons/icon64.ico\" />\n    <link rel=\"shortcut icon\" href=\"icons/icon64.png\" />\n    <link rel=\"apple-touch-icon\" href=\"icons/icon64.png\" />\n\n    <title>Turing Wars</title>\n\n    <link rel=\"stylesheet\" href=\"/css/main.css\">\n\n    <!--[if lt IE 9]>\n        <script src=\"https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.js\"></script>\n    <![endif]-->\n\n    " + __sections["styles"](() => "")() + "\n</head>\n<body>\n\n</body>\n    " + __sections["content"](() => "")() + "\n    <!-- <script src='/js/stars.js'></script> This script was tapping too much into the CPU -->\n    " + __sections["scripts"](() => "")() + "\n</html>";
    __text;
    return __text;
};
//# sourceMappingURL=layout.top.ts.map