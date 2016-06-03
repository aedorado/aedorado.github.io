function DayWiseBarChartInit() {

  dwdata = [];
  for (var i = 0; i < data.length; i++) {
    count = parseInt(data[i]['number']);
    j = i + 1;
    while (j < data.length && data[j]['date'] == data[i]['date']) {
      count += parseInt(data[j]['number']);
      j++;
    }
    dwdata.push([data[i]['date'], count]);
    i = j - 1;
  }
  dwdata.reverse();

  var margin = {top: 30, right: 30, bottom: 30, left: 30};
  var height = 500 - margin.top - margin.bottom,
      width = 975 - margin.left - margin.right;

  var yScale = d3.scale.linear()
                .domain([0, d3.max(dwdata, function(d) {
                  return d[1];
                })])
                .range([0, height]);

  var xScale = d3.scale.ordinal()
                .domain(d3.range(0, dwdata.length))
                .rangeBands([0, width], 0);

  var colors = d3.scale.linear()
                  .domain([0, dwdata.length * .33, dwdata.length * .66, dwdata.length])
                  .range(['#1BBC9B', '#C61C6F', '#446CB3', '#85992C']);

  var tooltip = d3.select('body').append('div')
                  .attr('class', 'bc-tooltip');

  dwchart = d3.select('#dw-visual').append('svg')
    .attr('id', 'dw-chart')
    .attr('width', margin.left + width + margin.right)
    .attr('height', margin.top + height + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.right + ')')
    .style('background', '#C9D7D6')
    .selectAll('rect').data(dwdata)
    .enter().append('rect')
    .style('fill', function(d, i) {
      return colors(i);
    })
    .attr('width', xScale.rangeBand())
    .attr('height', 0)
    .attr('x', function(d, i) {
      return xScale(i);
    })
    .attr('y', height)
    .on('mouseover', function(d) {
      tooltip.style('display', '');
      tooltip.html(dateFormat(d[0]) + ', ' + d[1])
        .style('left', (d3.event.pageX + 3) + 'px')
        .style('top', (d3.event.pageY) + 'px');
    })
    .on('mouseout', function(d) {
      tooltip.style('display', 'none');
    });

    dwchart.transition()
      .attr('height', function(d) {
        return yScale(d[1]);
      })
      .attr('y', function(d) {
        return height - yScale(d[1]);
      })
      .delay(function(d, i) {
        return i * 10;
      });

  var vGuideScale = d3.scale.linear()
    .domain([0, d3.max(dwdata, function(d) {
      return d[1];
    })])
    .range([height, 0]);

    var vAxis = d3.svg.axis()
                  .scale(vGuideScale)
                  .orient('left')
                  .ticks(10);

    var vGuide = d3.select('#dw-chart').append('g')
        vAxis(vGuide)
        vGuide.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        vGuide.selectAll('path')
              .style({fill: 'none', stroke: '#000'})
        vGuide.selectAll('line')
              .style({stroke: '#000'});

    var hAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient('bottom')
                  .tickValues(xScale.domain().filter(function(d, i) {
                    return !(i % 10);
                  }));

    var hGuide = d3.select('#dw-chart').append('g')
        hAxis(hGuide)
        hGuide.attr('transform', 'translate(' + margin.left + ',' + (height + margin.top) + ')')
        hGuide.selectAll('path')
              .style({fill: 'none', stroke: '#000'})
        hGuide.selectAll('line')
              .style({stroke: '#000'});

}