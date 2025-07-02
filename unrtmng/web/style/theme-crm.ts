import {  ThemeOption } from './CommonThemeModel.tsx';
import { createTheme } from '@mui/material';
import '../fonts/css/fonts.css';

const theme = ThemeOption;
const muiTheme = createTheme(theme, {});

const fontSize = 10; // px
// Tell Material-UI what's the font-size on the html element.
// 16px is the default font-size used by browsers.
const htmlFontSize = 10;
const coef = fontSize / 10;

const ThemeCrm = {
	...muiTheme,
	direction: 'rtl',
	typography: {
		pxToRem: size => `${(size / htmlFontSize) * coef}rem`,
		fontFamily: 'Rubik, Arial, sans-serif',
		h1: {fontSize: '4.8rem', fontWeight: 'bold'},
		h2: {fontSize: '3.6rem', fontWeight: 'bold'},
		h3: {fontSize: '3rem', fontWeight: 'bold'},
		h4: {fontSize: '2.1rem', fontWeight: 'bold'},
		h5: {fontSize: '1.4rem', fontWeight: 'bold'},
		h6: {fontSize: '1.25rem', fontWeight: 'bold'},
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				html: {
					fontSize: '62.5%',  /* 62.5% of 16px = 10px = 1rem */
				},
				body: {
					color: theme.palette.primary.main,
					fontFamily: 'Rubik, Arial, sans-serif',
					fontSize: '1.4rem',
					lineHeight: '1.4',
				},
			},
		},
		MuiButton: {
			defaultProps: {
				size: "small",
				fontSize: '1.4rem',
				borderRadius: '0.6rem',
				padding: '0.4rem 1.2rem',
			},
			styleOverrides: {
				root: {
					'&.rounded': {
						borderRadius: '5rem',
					}
				},
			},
		},
		MuiToggleButtonGroup: {
			defaultProps: {
				size: "small",
			},
			styleOverrides: {
				root: {
					borderRadius: '0.6rem',
				},
			},
		},
		MuiToggleButton: {
			styleOverrides: {
				root: {
					borderRadius: '0.6rem',
					fontWeight: 'normal',
					minWidth: '6rem',
				},
				sizeSmall: {
					padding: '0.3rem 0.6rem',
					minWidth: '5rem',
				},
				sizeMedium: {
					padding: '0.6rem 1rem',
				}
			},
		},
		MuiSwitch: {
			defaultProps: {
				size: "small",
			},
			styleOverrides: {
				root: {
					width: 40,
					height: 20,
					padding: 0,
					'&.MuiSwitch-sizeLarge': {
						width: 44,
						height: 24,
						'.MuiSwitch-thumb': {
							width: 20,
							height: 20,
						},
					},
					'&.MuiSwitch-sizeSmall': {
						width: 34,
						height: 18,
						'.MuiSwitch-switchBase': {
							padding: 0,
						},
						'.MuiSwitch-thumb': {
							width: 14,
							height: 14,
						},
					},
				},
				switchBase: {
					padding: 0,
					margin: 2,
					'&.Mui-checked': {
						color: '#fff',
						'&+.MuiSwitch-track': {
							backgroundColor: theme.palette.primary.light,
							opacity: 1,
						},
					},
					'&.Mui-disabled': {
						color: '#fff',
						'&.Mui-checked':{
							color: '#fff',
						},
						'&+.MuiSwitch-track': {
							opacity: 0.2,
						},
					}
				},
				thumb: {
					width: 16,
					height: 16,
				},
				track: {
					borderRadius: 12,
					backgroundColor: 'rgba(0,0,0,0.2)',
				},
			},
		},
		MuiLink: {
			styleOverrides: {
				root: {
					color: theme.palette.primary.light,
				},
			},
		},
		MuiFormControl: {
			styleOverrides: {
				root: {
					[muiTheme.breakpoints.down('sm')]: {
						width: '100%',
					},
				},
			},
		},
		MuiSelect: {
			defaultProps: {
				size: "small",
			},
		},
		MuiAutocomplete: {
			defaultProps: {
				size: "small",
			},
		},
		MuiTextField: {
			defaultProps: {
				size: "small",
			},
		},
		MuiInputLabel: {
			defaultProps: {
				size: "small",
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					borderRadius: '1rem',
					backgroundColor: '#fff',
				},
			},
		},
		MuiCheckbox: {
			defaultProps: {
				size: "small",
			},
			styleOverrides: {
				root: {
					color: theme.palette.primary.light,
					"&.Mui-checked": {
						color: theme.palette.primary.light,
					},
				},
			},
		},
		MuiRadio: {
			defaultProps: {
				size: "small",
			},
			styleOverrides: {
				root: {
					color: theme.palette.primary.light,
					"&.Mui-checked": {
						color: theme.palette.primary.light,
					},
				},
			},
		},
		MuiChip: {
			defaultProps: {
				size: "small",
			},
			styleOverrides: {
				root: {
					borderRadius: '0.6rem',
					'.MuiSvgIcon-root': {
						color: 'inherit',
					}
				},
				colorDefault: {
					backgroundColor: '#ECEEF9',
				},
				outlinedDefault: {
					backgroundColor: 'transparent',
				},
			},
			variants: [
				{
					props: { variant: 'success' },
					style: {
						color: theme.palette.success.main,
						backgroundColor: theme.palette.success.light,
					},
				},
				{
					props: { variant: 'error' },
					style: {
						color: theme.palette.error.main,
						backgroundColor: theme.palette.error.light,
					},
				},
			],
		},
		MuiSvgIcon: {
			defaultProps: {
				size: "small",
			},
		},
		MuiModal: {
			styleOverrides: {
				root: {
				'&.MuiMenu-root': {
						'.MuiPaper-root.MuiPaper-rounded': {
							borderRadius: '1rem',
						},
					},
				},
			},
		},
		MuiTable: {
			defaultProps: {
				size: "small",
			},
		},
		MuiTableSortLabel: {
			styleOverrides: {
				icon: {
					opacity:1,
				}
			},
		},
	},
};

export default ThemeCrm;