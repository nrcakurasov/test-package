import { IMultiLineChartConfigModel } from './multi-line-chart.config.model';
/**
 * Vertical bar chart
 *
 */
export declare class MultiLineChart {
    private readonly defaultConfig;
    private config;
    private container;
    private chartId;
    private dataInternal;
    constructor(config: IMultiLineChartConfigModel);
    private init;
    testF(): void;
    redraw(): void;
}
