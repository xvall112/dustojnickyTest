import React from "react";
import { Link } from "gatsby";
import Grid from "@mui/material/Grid";
const pageStyles = {
  color: "#232129",
  padding: 96,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
};
const Layout = ({ children }) => {
  return (
    <div style={pageStyles}>
      <Grid container direction="row" spacing={3}>
        <Grid item>
          <Link to="/">Search</Link>
        </Grid>
        <Grid item>
          <Link to="/add">Add</Link>
        </Grid>
      </Grid>

      {children}
    </div>
  );
};

export default Layout;
