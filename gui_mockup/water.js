var animateWaves = false

var changeFn1 = createFillGauge($('#player1progressbar'), '#ff0097');
var changeFn2 = createFillGauge($('#player2progressbar'), '#1ba1e2');

function changeScoreText(id, val){
    $('#'+id).html(val);
    $('#'+id).css('font-size', '50px').css('color', '#f09609')
    if(val < 100) {
        $('#'+id).animate({
            'font-size': 30,
            'color': '#333'},
            100, function() {
        });
    } else {
        $('#'+id).animate({
            'font-size': 40},
            100, function() {
        }).addClass('yellow');

        setTimeout(function(){
            // big popup
            $("#innerBody").after('<div id="endText" class="yellow">Goliath &nbsp; wins</div>')
            $('#endText').animate({
                'font-size': 100},
                1000, function() {
            });
            // important : remove the wave animation and the flickering
            animateWaves = false;
        }, 2000);
    }
}

function changeScoreSlow(i){

    if(i>100){
        i=100;
    }

    changeFn2(i);
    changeScoreText('player2score', i);

    if(i<100){
        setTimeout(function(){changeScoreSlow(i+5)}, 200)
    }
}
changeScoreSlow(1);

function createFillGauge(elementId, waveColor) {

    const randId = _.uniqueId('liquid_');
    const width = 199;
    const height = 500;
    const fillPercent = 10;
    const waterHeight = Math.ceil(fillPercent * height/100);
    const waveHeight = 3;
    const waveAnimatationTime = 4000 + 5000*Math.random();
    const waveStartOffset = -100;
    const waveCount = 2; //number of full waves
    const waveMaskLength = 100;

    const chart = d3.select(elementId[0])
        .append("svg")
        .attr("class", "waterProgressBar")
        .attr("width", width)
        .attr("height", height);

    const gauge = chart.append("g").attr('transform', 'translate(0,0)').attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height);

    const waveLength = waveMaskLength * 2 / waveCount;
    const waveClipCount = 1 + waveCount;
    const waveClipWidth = waveLength * waveClipCount;


    // Data for building the clip wave area.
    const data = [];
    for (let i = 0; i <= 40 * waveClipCount; i++) {
        data.push({
            x: i / (40 * waveClipCount),
            y: (i / (40))
        });
    }

    // Scales for controlling the size of the clipping path.
    const waveScaleX = d3.scaleLinear().range([0, waveClipWidth]).domain([0, 1]);
    const waveScaleY = d3.scaleLinear().range([0, waveHeight]).domain([0, 1]);


    // Scales for controlling the position of the clipping path.

    // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
    // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
    // circle at 100%.

    const waveAnimateScale = d3.scaleLinear()
        .range([0, waveClipWidth - waveMaskLength * 2]) // Push the clip area one full wave then snap back.
        .domain([0, 1]);

    // The clipping wave area.
    const clipArea = d3.area()
        .x(function(d) {
            return waveScaleX(d.x);
        })
        .y0(function(d) {
            return waveScaleY(Math.sin(Math.PI * 2 * (1 - waveCount) + d.y * 2 * Math.PI));
        });

    clipArea
        .y1(function(d) {
            return height;
        });


    const waveGroup = gauge.append("defs")
        .append("clipPath")
        .attr("id", "clipWave" + randId);

    const wave = waveGroup.append("path")
        .datum(data)
        .attr("d", clipArea)
        .attr("T", 0);

    // The inner circle with the clipping wave attached.
    const fillGroup = gauge.append("g").attr("clip-path", "url(#clipWave" + randId + ")");

    fillGroup.append("image")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 200)
        .attr("height", 531)
        .style("opacity", 0.1)
        .attr('href', 'water2.gif')

    // Draw the wave shape
    fillGroup.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height)
        .style("fill", waveColor)
        .style("opacity", 0.5)

    waveGroup.attr('transform', 'translate(' + waveStartOffset + ',' + (height - waterHeight) + ')');

    animateWave();

    function animateWave() {
        if(!animateWaves) {
            return
        }

        wave.attr('transform', 'translate(' + waveAnimateScale(wave.attr('T')) + ',0)');
        wave.transition()
            .duration(waveAnimatationTime * (1 - wave.attr('T')))
            .ease(d3.easeLinear)
            .attr('transform', 'translate(' + waveAnimateScale(1) + ',0)')
            .attr('T', 1)
            .on('end', function() {
                wave.attr('T', 0);
                animateWave();
            });
    }

    function changeHeight(newPercentage){
        const waterHeight = Math.ceil(newPercentage * height/100);
        waveGroup.transition().duration(1000).ease(d3.easeLinear).attr('transform', 'translate(' + waveStartOffset + ',' + (height - waterHeight) + ')');
    }

    return changeHeight
}

