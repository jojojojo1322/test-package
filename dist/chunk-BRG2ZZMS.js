import { useMemo, useCallback } from 'react';
import Timeline, { TimelineHeaders, SidebarHeader, DateHeader } from 'react-calendar-timeline';
import dayjs from 'dayjs';
import { jsx, jsxs } from 'react/jsx-runtime';

// src/timeline/TimelineWrapper.tsx
var TimelineWrapper = ({
  groups,
  items,
  defaultTimeStart,
  defaultTimeEnd,
  height = 400,
  style,
  className,
  sidebarWidth = 150,
  showHeader = true,
  headerLabel = "\uADF8\uB8F9",
  onItemClick,
  onItemMove,
  onItemResize,
  onCanvasClick
}) => {
  const timeStart = useMemo(
    () => defaultTimeStart?.getTime() ?? dayjs().startOf("day").valueOf(),
    [defaultTimeStart]
  );
  const timeEnd = useMemo(
    () => defaultTimeEnd?.getTime() ?? dayjs().endOf("day").valueOf(),
    [defaultTimeEnd]
  );
  const handleItemClick = useCallback(
    (itemId, e, time) => {
      onItemClick?.(itemId, e, time);
    },
    [onItemClick]
  );
  const handleItemMove = useCallback(
    (itemId, dragTime, newGroupOrder) => {
      onItemMove?.(itemId, dragTime, newGroupOrder);
    },
    [onItemMove]
  );
  const handleItemResize = useCallback(
    (itemId, time, edge) => {
      onItemResize?.(itemId, time, edge);
    },
    [onItemResize]
  );
  const handleCanvasClick = useCallback(
    (groupId, time, e) => {
      onCanvasClick?.(groupId, time, e);
    },
    [onCanvasClick]
  );
  const containerStyle = {
    height: typeof height === "number" ? `${height}px` : height,
    ...style
  };
  return /* @__PURE__ */ jsx("div", { className, style: containerStyle, children: /* @__PURE__ */ jsx(
    Timeline,
    {
      groups,
      items,
      defaultTimeStart: timeStart,
      defaultTimeEnd: timeEnd,
      sidebarWidth,
      onItemClick: onItemClick ? handleItemClick : void 0,
      onItemMove: onItemMove ? handleItemMove : void 0,
      onItemResize: onItemResize ? handleItemResize : void 0,
      onCanvasClick: onCanvasClick ? handleCanvasClick : void 0,
      children: showHeader && /* @__PURE__ */ jsxs(TimelineHeaders, { children: [
        /* @__PURE__ */ jsx(SidebarHeader, { children: ({ getRootProps }) => /* @__PURE__ */ jsx("div", { ...getRootProps(), children: headerLabel }) }),
        /* @__PURE__ */ jsx(DateHeader, { unit: "primaryHeader" }),
        /* @__PURE__ */ jsx(DateHeader, {})
      ] })
    }
  ) });
};

export { TimelineWrapper };
//# sourceMappingURL=chunk-BRG2ZZMS.js.map
//# sourceMappingURL=chunk-BRG2ZZMS.js.map