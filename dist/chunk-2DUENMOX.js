import { forwardRef, useRef, useMemo, useImperativeHandle, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { LicenseManager, AllEnterpriseModule } from 'ag-grid-enterprise';
import { jsx } from 'react/jsx-runtime';

// src/aggrid/AgGridWrapper.tsx
var modulesRegistered = false;
var registerModules = (licenseKey) => {
  if (modulesRegistered) return;
  if (licenseKey) {
    LicenseManager.setLicenseKey(licenseKey);
    ModuleRegistry.registerModules([AllEnterpriseModule]);
  } else {
    ModuleRegistry.registerModules([AllCommunityModule]);
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
  const gridRef = useRef(null);
  useMemo(() => {
    registerModules(licenseKey);
  }, [licenseKey]);
  useImperativeHandle(ref, () => ({
    getApi: () => gridRef.current?.api
  }));
  const mergedDefaultColDef = useMemo(
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
  const handleGridReady = useCallback(
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
  return /* @__PURE__ */ jsx("div", { className: `${themeClass} ${className ?? ""}`, style: containerStyle, children: /* @__PURE__ */ jsx(
    AgGridReact,
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
var AgGridWrapper = forwardRef(AgGridWrapperInner);

export { AgGridWrapper };
//# sourceMappingURL=chunk-2DUENMOX.js.map
//# sourceMappingURL=chunk-2DUENMOX.js.map