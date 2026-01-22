'use strict';

var react = require('react');
var Timeline = require('react-calendar-timeline');
var dayjs = require('dayjs');
var jsxRuntime = require('react/jsx-runtime');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var Timeline__default = /*#__PURE__*/_interopDefault(Timeline);
var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

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
  const timeStart = react.useMemo(
    () => defaultTimeStart?.getTime() ?? dayjs__default.default().startOf("day").valueOf(),
    [defaultTimeStart]
  );
  const timeEnd = react.useMemo(
    () => defaultTimeEnd?.getTime() ?? dayjs__default.default().endOf("day").valueOf(),
    [defaultTimeEnd]
  );
  const handleItemClick = react.useCallback(
    (itemId, e, time) => {
      onItemClick?.(itemId, e, time);
    },
    [onItemClick]
  );
  const handleItemMove = react.useCallback(
    (itemId, dragTime, newGroupOrder) => {
      onItemMove?.(itemId, dragTime, newGroupOrder);
    },
    [onItemMove]
  );
  const handleItemResize = react.useCallback(
    (itemId, time, edge) => {
      onItemResize?.(itemId, time, edge);
    },
    [onItemResize]
  );
  const handleCanvasClick = react.useCallback(
    (groupId, time, e) => {
      onCanvasClick?.(groupId, time, e);
    },
    [onCanvasClick]
  );
  const containerStyle = {
    height: typeof height === "number" ? `${height}px` : height,
    ...style
  };
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className, style: containerStyle, children: /* @__PURE__ */ jsxRuntime.jsx(
    Timeline__default.default,
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
      children: showHeader && /* @__PURE__ */ jsxRuntime.jsxs(Timeline.TimelineHeaders, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(Timeline.SidebarHeader, { children: ({ getRootProps }) => /* @__PURE__ */ jsxRuntime.jsx("div", { ...getRootProps(), children: headerLabel }) }),
        /* @__PURE__ */ jsxRuntime.jsx(Timeline.DateHeader, { unit: "primaryHeader" }),
        /* @__PURE__ */ jsxRuntime.jsx(Timeline.DateHeader, {})
      ] })
    }
  ) });
};

exports.TimelineWrapper = TimelineWrapper;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map