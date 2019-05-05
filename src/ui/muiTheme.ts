import { createMuiTheme } from '@material-ui/core';
import { blue, grey, orange } from '@material-ui/core/colors';

const muiTheme = createMuiTheme({
  palette: {
    background: {
      default: grey[300],
    },
    primary: blue,
    secondary: orange,
  },
  typography: {
    useNextVariants: true,
  },
});
export default muiTheme;
