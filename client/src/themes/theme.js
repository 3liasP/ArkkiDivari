import { createTheme } from '@mui/material/styles';
import { colors } from './colors';
import { fiFI } from '@mui/x-data-grid/locales';
import { fiFI as pickersFiFI } from '@mui/x-date-pickers/locales';
import { fiFI as coreFiFI } from '@mui/material/locale';

const lightTheme = createTheme(
    {
        palette: {
            mode: 'light',
            primary: {
                main: colors.dune,
                light: colors.tacao,
                dark: colors.night,
            },
            secondary: {
                main: colors.paleTeal,
            },
            error: {
                main: colors.darkBurgundy,
            },
            info: {
                main: colors.tealGreen,
            },
        },
    },
    fiFI,
    pickersFiFI,
    coreFiFI,
);

const darkTheme = createTheme(
    {
        palette: {
            mode: 'dark',
            primary: {
                main: colors.tacao,
                light: colors.sand,
                dark: colors.dune,
            },
            secondary: {
                main: colors.paleTeal,
            },
            error: {
                main: colors.darkBurgundy,
            },
            info: {
                main: colors.tealGreen,
            },
            background: {
                default: colors.night,
                paper: colors.night,
            },
            text: {
                primary: colors.lightText,
                secondary: colors.darkText,
            },
        },
    },
    fiFI,
    pickersFiFI,
    coreFiFI,
);

export { lightTheme, darkTheme };
