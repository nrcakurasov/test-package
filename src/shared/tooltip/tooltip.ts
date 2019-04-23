import * as d3 from 'd3';
import { ITooltipModel } from './tooltip.model';

export class ChartTooltip {
  private selector: any;
  private defaultTooltipWidth = 60;

  constructor(chartId: string) {
    this.selector = d3
      .select('body')
      .append('div')
      .attr('class', `zippy-chart-tooltip ${chartId}`) // TODO: implement dynamic class if needs
      .style('opacity', 0);
  }

  public show(tooltip: ITooltipModel | undefined) {
    const tooltipWidht =
      tooltip && tooltip.width ? tooltip.width : this.defaultTooltipWidth;
    const screenWidht = d3.event.view.innerWidth;
    const position = d3.event.pageX;
    let left = position;

    if (position + tooltipWidht > screenWidht) {
      left = screenWidht - tooltipWidht;
    }

    this.selector
      .transition()
      .duration(100)
      .style('opacity', 1);
    this.selector
      .html(tooltip ? tooltip.html : '')
      .style('left', `${left}px`)
      .style('top', `${d3.event.pageY + 5}px`); // TODO: calculate top in the same way as left
  }

  public hide() {
    this.selector
      .transition()
      .duration(500)
      .style('opacity', 0);
  }
}
