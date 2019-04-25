import * as d3 from 'd3';
import { merge } from 'lodash';
import { IVerticalBarChartModel } from './vertical-bar-chart.model';
import { IVerticalBarChartConfigModel } from './vertical-bar-chart.config.model';
import { ChartTooltip } from '../../shared/tooltip/tooltip';


/**
 * Vertical bar chart 
 * 
 */
export class VerticalBarChart {
    private readonly defaultConfig: IVerticalBarChartConfigModel = 
    {container: '',
      data: [],
      chartWidth: 960,
      chartHeight: 146,
      loading: false};

      private config: IVerticalBarChartConfigModel = this.defaultConfig;
  
  private container: string;

  private yLabelsWidth: number = 230;
  private withYLabels: boolean = true;
  private chartId: string = 'verticalbarchart';
  private xDomainMin: number = 0;
  private xDomainMax: number = 0;

  private  labelX: string = '';
  private dataInternal: IVerticalBarChartModel[];

  constructor(config: IVerticalBarChartConfigModel) {
    

    this.config =  merge(this.config, config);
    console.log(this.config);

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

  redraw(): void {
    const chartId = this.chartId;
    const data = this.dataInternal;
    d3.selectAll(`svg#${chartId}`).remove();
    const chartWidth = this.config.chartWidth || this.defaultConfig.chartWidth;
    const chartHeight = this.config.chartHeight;
    const defaultMarginLeft = 20;
    const marginLeft =  this.withYLabels
                        ? this.yLabelsWidth + defaultMarginLeft : defaultMarginLeft;
    // set the dimensions and margins of the graph
    const margin = { top: 30, right: 0, bottom: 30, left: marginLeft };

    const width = Math.floor(chartWidth - defaultMarginLeft - margin.right);
    const height = chartHeight - margin.top - margin.bottom;

    const tooltip: ChartTooltip = new ChartTooltip(chartId);
   // const div = tooltip.selector;
    // const div = d3.select('body').append('div')
    // .attr('class', `zippy-chart-tooltip ${chartId}`) // TODO: implement dynamic class if needs
    // .style('opacity', 0);

    // set the ranges
    // "shift" MI-2011 - Move all score values out of the bar
    const maxValue = d3.max(data, (d: IVerticalBarChartModel): number => d.valueX);
    const barShift  = maxValue ? maxValue.toFixed(1).length * 9 : 0;
    const x = d3.scaleLinear().range([0, width - barShift]);
    const y = d3.scaleBand().range([height, 0]);

    const svg = d3
      .select(this.container)
      .attr('class', 'zippy-chart')
      .append('svg')
      .attr('class', 'vertical-bar-chart') // TODO: define color scheme like default, dark, blue etc.
      .attr('id', chartId)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scale the range of the data in the domains
    const xDomainMin = this.xDomainMin !== null ? this.xDomainMin : 0;
    const xDomainMax = this.xDomainMax !== 0 ? this.xDomainMax : d3.max(data, (d: IVerticalBarChartModel): number => 
                     { return d.valueX; }) || 0;
    x.domain([xDomainMin, xDomainMax]);
    y.domain(data.map((d: IVerticalBarChartModel): string => {
      return d.valueY;
    }));

    // background bar
    svg.selectAll(null)
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'rect-background')
    // tslint:disable-next-line:no-unused
    .attr('fill', (d: IVerticalBarChartModel, i: number): string =>
     { return ((i + 1) % 2 === 1) ? '#faf9f7' : '#fff'; })
    .attr('y', (d: IVerticalBarChartModel): number => {
      return y(d.valueY) || 0;
    })
    .attr('x', -(margin.left))
    .attr('height', y.bandwidth())
    .attr('width', chartWidth + margin.left);

    // Y Axis labels conditionally
    if (this.withYLabels) {
      svg.selectAll(null)
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('dy', (d: IVerticalBarChartModel): number => {
        return d.subLabelY ? -2 : 5;
      })
      .attr('y', (d: IVerticalBarChartModel): number => {
        return (y(d.valueY) || 0) + y.bandwidth() / 2;
      })
      .attr('x', -5)
      .attr('text-anchor', 'end')
      .text((d: IVerticalBarChartModel): string => {
        return d.labelY;
      })
      .each((d, i, v): void => { wrap(v[i], marginLeft - 5); });

      // Sub Label
      svg.selectAll(null)
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'sub-label')
      .attr('dy', 10)
      .attr('y', (d: IVerticalBarChartModel): number => {
        return (y(d.valueY) || 0) + y.bandwidth() / 2;
      })
      .attr('x', -5)
      .attr('text-anchor', 'end')
      .text((d: IVerticalBarChartModel): string => {
        return d.subLabelY || '';

      })
      .each((d, i, v): void => { wrap(v[i], marginLeft - 5); });
    }

