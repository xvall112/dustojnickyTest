import React from "react";
import { Link } from "gatsby";
import { Grid, Container, Stack } from "@mui/material";
import { green } from "@mui/material/colors";
const pageStyles = {
  color: "#232129",
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
};

const link = {
  color: "green",
  textDecoration: "none",
  padding: "10px",
  borderRadius: "10px",
};
const Layout = ({ children }) => {
  return (
    <div style={pageStyles}>
      <Container>
        <Stack direction="row" justifyContent="center" alignItems="center">
          <h1>Základní důstojnický kurz</h1>
        </Stack>
        <Grid container direction="row" spacing={3}>
          <Grid item>
            <Link
              to="/"
              activeStyle={{ backgroundColor: "green", color: "white" }}
              style={link}
            >
              Vyhledat otázky
            </Link>
          </Grid>
          <Grid item>
            <Link
              style={link}
              to="/add"
              activeStyle={{ backgroundColor: "green", color: "white" }}
            >
              Přidat otázky
            </Link>
          </Grid>
        </Grid>

        {children}
      </Container>
    </div>
  );
};

export default Layout;
