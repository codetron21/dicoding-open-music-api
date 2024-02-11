const routes = (handler) => [
    {
        method: "POST",
        path: "/users",
        handler: handler.postUserHandler,
    },
    {
        method: "POST",
        path: "/authentications",
        handler: handler.postUserAuthHandler,
    },
    {
        method: "PUT",
        path: "/authentications",
        handler: handler.putUserAuthHandler,
    },
    {
        method: "DELETE",
        path: "/authentications",
        handler: handler.deleteUserAuthHandler,
    },
];

module.exports = routes;