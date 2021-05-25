## Gatsby Source Imgur Albums Plugin

This Gatsby plugin allows to "source" Imgur albums into what Gatsby calls nodes.

Inspired by [gatsby-imgur-gallery-albums](https://github.com/stcalica/gatsby-imgur-gallery-albums) which was unfortunately not updated in the last years.

### Dependencies (optional)

This plugin was tested using the [gatsby-plugin-image](https://www.gatsbyjs.com/plugins/gatsby-plugin-image/) plugin.

## How to install

Please include installation instructions here.

Gatsby documentation uses `npm` for installation. This is the recommended approach for plugins as well.

If the plugin is a theme that needs to use `yarn`, please point to [the documentation for switching package managers](/docs/reference/gatsby-cli/#how-to-change-your-default-package-manager-for-your-next-project) in addition to the `yarn`-based instructions.

## Available options (if any)

## When do I use this plugin?

This plugin is useful if you want to add images from Imgur albums to your Gatsby site.

## Examples of usage

Add the plugin into your site's `gatsby-config.js` file:

```js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-imgur-albums`,
      options: {
        clientId: "XXXXXX", // register a new app at https://api.imgur.com/oauth2/addclient and select "Anonymous usage without user authorization"
        albumHashes: ['abc', 'def'], // checkout https://dev.to/codingcoach/get-your-album-id-in-imgur-b6c to get the ID of your album
        debug: false, // if true, some debug messages are logged
        apiUrl: "https://...." // if not set, https://api.imgur.com/3/album/ is used per default
      },
    }
  ],
}
```

## How to query for data 

````graphql
  {
    imgurAlbums: allImgurAlbum {
      nodes {
        title
        images_count
        images {
          localFile {
            childImageSharp {
              gatsbyImageData(width: 200)
            }
          }
        }
      }
    }
  }
````
