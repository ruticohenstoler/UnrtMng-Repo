import { ThemeOptions } from '@mui/material';


export const ThemeOption = {
	palette: {
		primary: {
			main: '#1E285A',
			light: '#256AF4',
			dark: '#263373',
			// contrastText: will be calculated to contrast with palette.primary.main
		},
		secondary: {
			main: '#5D3BFF',
			light: '#1570EF',
			// dark: will be calculated from palette.secondary.main,
		},
		error: {
			main: '#d32f2f',
			light: '#FFCCD5',
		},
		success: {
			main: '#2e7d32',
			light: '#D1FADF',
		},
		info: {
			main: '#256AF4',
			light: '#f5f8ff',
		},
	},
}
