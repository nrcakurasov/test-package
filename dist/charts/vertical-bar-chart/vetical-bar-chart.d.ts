import { IVerticalBarChartConfigModel } from './vertical-bar-chart.config.model';
/**
 * Vertical bar chart
 *
 */
export declare class VerticalBarChart {
    private readonly defaultConfig;
    private config;
    private container;
    private yLabelsWidth;
    private withYLabels;
    private chartId;
    private xDomainMin;
    private xDomainMax;
    private labelX;
    private dataInternal;
    constructor(config: IVerticalBarChartConfigModel);
    private init;
    redraw(): void;
}
