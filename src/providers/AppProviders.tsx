import type { PropsWithChildren } from "react";
import { ModalProvider, type ModalProviderProps } from "../modal/ModalProvider";
import { ToastProvider, type ToastProviderProps } from "../store/ToastProvider";
import {
	AppThemeProvider,
	type AppThemeProviderProps,
} from "../ui/providers/AppThemeProvider";

export interface AppProvidersProps {
	theme?: AppThemeProviderProps;
	toast?: Omit<ToastProviderProps, "children">;
	modal?: Omit<ModalProviderProps, "children">;
}

export const AppProviders = ({
	children,
	theme,
	toast,
	modal,
}: PropsWithChildren<AppProvidersProps>) => {
	return (
		<AppThemeProvider {...theme}>
			<ToastProvider {...toast}>
				<ModalProvider {...modal}>{children}</ModalProvider>
			</ToastProvider>
		</AppThemeProvider>
	);
};
