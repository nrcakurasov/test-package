import { ITooltipModel } from './tooltip.model';
export declare class ChartTooltip {
    private selector;
    private defaultTooltipWidth;
    constructor(chartId: string);
    show(tooltip: ITooltipModel | undefined): void;
    hide(): void;
}
