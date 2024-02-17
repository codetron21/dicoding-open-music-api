const CoverAlbumHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'uploads/albums/cover',
    version: '1.0.0',
    register: async (server, {storageService, coverAlbumService, validator}) => {
        const coverAlbumHandler = new CoverAlbumHandler(
            storageService,
            coverAlbumService,
            validator
        );
        server.route(routes(coverAlbumHandler));
    },
};