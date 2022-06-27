import { createTheme, responsiveFontSizes } from "@mui/material";
import { CSSProperties } from "react";

const theme = createTheme({
  palette: {
    primary: {
      main: "#BCA687",
    },
    background: {
      default: "#121111",
    },
    text: {
      primary: "#fff",
      title: "#b6bfc9",
    },
    divider: "#4f5255",
    link: {
      active: "#fff",
      inactive: "#4a5766",
    },
    success: {
      main: "#6FCF97",
      dark: "#0F552C",
    },
    warning: {
      main: "#F2C94C",
      dark: "#866912",
    },
    error: {
      main: "#EB5757",
      dark: "#530C0C",
    },
  },
  typography: {
    fontFamily: "Inter, Arial",
    logo: {
      color: "#FFFFFF",
      fontFamily: "Montserrat",
      fontWeight: 700,
      fontSize: "1.5rem",
    },
    cardTitle: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    body1: {
      fontSize: "0.875rem",
    },
    button: {
      lineHeight: 1.5,
    },
    caption: {
      fontWeight: 600,
      fontSize: "0.75rem",
    },
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        arrow: {
          color: "#373D45",
        },
        tooltip: {
          padding: "8px 12px",
          fontWeight: 400,
          fontSize: "0.875rem",
          lineHeight: "20px",
          backgroundColor: "#373D45",
          borderRadius: "4px",
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        thumb: {
          height: 10,
          width: 10,
          backgroundColor: "#BCA687",
          border: "0",
          boxShadow: "#ebebeb 0 0 0",
          "&:focus, &:hover, &$active": {
            boxShadow: "#ccc 0 0 0 0",
          },
        },
        track: {
          color: "#BCA687",
          height: 2,
          borderRadius: 1,
          border: 0,
        },
        rail: {
          color: "#616E7C",
          height: 2,
          borderRadius: 1,
          opacity: 1,
        },
        mark: {
          height: 4,
          width: 4,
          backgroundColor: "#616E7C",
          borderRadius: 2,
          opacity: 1,
        },
        markLabel: {
          color: "#B6BFC9",
          fontSize: 12,
          marginLeft: "2px",
        },
        markLabelActive: {
          color: "#B6BFC9",
          fontSize: 12,
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          pageTitle: "h1",
        },
      },
    },
    MuiLink: {
      defaultProps: {
        color: "#fff",
        underline: "none",
        fontWeight: "bold",
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
        disableTouchRipple: true,
      },
    },
    MuiButton: {
      styleOverrides: {
        text: {
          color: "#fff",
        },
      },
      variants: [
        {
          props: { variant: "primary" },
          style: {
            minHeight: "44px",
            background: `linear-gradient(123.35deg, #EBF3D0 0%, rgba(235, 243, 208, 0) 18.4%),
              radial-gradient(29.9% 70.94% at 44.25% 86.96%, #DC8DDC 0%, rgba(220, 141, 220, 0) 100%),
              radial-gradient(33.83% 53.57% at 35.87% 100%, #DC8DDC 0%, rgba(220, 141, 220, 0) 100%),
              radial-gradient(42.66% 49.72% at 45.56% 44.65%, #CBADEB 0%, rgba(194, 166, 241, 0) 100%),
              linear-gradient(134.59deg, #CDF9E8 20.63%, rgba(205, 249, 232, 0) 47.84%),
              linear-gradient(216.44deg, rgba(192, 169, 240, 0) -16.52%, #C0A9F0 -1.04%, rgba(192, 169, 240, 0) 16.99%),
              linear-gradient(128.53deg, rgba(192, 169, 240, 0) 28.63%, #C0A9F0 38.5%, rgba(192, 169, 240, 0) 50.26%),
              radial-gradient(40.75% 97.37% at 90.75% 40.15%, #FFFDB1 0%, #FEE4BF 34.46%, #F0BDD0 69.5%, rgba(255, 129, 38, 0) 100%),
              #C2A6F1
            `,
            textTransform: "none",
            whiteSpace: "nowrap",
            color: "#121111",
            fontWeight: "600",
            ":hover": {
              background: `linear-gradient(123.35deg, #EBF3D0 0%, rgba(235, 243, 208, 0) 18.4%),
                radial-gradient(29.9% 70.94% at 44.25% 86.96%, #DC8DDC 0%, rgba(220, 141, 220, 0) 100%),
                radial-gradient(33.83% 53.57% at 35.87% 100%, #DC8DDC 0%, rgba(220, 141, 220, 0) 100%),
                radial-gradient(42.66% 49.72% at 45.56% 44.65%, #CBADEB 0%, rgba(194, 166, 241, 0) 100%),
                linear-gradient(134.59deg, #CDF9E8 20.63%, rgba(205, 249, 232, 0) 47.84%),
                linear-gradient(216.44deg, rgba(192, 169, 240, 0) -16.52%, #C0A9F0 -1.04%, rgba(192, 169, 240, 0) 16.99%),
                linear-gradient(128.53deg, rgba(192, 169, 240, 0) 28.63%, #C0A9F0 38.5%, rgba(192, 169, 240, 0) 50.26%),
                radial-gradient(40.75% 97.37% at 90.75% 40.15%, #FFFDB1 0%, #FEE4BF 34.46%, #F0BDD0 69.5%, rgba(255, 129, 38, 0) 100%),
                #C2A6F1
              `,
            },
            ":disabled": {
              background: "#373D45",
              color: "#616E7C",
            },
          },
        },
        {
          props: { variant: "secondary" },
          style: {
            minHeight: "44px",
            background: "#BCA687",
            textTransform: "none",
            whiteSpace: "nowrap",
            color: "#121111",
            fontWeight: "600",
            ":hover": {
              backgroundColor: "#A08E74",
            },
            ":disabled": {
              backgroundColor: "#373D45",
              color: "#616E7C",
            },
            ":active": {
              backgroundColor: "#1E2329",
              color: "#FFFFFF",
            },
          },
        },
        {
          props: { variant: "third" },
          style: {
            minHeight: "40px",
            background: "#1E2329",
            textTransform: "none",
            whiteSpace: "nowrap",
            color: "#616E7C",
            fontWeight: "600",
          },
        },
        {
          props: { variant: "function" },
          style: {
            backgroundColor: "#1E2329",
            fontWeight: 600,
            fontSize: "0.75rem",
            py: 1,
            px: 2,
            ":hover": {
              backgroundColor: "#3D4854",
            },
            ":disabled": {
              backgroundColor: "#616E7C",
            },
            ":active": {
              backgroundColor: "#3D4854",
            },
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid",
          borderRadius: 16,
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: url(/fonts/Inter.ttf) format('truetype');
        }
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-display: swap;
          font-weight: 600;
          src: url(/fonts/Inter.ttf) format('truetype');
        }
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-display: swap;
          font-weight: 700;
          src: url(/fonts/Inter.ttf) format('truetype');
        }
        @font-face {
          font-family: 'Montserrat';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: url(/fonts/Montserrat-VariableFont_wght.ttf) format('truetype');
        }
      `,
    },
  },
});

theme.typography.pageTitle = {
  fontSize: "3.5rem",
  fontWeight: "700",
  textTransform: "uppercase",
  [theme.breakpoints.down("md")]: {
    fontSize: "1.3rem",
  },
};

theme.typography.slogan = {
  fontFamily: "Inter, Arial",
  fontWeight: 700,
  fontSize: "6rem",
  fontStyle: "normal",
  [theme.breakpoints.down("md")]: {
    fontSize: "3rem",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "2.5rem",
  },
};

declare module "@mui/material/styles" {
  interface TypographyVariants {
    logo: CSSProperties;
    pageTitle: CSSProperties;
    cardTitle: CSSProperties;
    slogan: CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    logo?: CSSProperties;
    pageTitle?: CSSProperties;
    cardTitle?: CSSProperties;
    slogan?: CSSProperties;
  }

  interface TypeText {
    title: string;
  }

  interface Palette {
    link?: {
      inactive: string;
      active: string;
    };
  }

  interface PaletteOptions {
    link?: {
      inactive: string;
      active: string;
    };
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    logo: true;
    pageTitle: true;
    cardTitle: true;
    slogan: true;
  }
}

// Update the Button's variant prop options
declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    primary: true;
    secondary: true;
    third: true;
    function: true;
  }
}

const responsiveTheme = responsiveFontSizes(theme);

export default responsiveTheme;
