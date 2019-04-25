import * as d3 from 'd3';
import { merge } from 'lodash';
import { ChartTooltip } from '../../shared/tooltip/tooltip';
import { IMultiLineChartConfigModel } from './multi-line-chart.config.model';
import { MultiLineChartTimeScale, IMultiLineChartModel } from './multi-line-chart.model';
import { ContainerElement } from 'd3';


/**
 * Vertical bar chart 
 * 
 */
export class MultiLineChart {
    private readonly defaultConfig: IMultiLineChartConfigModel = 
    {container: '',
      data: [],
      chartWidth: 960,
      chartHeight: 146,
      timeScale: MultiLineChartTimeScale.Month};

      private config: IMultiLineChartConfigModel = this.defaultConfig;
  
  private container: string;

  private chartId: string = 'multilinechart';

  private dataInternal: IMultiLineChartModel[];

  constructor(config: IMultiLineChartConfigModel) {
    this.config =  merge(this.config, config);
    this.container = this.config.container;
    this.dataInternal = config.data;
    this.init();
  }

  private init() {
    // TODO: use element offsetWidth to update actual width( resize as config option)
    window.addEventListener('resize', () => this.redraw());

    d3.selectAll(`div.zippy-chart-tooltip ${this.chartId}`).remove();
    d3.select(this.container)
        .transition().duration(100).style('opacity', this.config.loading ? '0.5' : '1');

    this.redraw();
  }