    // bars
    svg
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('style', 'fill: #00a3e0;')
      .attr('x', 0)
      .attr('width', (d: IVerticalBarChartModel): number => {
        let barwidth = x(d.valueX) > 2 ? x(d.valueX) : 2 - x(d.valueX) / 2 ;
        if (d.valueX.toFixed(1) === '0.0') {
          barwidth = 0;
        }
        return barwidth;
      })
      .attr('y', (d: IVerticalBarChartModel): number => {
        return (y(d.valueY) || 0) + 3;
      })
      .attr('height', y.bandwidth() - 6)
      .on('mousemove', (d: IVerticalBarChartModel): void => {
        tooltip.show(d.tooltip);
      })
      .on('mouseout', (): void => {
        tooltip.hide();
      });

    // bar  text values
    svg.selectAll(null)
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('y', (d: IVerticalBarChartModel): number => {
        return (y(d.valueY) || 0) + y.bandwidth() / 2;
      })
      .attr('x', 5)
      .attr('dy', 5)
      .text((d: IVerticalBarChartModel): any => {
        return (d.valueX && d.valueX.toFixed(1) !== '0.0') ? d.valueX.toFixed(1) : '';
      })
      .attr('x', (d: IVerticalBarChartModel, i, v): number => {
        const textLength = v[i].getComputedTextLength();
        const defaultPosition = x(d.valueX);
        return defaultPosition < (width - textLength)
                      ? defaultPosition + 5
                      : defaultPosition - textLength - 5;
      });

    addSplitLines();

    // add label on the top of chart
    svg
      .append('text')
      .attr('class', 'label')
      .attr('text-anchor', 'start')
      .attr('transform', `translate(${((width > 300) ? (width / 2) : 0)},${(height - data.length * 32)})`)
      .text(data[0].labelX || 'Unknown')
      .each((d, i, v): void => { wrap(v[i], width); })
      .on('mousemove', (): void => {
        tooltip.show({ html: data[0].labelX });
      })
      .on('mouseout', (): void => {
        tooltip.hide();
      });

    function addSplitLines(): void {
      // first split line
      svg.append('line')
      .attr('x1', -margin.left)
      .attr('y1', 0)
      .attr('x2',  chartWidth + margin.left )
      .attr('y2', 0)
      .attr('stroke-width', '1px')
      .attr('stroke', '#d7d7d7')
      .attr('shape-rendering', 'crispEdges');

      // split lines
      svg.selectAll(null)
      .data(data)
      .enter()
      .append('line')
      .attr('x1', -margin.left)
      .attr('y1', (d: IVerticalBarChartModel): number => {
        return (y(d.valueY) || 0) + y.bandwidth();
      })
      .attr('x2', chartWidth + margin.left)
      .attr('y2', (d: IVerticalBarChartModel): number => {
        return (y(d.valueY) || 0) + y.bandwidth();
      })
        .attr('stroke-width', '1px')
      .attr('stroke', '#d7d7d7')
      .attr('shape-rendering', 'crispEdges');
    }

    function wrap(textObj: SVGTextElement, maxWidth: number): void {
      const self = d3.select(textObj);
      const selfNode = self.node();
      if (selfNode) {
        let textLength = selfNode.getComputedTextLength();
        let text = self.text();
        while (textLength > (maxWidth) && text.length > 0) {
          text = text.slice(0, -1);
          self.text(`${text}...`);
          textLength = selfNode.getComputedTextLength();
        }
      }
    }
  }

}
