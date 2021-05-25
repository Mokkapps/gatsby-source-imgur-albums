const fetch = require('node-fetch');
const { createRemoteFileNode } = require('gatsby-source-filesystem');

exports.sourceNodes = (
    { actions: { createNode }, createContentDigest, store, cache, createNodeId },
    configOptions
) => {
  delete configOptions.plugins;
  const { albumHashes, clientId, debug, apiUrl } = configOptions;

  debug && console.log(`albumHashes: ${albumHashes}`);

  let imgurUrl = apiUrl || `https://api.imgur.com/3/album/`;
  let headers = {
    method: 'GET',
    headers: { Authorization: `Client-ID ${clientId}` },
  };

  const processNodes = async album => {
    debug && console.log('Album Info', album);

    const nodeAlbumId = createNodeId(`imgur-album-${album.id}`);
    const nodeContent = JSON.stringify(album);
    const nodeData = Object.assign({}, album, {
      id: nodeAlbumId,
      parent: null,
      internal: {
        type: `ImgurAlbum`,
        content: nodeContent,
        contentDigest: createContentDigest(album),
      },
    });
    createNode(nodeData);

    for (const image of album.images) {
      try {
        const fileNode = await createRemoteFileNode({
          url: image.link,
          store,
          cache,
          createNode,
          createNodeId,
        });

        if (fileNode) {
          image.localFile___NODE = fileNode.id;
        }
      } catch (error) {
        console.error('Failed to create node', error);
      }
    }

    album.images.map(img => {
      createNode({
        title: img.title,
        description: img.description,
        link: img.link,
        datetime: img.datetime,
        type: img.type,
        width: img.width,
        height: img.height,
        size: img.size,
        id: createNodeId(`imgur-img-${img.id}`),
        parent: nodeAlbumId,
        internal: {
          type: `ImgurImage`,
          content: nodeContent,
          contentDigest: createContentDigest(album),
        },
      });
    });
  };

  return Promise.all(
      albumHashes.map(hash =>
          fetch(imgurUrl + `${hash}`, headers)
          .then(response => response.json())
          .then(resp => processNodes(resp.data))
      )
  );
};

