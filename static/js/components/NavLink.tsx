import { forwardRef, CSSProperties } from 'react';
import { NavLink } from "react-router-dom";
import { useTheme } from '@mui/material';

const ApeNavLink = forwardRef<any, any>((props, ref) => {
  const { to, children } = props;
  const theme = useTheme();

  const defaultStyle: CSSProperties = {
    color:  theme.palette.link?.inactive,
    textDecoration: 'none',
  };

  const activeStyle: CSSProperties = {
    ...defaultStyle,
    color: theme.palette.link?.active,
    fontWeight: 'bold',
    textDecoration: 'none',
  };

  return (
    <NavLink
      ref={ref}
      to={to}
      style={({ isActive }) => (isActive ? activeStyle : defaultStyle )}
    >
      {children}
    </NavLink>
  );
})

export default ApeNavLink;
