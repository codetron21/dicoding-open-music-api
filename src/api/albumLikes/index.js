const AlbumLikesHandler = require("./handler");
const routes = require("./routes");

module.exports = {
    name: 'album/likes',
    version: '1.0.0',
    register: async (server, {
        service,
        albumService,
        cacheService,
    }) => {
        const albumLikesHandler = new AlbumLikesHandler(
            service,
            albumService,
            cacheService
        );
        server.route(routes(albumLikesHandler));
    },
};