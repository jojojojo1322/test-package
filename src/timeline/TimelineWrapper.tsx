import dayjs from "dayjs";
import type { CSSProperties, ReactElement, ReactNode } from "react";
import { useCallback, useMemo } from "react";
import Timeline, {
	DateHeader,
	SidebarHeader,
	type TimelineGroupBase,
	TimelineHeaders,
	type TimelineItemBase,
} from "react-calendar-timeline";

// CSS는 앱에서 import 해야함
// import "react-calendar-timeline/dist/style.css";

export interface TimelineGroup extends TimelineGroupBase {
	id: string | number;
	title: ReactNode;
	rightTitle?: ReactNode;
	stackItems?: boolean;
	height?: number;
}

export interface TimelineItem extends TimelineItemBase<number> {
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

export interface TimelineWrapperProps {
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
	onItemClick?: (
		itemId: string | number,
		e: React.SyntheticEvent,
		time: number,
	) => void;
	onItemMove?: (
		itemId: string | number,
		dragTime: number,
		newGroupOrder: number,
	) => void;
	onItemResize?: (
		itemId: string | number,
		time: number,
		edge: "left" | "right",
	) => void;
	onCanvasClick?: (
		groupId: string | number,
		time: number,
		e: React.SyntheticEvent,
	) => void;
}

export const TimelineWrapper = ({
	groups,
	items,
	defaultTimeStart,
	defaultTimeEnd,
	height = 400,
	style,
	className,
	sidebarWidth = 150,
	showHeader = true,
	headerLabel = "그룹",
	onItemClick,
	onItemMove,
	onItemResize,
	onCanvasClick,
}: TimelineWrapperProps): ReactElement => {
	const timeStart = useMemo(
		() => defaultTimeStart?.getTime() ?? dayjs().startOf("day").valueOf(),
		[defaultTimeStart],
	);

	const timeEnd = useMemo(
		() => defaultTimeEnd?.getTime() ?? dayjs().endOf("day").valueOf(),
		[defaultTimeEnd],
	);

	const handleItemClick = useCallback(
		(itemId: number, e: React.SyntheticEvent, time: number) => {
			onItemClick?.(itemId, e, time);
		},
		[onItemClick],
	);

	const handleItemMove = useCallback(
		(itemId: number, dragTime: number, newGroupOrder: number) => {
			onItemMove?.(itemId, dragTime, newGroupOrder);
		},
		[onItemMove],
	);

	const handleItemResize = useCallback(
		(itemId: number, time: number, edge: "left" | "right") => {
			onItemResize?.(itemId, time, edge);
		},
		[onItemResize],
	);

	const handleCanvasClick = useCallback(
		(groupId: number, time: number, e: React.SyntheticEvent) => {
			onCanvasClick?.(groupId, time, e);
		},
		[onCanvasClick],
	);

	const containerStyle: CSSProperties = {
		height: typeof height === "number" ? `${height}px` : height,
		...style,
	};

	return (
		<div className={className} style={containerStyle}>
			<Timeline
				groups={groups}
				items={items}
				defaultTimeStart={timeStart}
				defaultTimeEnd={timeEnd}
				sidebarWidth={sidebarWidth}
				onItemClick={onItemClick ? handleItemClick : undefined}
				onItemMove={onItemMove ? handleItemMove : undefined}
				onItemResize={onItemResize ? handleItemResize : undefined}
				onCanvasClick={onCanvasClick ? handleCanvasClick : undefined}
			>
				{showHeader && (
					<TimelineHeaders>
						<SidebarHeader>
							{({ getRootProps }) => (
								<div {...getRootProps()}>{headerLabel}</div>
							)}
						</SidebarHeader>
						<DateHeader unit="primaryHeader" />
						<DateHeader />
					</TimelineHeaders>
				)}
			</Timeline>
		</div>
	);
};
