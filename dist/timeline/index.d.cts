import { ReactNode, CSSProperties, ReactElement } from 'react';
import { TimelineGroupBase, TimelineItemBase } from 'react-calendar-timeline';

interface TimelineGroup extends TimelineGroupBase {
    id: string | number;
    title: ReactNode;
    rightTitle?: ReactNode;
    stackItems?: boolean;
    height?: number;
}
interface TimelineItem extends TimelineItemBase<number> {
    id: string | number;
    group: string | number;
    title: ReactNode;
    start_time: number;
    end_time: number;
    canMove?: boolean;
    canResize?: boolean | "left" | "right" | "both";
    canChangeGroup?: boolean;
    className?: string;
    style?: CSSProperties;
}
interface TimelineWrapperProps {
    groups: TimelineGroup[];
    items: TimelineItem[];
    defaultTimeStart?: Date;
    defaultTimeEnd?: Date;
    height?: number | string;
    style?: CSSProperties;
    className?: string;
    sidebarWidth?: number;
    showHeader?: boolean;
    headerLabel?: ReactNode;
    onItemClick?: (itemId: string | number, e: React.SyntheticEvent, time: number) => void;
    onItemMove?: (itemId: string | number, dragTime: number, newGroupOrder: number) => void;
    onItemResize?: (itemId: string | number, time: number, edge: "left" | "right") => void;
    onCanvasClick?: (groupId: string | number, time: number, e: React.SyntheticEvent) => void;
}
declare const TimelineWrapper: ({ groups, items, defaultTimeStart, defaultTimeEnd, height, style, className, sidebarWidth, showHeader, headerLabel, onItemClick, onItemMove, onItemResize, onCanvasClick, }: TimelineWrapperProps) => ReactElement;

export { type TimelineGroup, type TimelineItem, TimelineWrapper, type TimelineWrapperProps };
