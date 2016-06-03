function LineChartInit() {
  $('#line-name').focus();
  $('#line-name').on('keyup', function(event) {
    if (event.which == 38) {
      if (historyIndex != -1) {
        $(this).val(keyHistory[historyIndex]);
        historyIndex--;
      }
    } else if (event.which == 40) {
      if (historyIndex != keyHistory.length - 1) {
        historyIndex++;
        $(this).val(keyHistory[historyIndex]);
      } else {
        $(this).val('');
      }
    }
    if (event.which == 13) {

      if (startDate > endDate) {
        return ;
      }

      var name = $(this).val().trim();
      $(this).val('');
      if (name.localeCompare('') == 0) {
        return ;
      }
      nameRep = name.replace(' ', '-');
      if (nameList[nameRep] === undefined) {
        lineChart(name);
        keyHistory.push(name);   historyIndex = keyHistory.length - 1;
        if (found) {
          nameList[name.replace(' ', '-')] = 1;
          $('#line-chart-names-display').append($('<span></span>').attr('id', (name.replace(' ', '-') + '-display')).addClass('line-chart-name').html(name).css('background-color', thisColor));
          var lastDiv = $('.line-chart-name').last()
          lastDiv.on('mouseover', function(event) {
            var lineid = '#' + (event.target.id).substring(0, (event.target.id).indexOf('-display'));
            d3.select('path' + lineid).attr("stroke-width", 7);
          });
          lastDiv.on('mouseout', function(event) {
            var lineid = '#' + (event.target.id).substring(0, (event.target.id).indexOf('-display'));
            d3.select('path' + lineid).attr("stroke-width", 2);
          });
          lastDiv.on('click', function (event) {
            var lineid = (event.target.id).substring(0, (event.target.id).indexOf('-display'));
            $(this).addClass('hidden');
            d3.select('g#g-' + lineid).classed({'hidden': true});
            d3.select('path#' + lineid).attr("stroke-width", 2);
            // console.log(lineid);
            nameList[((event.target.id).substring(0, (event.target.id).indexOf('-display')))] = 0;
          });
        }
      } else if (nameList[nameRep] === 0) {
        nameList[nameRep] = 1;
        d3.select('g#g-' + nameRep).classed({'hidden': false});
        $('#' + nameRep + '-display').removeClass('hidden');
      }
    }
  });

    ftype = 'first';
    $('input[type=radio][name=ftype]').change(function() {
        ftype = this.value;
        lineClear();
    });

    var select = $('#line-name-select')
    for (var i = 0; i < sortable.length; i++) {
      var attach = (sortable[i][0]).substring(0, (sortable[i][0]).indexOf('('));
      select.append($("<option/>").attr("value", attach).text(attach));
    }

    $('#line-name-select').change(function () {
      $('#line-name').val($(this).val()).trigger(jQuery.Event('keyup', {which: 13}));
    });

    $('.line-from').change(function() {
      lineClear();
      xAxisChange();
    });

    $('.line-to').change(function() {
      lineClear();
      xAxisChange();
    });

    function xAxisChange() {
      xScale = d3.time.scale().domain([parseDate(startDate), parseDate(endDate)]).range([0, width]);
      hAxis = d3.svg.axis().scale(xScale).orient('bottom').ticks(10);
      d3.select('g#x-axis').remove();
      hGuide = svgContainer.append('g').call(hAxis).attr('id', 'x-axis').attr('transform', 'translate(' + margin.left + ',' + (margin.top + height) + ')');
      hGuide.selectAll('path').style({fill: 'none', stroke: '#000'})
    hGuide.selectAll('line').style({stroke: '#000'});
    }

    keyHistory = [];
    historyIndex = -1;
    nameList = {};
    var found;

    var margin = {top: 40, right: 40, bottom: 40, left: 40};
    var height = 660 - margin.top - margin.bottom,
         width = 950 - margin.left - margin.right;

    var parseDate = d3.time.format("%Y-%m-%d").parse;

    var yScale = d3.scale.linear().domain([0, 100]).range([height, 0]);
    var xScale = d3.time.scale().domain([parseDate(data[data.length - 1].date), parseDate(data[0].date)]).range([0, width]);

    var svgContainer = d3.select("#lc-visual").select("svg").attr("width", margin.right + width + margin.left).attr("height", margin.bottom + height + margin.top);

    var ribbonGroup = svgContainer.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')').attr('height', height).attr('width', width);
    ribbonGroup.append('rect').attr('x', 0).attr('y', 0).attr('height', 3 * height / 20).attr('width', width).attr('fill', 'red').style({opacity:'0.2'});
    ribbonGroup.append('rect').attr('x', 0).attr('y', 3 * height / 20).attr('height', 4 * height / 20).attr('width', width).attr('fill', '#F7CA18').style({opacity:'0.2'});
    ribbonGroup.append('rect').attr('x', 0).attr('y', 7 * height / 20).attr('height', 6 * height / 20).attr('width', width).attr('fill', '#1F3A93').style({opacity:'0.2'});
    ribbonGroup.append('rect').attr('x', 0).attr('y', 13 * height / 20).attr('height', 4 * height / 20).attr('width', width).attr('fill', '#00B16A').style({opacity:'0.2'});
    ribbonGroup.append('rect').attr('x', 0).attr('y', 17 * height / 20).attr('height', 3 * height / 20).attr('width', width).attr('fill', 'grey').style({opacity:'0.2'});

    var vAxis = d3.svg.axis().scale(yScale).orient('left').ticks(10);
    var hAxis = d3.svg.axis().scale(xScale).orient('bottom').ticks(10);

    var hGuide = svgContainer.append('g').call(hAxis).attr('id', 'x-axis').attr('transform', 'translate(' + margin.left + ',' + (margin.top + height) + ')');
    hGuide.selectAll('path').style({fill: 'none', stroke: '#000'})
    hGuide.selectAll('line').style({stroke: '#000'});

    var vGuide = svgContainer.append('g').call(vAxis).attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    vGuide.selectAll('path').style({fill: 'none', stroke: '#000'})
    vGuide.selectAll('line').style({stroke: '#000'});

  function lineChart(name) {

    if (startDate > endDate) {
      return ;
    }
    thisColor = colors[Math.floor((Math.random() * (colors.length - 1)) + 1)];

    found = false;
    lineMap = {};

    var i = data.length - 1;
    while (data[i].date < startDate) {
      i--;
    }
    lineMap[data[i].date] = 0;  var firstDate = true;
    for (; i >= 0; i--) {
      if (data[i].date > endDate) {
        break;
      }
      if (!firstDate) {
        lineMap[data[i].date] = lineMap[data[i + 1].date];
      }
      if (data[i].names.toLowerCase().indexOf(name.toLowerCase()) > -1) {
        lineMap[data[i].date]++;
        found = true;
      }
      firstDate = false;
    }

    if (!found) {
      return ;
    }

    lineData = [];
    i = 0;
    for (key in lineMap) {
      if (lineMap[key] == 0 && ftype === "first") {
        continue;
      }
      i++;
      lineData.push([parseDate(key), (lineMap[key] * 100) / i]);
    }

    var lineFunction = d3.svg.line()
                        .x(function(d, i) { return xScale(d[0]); })
                        .y(function(d, i) { return yScale(d[1]); })
                        .interpolate("linear");

    var tooltip = d3.select("body")
            .append("div")  // declare the tooltip div 
            .attr("class", "bc-tooltip")
            .style({color:thisColor});

    var svgGroup = svgContainer.append('g').attr('class', 'line-class').attr('id', 'g-' + name.replace(' ', '-')).attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var lineGraph = svgGroup.append("path")
                            .attr("id", name.replace(' ', '-'))
                            .attr("d", lineFunction(lineData))
                            .attr("stroke", thisColor)
                            .attr("stroke-width", 2)
                            .attr("fill", "none")
                            .on("mouseover", function() {
                                d3.select('path#' + name.replace(' ', '-')).attr("stroke-width", 6);
                                tooltip.style('display', '');
                                tooltip.html(name).style('left', (d3.event.pageX + 3) + 'px').style('top', (d3.event.pageY) + 'px');
                            })
                            .on("mouseout", function() {
                               d3.select('path#' + name.replace(' ', '-')).attr("stroke-width", 2);
                               tooltip.style('display', 'none');
                            });
    grshrk = 0;                    
    clearInterval(grshrk);
    grshrk = setInterval(function() {
        svgGroup.selectAll("circle")
                .transition().duration(500).ease('quad').attr('r', 6)
                .transition().duration(500).ease('quad').attr('r', 5);
    }, 10000);

    var totalLength = lineGraph.node().getTotalLength();

    lineGraph
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(3500)
      .ease("quad")
      .attr("stroke-dashoffset", 0);


       svgGroup.selectAll("circle")                                    
          .data(lineData)
          .enter().append("circle")                            
          .attr("r", 12)    
          .attr("cx", function(d, i) { return xScale(d[0]); })
          .attr("cy", function(d, i) { return yScale(d[1]); })// - yScale(d[1] * 100 / (i + 1)); })
           // Tooltip stuff after this
          .style({stroke:'#fff', fill:'#fff'})
          .on("mouseover", function(d) {
            d3.select('path#' + name.replace(' ', '-')).attr("stroke-width", 5);
            tooltip.style('display', '');
            tooltip.html(dateFormat(d[0]) + ', ' + parseInt(d[1]) + '%')
              .style('left', (d3.event.pageX + 3) + 'px')
              .style('top', (d3.event.pageY) + 'px');
          })
          .on("mouseout", function(d, i) {
              tooltip.style('display', 'none');
              d3.select('path#' + name.replace(' ', '-')).attr("stroke-width", 2);
          });;

        svgGroup.selectAll("circle")
                .transition()
                .duration(3000)
                .ease('elastic')
                .style({stroke:thisColor})
                .attr('r', 5);
  }

  $('.line-chart-button').click(function(event) {
    if (event.target.id === 'lc-clear') {
      lineClear();
      return ;
    }
    $('#line-radio-group > input:radio').attr('disabled', 'true');
    var i = 0;
    $('#' + event.target.id).attr('disabled', true);
    console.log(event.target.id);
    var tid = (event.target.id).substring((event.target.id).indexOf('-') + 1);
    if (tid === 'button') {
      tid = '';
    }
    var t = setInterval(function() {
      if (i >= sortable.length) {
        $('#line-radio-group > input:radio').removeAttr('disabled');
        clearInterval(t);
        return;
      }
      if ((sortable[i][0]).indexOf(tid) >= 0) {
        lineChart((sortable[i][0]).substring(0, (sortable[i][0]).length - 4));
        $('#auto-line-chart-names-display').append($('<span></span>').attr('title', sortable[i][0]).attr('id', ((sortable[i][0]).substring(0, (sortable[i][0]).length - 4)).replace(' ', '-') + '-display').addClass('line-chart-name-auto').html((sortable[i][0]).substring(0,6) + '..').css('background-color', thisColor));
        var lastDiv = $('.line-chart-name-auto').last();
          lastDiv.on('mouseover', function(event) {
            var lineid = '#' + (event.target.id).substring(0, (event.target.id).indexOf('-display'));
            d3.select('path' + lineid).attr("stroke-width", 7);
          });
          lastDiv.on('mouseout', function(event) {
            var lineid = '#' + (event.target.id).substring(0, (event.target.id).indexOf('-display'));
            d3.select('path' + lineid).attr("stroke-width", 2);
          });
          lastDiv.on('click', function(event) {
            var lineid = (event.target.id).substring(0, (event.target.id).indexOf('-display'));
            $(this).addClass('hidden');
            d3.select('g#g-' + lineid).remove();
            d3.select('path#' + lineid).attr("stroke-width", 2);
            nameList[((event.target.id).substring(0, (event.target.id).indexOf('-display')))] = 0;
          });
      }
      i++;
    }, 100);
  });

  function lineClear() {
    d3.select("#lc-visual").select("svg").selectAll('g.line-class').remove();
      $('#line-chart-names-display').html('');
      $('#auto-line-chart-names-display').html('');
      $('.line-chart-button').removeAttr('disabled');
      nameList = {};
  }
}