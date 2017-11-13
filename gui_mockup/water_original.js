var $this = $('#player1');
var val = 28;
var gauge = loadLiquidFillGauge($this, val, null);

function liquidFillGaugeDefaultSettings() {
    return {
        height: 200,
        width: 210,
        minValue: 0, // The gauge minimum value.
        maxValue: 100, // The gauge maximum value.
        circleThickness: 0.05, // The outer circle thickness as a percentage of it's radius.
        circleFillGap: 0.05, // The size of the gap between the outer circle and wave circle as a percentage of the outer circles radius.
        backgroundColor: "red", // The color of the outer circle.
        waveHeight: 0.1, // The wave height as a percentage of the radius of the wave circle.
        waveCount: 2, // The number of full waves per width of the wave circle.
        waveAnimateTime: 5000, // The amount of time in milliseconds for a full wave to enter the wave circle.
        waveHeightScaling: true, // Controls wave size scaling at low and high fill percentages. When true, wave height reaches it's maximum at 50% fill, and minimum at 0% and 100% fill. This helps to prevent the wave from making the wave circle from appear totally full or empty when near it's minimum or maximum fill.
        waveAnimate: true, // Controls if the wave scrolls or is static.
        waveColor: "#178BCA", // The color of the fill wave.
        waveOffset: .25, // The amount to initially offset the wave. 0 = no offset. 1 = offset of one full wave.
        textVertPosition: .5, // The height at which to display the percentage text withing the wave circle. 0 = bottom, 1 = top.
        textSize: 1, // The relative height of the text to display in the wave circle. 1 = 50%
        valueCountUp: true, // If true, the displayed value counts up from 0 to it's final value upon loading. If false, the final value is displayed.
        displayPercent: true, // If true, a % symbol is displayed after the value.
        textColor: "white", // The color of the value text when the wave does not overlap it.
        waveTextColor: "white", // The color of the value text when the wave overlaps it.
        fillShape: "rect", // circle or rect - shape of wave
        waveStartColor: "#178BCA", // starting color
        waveColorDuration: 1000, // how long it takes to change from starting color to wave color
        displayText: true, // display the percentage text
        displayOverlay: false, // display the overlay
        overlayImageSrc: "", // overlay image source
        overlayImageHeight: "", // overlay image height
        overlayImageWidth: "", // overlay image width
        axisLabel: "", //display a label at the bottom axis
        margin: 0
    };
}

function loadLiquidFillGauge(elementId, value, config) {
    if (config == null) config = liquidFillGaugeDefaultSettings();

    const chart = d3.select(elementId[0])
        .append("svg")
        .attr("width", config.width)
        .attr("height", config.height);

    const gauge = chart
        .append("g")
        .attr('transform', 'translate(0,0)');


    const randId = "liquid_xx"; //_.uniqueId('liquid_');
    var radius = Math.min(parseInt(config.width), parseInt(config.height)) / 2;

    radius = config.height / 2;

    const locationX = parseInt(config.width) / 2 - radius;
    var locationY = parseInt(config.height) / 2 - radius;

    if (config.fillShape == "rect") {
        locationY = 0;
    }

    const fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value)) / config.maxValue;

    let waveHeightScale = null;
    if (config.waveHeightScaling) {
        waveHeightScale = d3.scaleLinear()
            .range([0, config.waveHeight, 0])
            .domain([0, 50, 100]);
    } else {
        waveHeightScale = d3.scaleLinear()
            .range([config.waveHeight, config.waveHeight])
            .domain([0, 100]);
    }

    const textPixels = (config.textSize * radius / 2);
    const textFinalValue = parseFloat(value).toFixed(2);
    const textStartValue = config.valueCountUp ? config.minValue : textFinalValue;
    const percentText = config.displayPercent ? "%" : "";
    const circleThickness = config.circleThickness * radius;
    const circleFillGap = config.circleFillGap * radius;
    const fillCircleMargin = circleThickness + circleFillGap;
    const fillCircleRadius = radius - fillCircleMargin;
    const waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);

    const waveLength = fillCircleRadius * 2 / config.waveCount;
    const waveClipCount = 1 + config.waveCount;
    const waveClipWidth = waveLength * waveClipCount;


    // Data for building the clip wave area.
    const data = [];
    for (let i = 0; i <= 40 * waveClipCount; i++) {
        data.push({
            x: i / (40 * waveClipCount),
            y: (i / (40))
        });
    }

    console.log(data);

    // Scales for drawing the outer circle.
    const gaugeCircleX = d3.scaleLinear().range([0, 2 * Math.PI]).domain([0, 1]);
    const gaugeCircleY = d3.scaleLinear().range([0, radius]).domain([0, radius]);

    // Scales for controlling the size of the clipping path.
    const waveScaleX = d3.scaleLinear().range([0, waveClipWidth]).domain([0, 1]);
    const waveScaleY = d3.scaleLinear().range([0, waveHeight]).domain([0, 1]);


    // Scales for controlling the position of the clipping path.

    // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
    // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
    // circle at 100%.

    const waveRiseScale = d3.scaleLinear()
        .range([(fillCircleMargin + fillCircleRadius * 2 + waveHeight), (fillCircleMargin - waveHeight)])
        .domain([0, 1]);

    const waveAnimateScale = d3.scaleLinear()
        .range([0, waveClipWidth - fillCircleRadius * 2]) // Push the clip area one full wave then snap back.
        .domain([0, 1]);


    // Center the gauge within the parent SVG.
    const gaugeGroup = gauge.append("g")
        .attr('transform', 'translate(-10,' + locationY + ')');


    // Draw the outer block.
    gaugeGroup.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", config.width)
        .attr("height", config.height);

    // The clipping wave area.
    const clipArea = d3.area()
        .x(function(d) {
            return waveScaleX(d.x);
        })
        .y0(function(d) {
            return waveScaleY(Math.sin(Math.PI * 2 * config.waveOffset * -1 + Math.PI * 2 * (1 - config.waveCount) + d.y * 2 * Math.PI));
        });

    clipArea
        .y1(function(d) {
            return (fillCircleRadius * 2 + waveHeight);
        });


    const waveGroup = gaugeGroup.append("defs")
        .append("clipPath")
        .attr("id", "clipWave" + randId);
    const wave = waveGroup.append("path")
        .datum(data)
        .attr("d", clipArea)
        .attr("T", 0);

    // The inner circle with the clipping wave attached.
    const fillGroup = gaugeGroup.append("g").attr("clip-path", "url(#clipWave" + randId + ")");

    // Draw the wave shape
    fillGroup.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", config.width - 2 * config.margin)
        .attr("height", config.height - 2 * config.margin)

    fillGroup
        .style("fill", config.waveStartColor)
        .transition()
        .duration(config.waveColorDuration)
        .style("fill", config.waveColor);

    // wave and waveGroup are separate so that horizontal and vertical movement can be controlled independently.
    const waveGroupXPosition = fillCircleMargin + fillCircleRadius * 2 - waveClipWidth;
    waveGroup.attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(fillPercent) + ')');

    if (config.waveAnimate) animateWave();

    function animateWave() {
        wave.attr('transform', 'translate(' + waveAnimateScale(wave.attr('T')) + ',0)');
        wave.transition()
            .duration(config.waveAnimateTime * (1 - wave.attr('T')))
            .ease(d3.easeLinear)
            .attr('transform', 'translate(' + waveAnimateScale(1) + ',0)')
            .attr('T', 1)
            .on('end', function() {
                wave.attr('T', 0);
                animateWave(config.waveAnimateTime);
            });
    }
}