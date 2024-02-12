
const routes = (handler) => [
    {
        method: "POST",
        path: "/playlists",
        handler: handler.postPlaylist,
        options: {
            auth: 'openmusicapp_jwt',
        },
    },
    {
        method: "POST",
        path: "/playlists/{id}/songs",
        handler: handler.postSongToPlaylist,
        options: {
            auth: 'openmusicapp_jwt',
        },
    },
    {
        method: "GET",
        path: "/playlists",
        handler: handler.getPlaylist,
        options: {
            auth: 'openmusicapp_jwt',
        },
    },
    {
        method: "GET",
        path: "/playlists/{id}/songs",
        handler: handler.getSongPlaylist,
        options: {
            auth: 'openmusicapp_jwt',
        },
    },
    {
        method: "DELETE",
        path: "/playlists/{id}",
        handler: handler.deletePlaylist,
        options: {
            auth: 'openmusicapp_jwt',
        },
    },
    {
        method: "DELETE",
        path: "/playlists/{id}/songs",
        handler: handler.deleteSongPlaylist,
        options: {
            auth: 'openmusicapp_jwt',
        },
    },
];

module.exports = routes;