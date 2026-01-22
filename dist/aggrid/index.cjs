'use strict';

var react = require('react');
var agGridReact = require('ag-grid-react');
var agGridCommunity = require('ag-grid-community');
var agGridEnterprise = require('ag-grid-enterprise');
var jsxRuntime = require('react/jsx-runtime');

// src/aggrid/AgGridWrapper.tsx
var modulesRegistered = false;
var registerModules = (licenseKey) => {
  if (modulesRegistered) return;
  if (licenseKey) {
    agGridEnterprise.LicenseManager.setLicenseKey(licenseKey);
    agGridCommunity.ModuleRegistry.registerModules([agGridEnterprise.AllEnterpriseModule]);
  } else {
    agGridCommunity.ModuleRegistry.registerModules([agGridCommunity.AllCommunityModule]);
  }
  modulesRegistered = true;
};
function AgGridWrapperInner({
  rowData,
  columnDefs,
  licenseKey,
  height = 400,
  width = "100%",
  className,
  style,
  theme = "quartz",
  darkMode = false,
  onGridApiReady,
  onGridReady,
  defaultColDef,
  ...rest
}, ref) {
  const gridRef = react.useRef(null);
  react.useMemo(() => {
    registerModules(licenseKey);
  }, [licenseKey]);
  react.useImperativeHandle(ref, () => ({
    getApi: () => gridRef.current?.api
  }));
  const mergedDefaultColDef = react.useMemo(
    () => ({
      flex: 1,
      minWidth: 100,
      resizable: true,
      sortable: true,
      filter: true,
      ...defaultColDef
    }),
    [defaultColDef]
  );
  const handleGridReady = react.useCallback(
    (event) => {
      onGridApiReady?.(event.api);
      onGridReady?.(event);
    },
    [onGridApiReady, onGridReady]
  );
  const themeClass = darkMode ? `ag-theme-${theme}-dark` : `ag-theme-${theme}`;
  const containerStyle = {
    height: typeof height === "number" ? `${height}px` : height,
    width: typeof width === "number" ? `${width}px` : width,
    ...style
  };
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: `${themeClass} ${className ?? ""}`, style: containerStyle, children: /* @__PURE__ */ jsxRuntime.jsx(
    agGridReact.AgGridReact,
    {
      ref: gridRef,
      rowData,
      columnDefs,
      defaultColDef: mergedDefaultColDef,
      onGridReady: handleGridReady,
      animateRows: true,
      ...rest
    }
  ) });
}
var AgGridWrapper = react.forwardRef(AgGridWrapperInner);

exports.AgGridWrapper = AgGridWrapper;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map