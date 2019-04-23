import { IVerticalBarChartModel } from './vertical-bar-chart.model';
export interface IVerticalBarChartConfigModel {
  /** id of html element */
  container: string;
  data: IVerticalBarChartModel[];
  chartWidth: number;
  chartHeight: number;
  yLabelsWidth?: number;
  /** show labels */
  withYLabels?: boolean;
  chartId?: string;
  loading?: boolean;
  xDomainMin?: number;
  xDomainMax?: number;
  labelX?: string;
  
}
