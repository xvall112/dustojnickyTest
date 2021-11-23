import React from "react";
import { Link } from "gatsby";
import { Grid, Container } from "@mui/material";
const pageStyles = {
  color: "#232129",

  fontFamily: "-apple-system, Roboto, sans-serif, serif",
};
const Layout = ({ children }) => {
  return (
    <div style={pageStyles}>
      <Container>
        <Grid container direction="row" spacing={3}>
          <Grid item>
            <Link to="/">Search</Link>
          </Grid>
          <Grid item>
            <Link to="/add">Add</Link>
          </Grid>
        </Grid>

        {children}
      </Container>
    </div>
  );
};

export default Layout;
