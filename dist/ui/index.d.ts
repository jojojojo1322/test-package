import * as _mui_material from '@mui/material';
import { ThemeOptions, Theme } from '@mui/material/styles';
export { ThemeOptions } from '@mui/material/styles';
import * as react_jsx_runtime from 'react/jsx-runtime';
import { PropsWithChildren, ReactNode } from 'react';
import { ButtonProps } from '@mui/material/Button';

declare const createAppTheme: (overrides?: ThemeOptions) => _mui_material.Theme;

type AppThemeProviderProps = PropsWithChildren<{
    themeOptions?: ThemeOptions | ((muiTheme: Theme) => ThemeOptions);
}>;
declare const AppThemeProvider: ({ children, themeOptions }: AppThemeProviderProps) => react_jsx_runtime.JSX.Element;

type PrimaryButtonProps = ButtonProps & {
    loading?: boolean;
    icon?: ReactNode;
};
declare const PrimaryButton: ({ loading, icon, children, disabled, ...rest }: PrimaryButtonProps) => react_jsx_runtime.JSX.Element;

export { AppThemeProvider, type AppThemeProviderProps, PrimaryButton, type PrimaryButtonProps, createAppTheme };
