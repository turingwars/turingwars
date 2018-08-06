export const CONSTANTS = {
    boxSize : 10,
    outerBoxSize : 13,
    canvasSize : 600,
    lineWidth : 1,

    drawFightStartFontSize : 40,
    drawFightStopFontSize : 50,
    drawFightDuration : 1000,

    drawWinnerFinalFontSize : 100,
    drawWinnerAnimationLengthInMs : 1000,
    drawWinnerBeforeTimeOut: 2000,

    scoreUpdateStartFontSize : '50px',
    scoreUpdateStopFontSize : '30px',
    scoreUpdateWinFontSize : '40px',
    scoreUpdateDuration : 100,

    scoreMinValue : 0,
    scoreMaxValue : 1000,

    // We keep a history of changed cells so we can show them in "changed" state for
    // longer than just one frame
    changeBufferLength: 5,

    gold: '#f09609',
    purple: '#ff0097',
    blue: '#1ba1e2',
    gray: '#333',
};
