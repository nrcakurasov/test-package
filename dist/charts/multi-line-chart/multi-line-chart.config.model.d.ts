import { IMultiLineChartModel, MultiLineChartTimeScale } from './multi-line-chart.model';
export interface IMultiLineChartConfigModel {
    /** id of html element */
    container: string;
    data: IMultiLineChartModel[];
    chartWidth: number;
    chartHeight: number;
    timeScale?: MultiLineChartTimeScale;
    chartId?: string;
    loading?: boolean;
}
