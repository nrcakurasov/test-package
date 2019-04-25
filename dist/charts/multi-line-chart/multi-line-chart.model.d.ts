import { ITooltipModel } from '../../shared/tooltip/tooltip.model';
export interface IMultiLineChartModel {
    label: string;
    valueX: number;
    valueY: number;
    color?: string;
    tooltip?: ITooltipModel;
    key?: any;
    values: {};
}
export declare enum MultiLineChartTimeScale {
    Month = "Month",
    Quarter = "Quarter",
    FQJuly = "FQ (July)",
    FQSeptember = "FQ (September)",
    FQOctober = "FQ (October)",
    Biannual = "Biannual",
    Year = "Year",
    FYJuly = "FY (July)",
    FYSeptember = "FY (September)",
    FYOctober = "FY (October)"
}