  testF(): void {

    var data = [
        {
          name: "USA",
          values: [
            {date: "2000", price: 100},
            {date: "2001", price: 110},
            {date: "2002", price: 145},
            {date: "2003", price: 241},
            {date: "2004", price: 101},
            {date: "2005", price: 90},
            {date: "2006", price: 10},
            {date: "2007", price: 35},
            {date: "2008", price: 21},
            {date: "2009", price: 201}
          ]
        },
        {
          name: "Canada",
          values: [
            {date: "2000", price: 200},
            {date: "2001", price: 120},
            {date: "2002", price: 33},
            {date: "2003", price: 21},
            {date: "2004", price: 51},
            {date: "2005", price: 190},
            {date: "2006", price: 120},
            {date: "2007", price: 85},
            {date: "2008", price: 221},
            {date: "2009", price: 101}
          ]
        }
      ];
      
      var width = 500;
      var height = 300;
      var margin = 50;
      var duration = 250;
      
      var lineOpacity = "0.25";
      var lineOpacityHover = "0.85";
      var otherLinesOpacityHover = "0.1";
      var lineStroke = "1.5px";
      var lineStrokeHover = "2.5px";
      
      var circleOpacity = '0.85';
      var circleOpacityOnLineHover = "0.25"
      var circleRadius = 3;
      var circleRadiusHover = 6;
      
      
      /* Format Data */
      var parseDate = d3.timeParse("%Y");
      data.forEach(function(d) { 
        d.values.forEach(function(d: any) {
          d.date = parseDate(d.date);
          d.price = +d.price;    
        });
      });
      
      
      /* Scale */
      var xScale = d3.scaleTime()
        .domain(<Date[]>d3.extent(data[0].values, (d: any) => d.date))
        .range([0, width-margin]);
      
      var yScale = d3.scaleLinear()
        .domain([0, d3.max(data[0].values, (d: any) => d.price)])
        .range([height-margin, 0]);
      
      var color = d3.scaleOrdinal(d3.schemeCategory10);
      
      /* Add SVG */
      var svg = d3.select("#chart").append("svg")
        .attr("width", (width+margin)+"px")
        .attr("height", (height+margin)+"px")
        .append('g')
        .attr("transform", `translate(${margin}, ${margin})`);
      
      
      /* Add line into SVG */
      var line = d3.line()
        .x((d:any) => xScale(d.date))
        .y((d:any) => yScale(d.price));
      
      let lines = svg.append('g')
        .attr('class', 'lines');
      
      lines.selectAll('.line-group')
        .data(data).enter()
        .append('g')
        .attr('class', 'line-group')  
        .on("mouseover", function(d, i: any) {
            svg.append("text")
              .attr("class", "title-text")
              .style("fill", color(i))        
              .text(d.name)
              .attr("text-anchor", "middle")
              .attr("x", (width-margin)/2)
              .attr("y", 5);
          })
        .on("mouseout", function(d) {
            svg.select(".title-text").remove();
          })
        .append('path')
        .attr('class', 'line')  
        .attr('d', (d:any) => line(d.values))
        .style('stroke', (d, i: any) => color(i))
        .style('opacity', lineOpacity)
        .on("mouseover", function(d) {
            d3.selectAll('.line')
                          .style('opacity', otherLinesOpacityHover);
            d3.selectAll('.circle')
                          .style('opacity', circleOpacityOnLineHover);
            d3.select(this)
              .style('opacity', lineOpacityHover)
              .style("stroke-width", lineStrokeHover)
              .style("cursor", "pointer");
          })
        .on("mouseout", function(d) {
            d3.selectAll(".line")
                          .style('opacity', lineOpacity);
            d3.selectAll('.circle')
                          .style('opacity', circleOpacity);
            d3.select(this)
              .style("stroke-width", lineStroke)
              .style("cursor", "none");
          });
      
      
      /* Add circles in the line */
      lines.selectAll("circle-group")
        .data(data).enter()
        .append("g")
        .style("fill", (d, i: any) => color(i))
        .selectAll("circle")
        .data(d => d.values).enter()
        .append("g")
        .attr("class", "circle")  
        .on("mouseover", function(d) {
            d3.select(this)     
              .style("cursor", "pointer")
              .append("text")
              .attr("class", "text")
              .text(`${d.price}`)
              .attr("x", (d:any) => xScale(d.date) + 5)
              .attr("y", (d:any) => yScale(d.price) - 10);
          })
        .on("mouseout", function(d) {
            d3.select(this)
              .style("cursor", "none")  
              .transition()
              .duration(duration)
              .selectAll(".text").remove();
          })
        .append("circle")
        .attr("cx", (d:any) => xScale(d.date))
        .attr("cy", (d:any) => yScale(d.price))
        .attr("r", circleRadius)
        .style('opacity', circleOpacity)
        .on("mouseover", function(d) {
              d3.select(this)
                .transition()
                .duration(duration)
                .attr("r", circleRadiusHover);
            })
          .on("mouseout", function(d) {
              d3.select(this) 
                .transition()
                .duration(duration)
                .attr("r", circleRadius);  
            });
      
      
      /* Add Axis into SVG */
      var xAxis = d3.axisBottom(xScale).ticks(5);
      var yAxis = d3.axisLeft(yScale).ticks(5);
      
      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${height-margin})`)
        .call(xAxis);
      
      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append('text')
        .attr("y", 15)
        .attr("transform", "rotate(-90)")
        .attr("fill", "#000")
        .text("Total values");    

  }


  redraw(): void {
      
    const chartId = this.chartId;
    const timeScale = this.config.timeScale;
    const defaultTooltipWidth = 60;
    const data = this.dataInternal;
    d3.select('svg#' + chartId).remove();

    if (data.length === 0) {
        return;
    }

    // Set the dimensions of the canvas / graph
    const margin = { top: 70, right: 40, bottom: 30, left: 55 },
        width = this.config.chartWidth - margin.left - margin.right,
        height = this.config.chartHeight - margin.top - margin.bottom;

    // set the ranges
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    // Define the line
    const chartLine = d3.line<IMultiLineChartModel>()
        .x((d: IMultiLineChartModel): number => x(d.valueX) )
        .y((d: IMultiLineChartModel): number => y(d.valueY));

    const tooltipContainer = d3.select('body').append('div')
        .attr('class', 'd3-multilinechart-tooltip')
        .style('opacity', 0);

    // Adds the svg canvas
    const svg = d3.select(this.container)
    .append('svg')
        .attr('id', chartId)
        .attr('style', 'font-family: \'Lucida Grande\', \'Open Sans\', sans-serif; font-size: 12px; fill: #4a4a4a;')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform',
            'translate(' + margin.left + ',' + margin.top + ')');


    // Scale the range of the data
    x.domain(<number[]>d3.extent(data, function (d: IMultiLineChartModel): number { return d.valueX; }));
    y.domain(<Date[]|number[]>d3.extent(data, function (d: IMultiLineChartModel): any { return d.valueY; })).nice(5);
    // Nest the entries by symbol
    const dataNest = d3.nest()
        .key((d: any)=> d.label)
        .entries(data);

    // set the colour scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Add the X Axis with grid
    svg.append('g')
        .attr('style', 'fill: #4a4a4a;')
        .attr('class', 'axis grid')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x).tickSizeOuter(0).tickSize(-height).tickPadding(10)
        .tickValues(getXAxisTickValues())
        .tickFormat(tickFormat));

    // Add the Y Axis  with grid
    // do it twice as a trick to get proper grid
    svg.append('g')
        .attr('style', 'fill: #4a4a4a;')
        .attr('class', 'axis grid')
        .call(d3.axisLeft(y).tickSize(30).tickFormat(() => ''));
    svg.append('g')
        .attr('style', 'fill: #4a4a4a;')
        .attr('class', 'axis grid')
        .call(d3.axisLeft(y).tickPadding(32).tickSize(-width - 30));

    // add styles
    svg.selectAll('.grid .domain').attr('style', 'display: none');
    svg.selectAll('.grid .tick').attr('style', 'font-family: \'Lucida Grande\', \'Open Sans\', sans-serif;font-size: 12px;');
    svg.selectAll('.grid .tick line').attr('style', 'stroke: #eee;');


    // Loop through nest
    let legendOffsetX =  -30;
    let legendOffsetY = -10;
    let legendLineNumber = 1;
    dataNest.forEach(function (nest: any, index: number): any {
        const pathId = nest.key.replace(/[^a-zA-Z0-9]+/g, '');

        // Add the scatterplot, by default invisible
        const dotsX: number[] = [];
        const dots = svg.selectAll('dot')
            .data(nest.values)
            .enter()
            .append('circle')
            .attr('r', 3)
            .style('opacity', nest.values.length === 1 ? '1' : '0')
            .style('fill', getColor(nest))
            .attr('cx', function(dot: any): number {
                dotsX.push(x(dot.valueX)); // save X coordinates for furher mousemove calc
                return x(dot.valueX);
            })
            .attr('cy', function(dot: any): number { return y(dot.valueY); })
            .on('mouseover', function (dot: any): void {
                showTooltip(dot);
                d3.select(this)
                .style('opacity', '1');
            })
            .on('mouseout', function (): void {
                d3.select(this).style('opacity', nest.values.length === 1 ? '1' : '0');
                tooltipContainer.style('opacity', 0);
            });

        // add transparent path for mouse event
        svg.append('path')
        .attr('d', () => chartLine(nest.values))
        .style('stroke-width', '15')
        .style('fill', 'none')
        .style('stroke', 'steelblue')
        .style('opacity', 0)
        .on('mousemove', function (): void {

            // show nearest dot on chart with relative tooltip
            const mouseX = d3.mouse(<ContainerElement>svg.node())[0];
            let c = 1e10;
            let idx = -1;
            dotsX.forEach(function(dotX: any, dotIndex: number): void {
                const dis = Math.abs(dotX - mouseX);
                if (dis < c) {
                    c = dis;
                    idx = dotIndex;
                }
            });

            dots.nodes().forEach((value: any, index: number): void => {
                const opacity = index === idx ? 1 : 0;
                d3.select(value).style('opacity', opacity);
            } );


            showTooltip(nest.values[idx]);

          })
        .on('mouseout', function(): void {
            // hide all dots
            dots.style('opacity', 0);
            // hide tooltip
            tooltipContainer.style('opacity', 0);
          });


        // visual lines
          svg.append('path')
            .attr('class', 'visible-line')
            .style('stroke-width', 2)
            .style('fill', 'none')
            .style('stroke', function (): any { // Add the colours dynamically
                return nest.color = getColor(nest);
            })
            .attr('id', 'tag' + pathId) // assign an ID
            .attr('d', () => chartLine(nest.values));

            const maxY = d3.max(nest.values, function (chartNode: IMultiLineChartModel): any { return chartNode.valueY; });
            const minY = d3.min(nest.values, function (chartNode: IMultiLineChartModel): any { return chartNode.valueY; });

            svg.append('g').selectAll('text')
            .data(nest.values.filter((value: any): boolean => value.valueY === maxY || value.valueY === minY ))
            .enter()
            .append('text')
            .style('font-family', '\'Lucida Grande\', \'Open Sans\', sans-serif')
            .style('font-size', '12px')
            .style('fill', '#4a4a4a')
            .attr('class', 'max-min')
            .attr('id', 'tag' + pathId)
            .attr('x', function (value: any): any { return x(value.valueX) - value.valueY.toFixed(1).length / 2 * 5; } )
            .attr('y', function (value: any): any { return y(value.valueY) + (maxY === value.valueY ? -2 : 12); } )
            .text(function (value: any): any { return value.valueY.toFixed(1); } );

        if (legendLineNumber <= 3) {
            // Add the Legend
            const legendText = '● ' + nest.values[0].lineLabel;
            svg.append('text')
                .attr('x', legendOffsetX)  // space legend
                .attr('y', -(margin.top / 2) + legendOffsetY)
                .attr('class', 'legend legendOffset' + legendOffsetY)    // style the legend
                .style('font-family', '\'Lucida Grande\', \'Open Sans\', sans-serif')
                .style('font-size', '12px')
                .style('font-weight', 'bold')
                .style('cursor', 'pointer')
                .style('fill', '#4a4a4a')
                .style('fill', function (): string { // Add the colours dynamically
                    return nest.color = getColor(nest);
                })
                .on('mouseover', function (): void {
                    d3.select(this).style('text-decoration', 'underline');
                    d3.selectAll('path.visible-line,text.max-min')
                        .filter(':not(#tag' + pathId + ')')
                        .style('opacity', 0.3);

                })
                .on('mouseout', function (): void {
                    d3.select(this).style('text-decoration', 'none');
                    d3.selectAll('path.visible-line,text.max-min')
                    .style('opacity', 1);
                })
                .text(legendText);

            // get offset for next legend text // TODO: move to function
            const legendNodes = d3.selectAll('text.legend.legendOffset' + legendOffsetY).nodes();
            const currentLegendLength = legendNodes.reduce((a: any, v: any): any => {
                return a + v.getComputedTextLength()  + 10;
            }, null);
            legendOffsetX = currentLegendLength - 30;
            if ((width - legendOffsetX) < 100) {
                legendLineNumber++;
                legendOffsetY += 20;
                legendOffsetX = -30;
            }
            if (legendLineNumber > 3 && dataNest[index + 1]) {
                d3.select(legendNodes[legendNodes.length - 1])
                .style('fill', '#4a4a4a')
                .style('cursor', 'default')
                .on('mouseover', function (): void {})
                .on('mouseout', function (): void {})
                .text('...');
            }
    }

    });

    function getColor(d: any): string {
        return d.values[0].color ? d.values[0].color : color(d.key);
    }

    function showTooltip(item: any): void {
        const tooltipWidht = item.tooltip.width ? item.tooltip.width : defaultTooltipWidth;
        const screenWidht = d3.event.view.innerWidth;
        const position = d3.event.pageX;
        let left = position;

        if ((position + tooltipWidht) > screenWidht) {
          left = screenWidht - tooltipWidht;
        }

        tooltipContainer.html(item.tooltip.html.replace(/{period_scale}/g, tickFormat(item.valueX)))
        .style('left', left + 'px')
        .style('opacity', 1)
        .style('top', (d3.event.pageY + 5) + 'px'); // TODO: calculate top in the same way as left

    }

    // get axis values according to first and last date in data
    // truncate long set of values to make it readable on chart
    function getXAxisTickValues(): any {
        let timeScaleIncrement = 1;
        switch (timeScale) {
            case 'Month':
                timeScaleIncrement = 1;
            break;
            case 'Quarter':
            case 'FQ (July)':
            case 'FQ (September)':
            case'FQ (October)':
            timeScaleIncrement = 3;
            break;
            case 'Biannual':
            timeScaleIncrement = 6;
            break;
            case 'Year':
            case 'FY (July)':
            case 'FY (September)':
            case 'FY (October)':
            timeScaleIncrement = 12;
            break;
        }

        const allValues = [];
        const truncValues = [];
        const dateRange = d3.extent(data, function (d: IMultiLineChartModel): any { return d.valueX; });
        const currDate = new Date(dateRange[0].getTime());
        while (currDate <= dateRange[1]) {
            allValues.push(new Date(currDate.getTime()));
            currDate.setMonth(currDate.getMonth() + timeScaleIncrement);
        }

        const maxVal = 16;
        if (allValues.length >= maxVal) {
            const delta = Math.floor( allValues.length / maxVal );
            console.log(allValues.length, delta);
            for (let i = allValues.length - 1; i > 0; i = i  - 1 - delta) {
               if (allValues[i]) {
                truncValues.unshift(allValues[i]);
               }
            }
            return truncValues;
        }
        return allValues;
    }

    function tickFormat(date: any): any {

        let ret: string;
        const currentMonth = date.getMonth() + 1;
        switch (timeScale) {
            case 'Month':
                ret = d3.timeFormat('%b %Y')(date);
            break;
            case 'Quarter':
                const quarter = (Math.ceil((date.getMonth() + 1) / 3));
                ret = 'Q' + quarter + d3.timeFormat(' %Y')(date);
            break;
            case 'FQ (July)':
                let fqjQuarter = 2;
                if (currentMonth < 4) {
                    fqjQuarter = 3;
                } else if (currentMonth < 7) {
                    fqjQuarter = 4;
                } else if (currentMonth < 10) {
                    fqjQuarter = 1;
                }
                ret = 'Q' + fqjQuarter + ' ' +  (date.getFullYear() + ((fqjQuarter === 1 || fqjQuarter === 2) ? 1 : 0));
            break;
            case 'FQ (September)':
                let fqsQuarter = 1;
                if (currentMonth < 3 || currentMonth > 11) {
                    fqsQuarter = 2;
                } else if (currentMonth < 6) {
                    fqsQuarter = 3;
                } else if (currentMonth < 9) {
                    fqsQuarter = 4;
                }
            ret = 'Q' + fqsQuarter + ' ' +  (date.getFullYear() + ((fqsQuarter === 1 || fqsQuarter === 2) ? 1 : 0));
            break;
            case 'FQ (October)':
                let fqoQuarter = 1;
                if (currentMonth < 4 ) {
                    fqoQuarter = 2;
                } else if (currentMonth < 7) {
                    fqoQuarter = 3;
                } else if (currentMonth < 10) {
                    fqoQuarter = 4;
                }
                ret = 'Q' + fqoQuarter + ' ' +  (date.getFullYear() + ((fqoQuarter === 1) ? 1 : 0));
                break;
            case 'Biannual':
                const intDate = new Date(date.getTime());
                ret = d3.timeFormat('%b')(intDate) +
                      d3.timeFormat('-%b')(new Date( intDate.setMonth(intDate.getMonth() + 5)))
                         + ' '  + d3.timeFormat(' %Y')(intDate);
            break;
            case 'Year':
                ret = d3.timeFormat('%Y')(date);
            break;
            case 'FY (July)':
                ret = (date.getFullYear() + ((currentMonth > 6) ? 1 : 0)).toString();
            break;
            case 'FY (September)':
            ret = (date.getFullYear() + ((currentMonth > 8) ? 1 : 0)).toString();
            break;
            case 'FY (October)':
            ret = (date.getFullYear() + ((currentMonth > 9) ? 1 : 0)).toString();
            break;
            default:
                ret = d3.timeFormat('%b %d')(date);
            break;
        }
        return ret;
    }
}

}
