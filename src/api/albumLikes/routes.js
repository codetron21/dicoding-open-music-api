const routes = (handler) => [
    {
        method: "POST",
        path: "/albums/{id}/likes",
        handler: handler.postAlbumsLikesHandler,
        options: {
            auth: 'openmusicapp_jwt',
        },
    },
    {
        method: "GET",
        path: "/albums/{id}/likes",
        handler: handler.getAlbumLikesHandler,
    },
    {
        method: "DELETE",
        path: "/albums/{id}/likes",
        handler: handler.deleteAlbumLikesHandler,
        options: {
            auth: 'openmusicapp_jwt',
        },
    },
];

module.exports = routes;