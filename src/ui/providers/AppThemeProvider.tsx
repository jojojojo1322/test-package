import { CssBaseline, GlobalStyles } from "@mui/material";
import { ThemeProvider, type ThemeOptions, type Theme } from "@mui/material/styles";
import { PropsWithChildren, useMemo } from "react";
import { createAppTheme } from "../theme";

export type AppThemeProviderProps = PropsWithChildren<{
  themeOptions?: ThemeOptions | ((muiTheme: Theme) => ThemeOptions);
}>;

export const AppThemeProvider = ({ children, themeOptions }: AppThemeProviderProps) => {
  const theme = useMemo(() => {
    if (typeof themeOptions === "function") {
      const base = createAppTheme();
      return createAppTheme(themeOptions(base));
    }
    return createAppTheme(themeOptions);
  }, [themeOptions]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: { backgroundColor: theme.palette.background.default },
          "*": { boxSizing: "border-box" },
        }}
      />
      {children}
    </ThemeProvider>
  );
};
