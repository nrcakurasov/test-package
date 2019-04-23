import { ITooltipModel } from '../../shared/tooltip/tooltip.model';

/**
 * labelY - label
 */
export interface IVerticalBarChartModel {
  valueX: number;
  valueY: any;
  labelX: string;
  labelY: string;
  subLabelY?: string;
  tooltip?: ITooltipModel;
}