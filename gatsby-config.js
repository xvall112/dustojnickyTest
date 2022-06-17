require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    siteUrl: "https://zdk.netlify.app",
    title: "základní důstojnický kurz",
  },
  plugins: [
    `gatsby-plugin-material-ui`,
    "gatsby-plugin-image",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    {
      resolve: "gatsby-plugin-apollo",
      options: {
        uri: "https://zdk.netlify.app/.netlify/functions/graphql",
      },
    },
  ],
};
