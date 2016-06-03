function barCharInit() {

  var margin = {top: 30, right: 30, bottom: 30, left: 30};
  var height = 500 - margin.top - margin.bottom,
      width = 975 - margin.left - margin.right;

  var yScale = d3.scale.linear()
                .domain([0, d3.max(sortable, function(d) {
                  return d[1];
                })])
                .range([0, height]);

  var xScale = d3.scale.ordinal()
                .domain(d3.range(0, sortable.length))
                .rangeBands([0, width], 0);

  var colors = d3.scale.linear()
                  .domain([0, sortable.length * .33, sortable.length * .66, sortable.length])
                  .range(['#B58929', '#C61C6F', '#268BD2', '#85992C']);

  var tooltip = d3.select('body').append('div')
                  .attr('class', 'bc-tooltip');

  barchart = d3.select('#bc-visual').append('svg')
    .attr('id', 'bc-chart')
    .attr('width', margin.left + width + margin.right)
    .attr('height', margin.top + height + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.right + ')')
    .style('background', '#C9D7D6')
    .selectAll('rect').data(sortable)
    .enter().append('rect')
    .style('fill', function(d, i) {
      return colors(i);
    })
    .attr('class', function(d, i) {
      return d[0].substring(d[0].length - 3, d[0].length - 1).split('').reverse().join('');
    })
    .attr('width', xScale.rangeBand())
    .attr('height', 0)
    .attr('x', function(d, i) {
      return xScale(i);
    })
    .attr('y', height)
    .on('mouseover', function(d) {
      tooltip.style('display', '');
      tooltip.html(d + ',' + Math.round(d[1] * 100 / maxdays) + '%')
        .style('left', (d3.event.pageX + 3) + 'px')
        .style('top', (d3.event.pageY) + 'px');
    })
    .on('mouseout', function(d) {
      tooltip.style('display', 'none');
    });

    barchart.transition()
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
    .domain([0, d3.max(sortable, function(d) {
      return d[1];
    })])
    .range([height, 0]);

    var vAxis = d3.svg.axis()
                  .scale(vGuideScale)
                  .orient('left')
                  .ticks(10);

    var vGuide = d3.select('#bc-chart').append('g')
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

    var hGuide = d3.select('#bc-chart').append('g')
        hAxis(hGuide)
        hGuide.attr('transform', 'translate(' + margin.left + ',' + (height + margin.top) + ')')
        hGuide.selectAll('path')
              .style({fill: 'none', stroke: '#000'})
        hGuide.selectAll('line')
              .style({stroke: '#000'});

  $(".bc-cb").change(function(event) {
      var cbclass = (event.target.id).substring(3, 5).split('').reverse().join('');
      if(!this.checked) {
          // d3.selectAll('rect.' + cbclass).transition().attr('height', 0);
          d3.selectAll('rect.' + cbclass).classed({'bar-shrunk': true});
      } else {
          var rects = d3.selectAll('#bc-visual rect');
          d3.selectAll('rect.' + cbclass).classed({'bar-shrunk': false});
      }
    });

  $(".percentile").change(function() {
    var ptileValue = $(this).val();
    $('.ptile-start-show').html('>=' + ptileValue + '%');
    barchart.transition()
      .attr('height', function(d) {
        if (Math.round(d[1] * 100 / maxdays) >= ptileValue) {
          return yScale(d[1]);
        } else {
          return 0;
        }
      })
      .attr('y', function(d) {
        return height - yScale(d[1]);
      })
      .ease('elastic')
      .delay(function(d, i) {
        return i * 8;
      });
  });

  function barChart() {
    maxdays = -1;
    for (var i = 0; i < sortable.length; i++) {
      sortable[i][1] = 0;
      // console.log(sortable[i][0]);
      for (var j = data.length - 1; j >= 0; j--) {
        if (data[j].date > endDate) {
          break;
        }
        if (data[j].date >= startDate) {
          if ((data[j].names).indexOf((sortable[i][0]).substring(0, (sortable[i][0]).indexOf('('))) >= 0) {
            sortable[i][1]++;
          }
        }
      }
      maxdays = Math.max(maxdays, sortable[i][1]);
    }

    barchart.transition()
      .attr('height', function(d) {
        if (Math.round(d[1] * 100 / maxdays) >= $(".percentile").val()) {
          return yScale(d[1]);
        } else {
          return 0;
        }
      })
      .attr('y', function(d) {
        return height - yScale(d[1]);
      })
      .ease('elastic')
      .delay(function(d, i) {
        return i * 8;
      });

  }

  $('.line-from').change(function() {
    startDate = $(this).val();
    $('.line-from').attr('value', startDate);
    $('#start-date-1').attr('value', startDate);
    barChart();
  });

  $('.line-to').change(function() {
    endDate = $(this).val();
    $('.line-to').attr('value', endDate);
    $('#end-date-1').attr('value', endDate);
    barChart();
  });

}