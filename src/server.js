require("dotenv").config();

const Hapi = require("@hapi/hapi");
//const Jwt = require('@hapi/jwt');

const Validator = require("./validator");
const ClientError = require("./exceptions/ClientError");
const TokenManager = require('./tokenize/TokenManager');

// albums
const albums = require("./api/albums");
const AlbumsService = require("./services/albums/AlbumsService");

// songs
const songs = require("./api/songs");
const SongsService = require("./services/songs/SongsService");

// users
const users = require("./api/users");
const UsersService = require("./services/users/UsersService");

const init = async () => {
    const albumsService = new AlbumsService();
    const songsService = new SongsService();
    const userService = new UsersService();

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ["*"],
            },
        },
    });

    // registrasi plugin eksternal
    // await server.register([
    //     {
    //         plugin: Jwt,
    //     },
    // ]);

    // registrasi plugin internal
    await server.register([
        {
            plugin: albums,
            options: {
                service: albumsService,
                validator: Validator.album,
            },
        },
        {
            plugin: songs,
            options: {
                service: songsService,
                validator: Validator.song,
            },
        },
        {
            plugin: users,
            options: {
                service: userService,
                validator: Validator.user,
                tokenManager: TokenManager,
            }
        }
    ]);

    server.ext('onPreResponse', (request, h) => {
        // mendapatkan konteks response dari request
        const {response} = request;

        // penanganan client error secara internal.
        if (response instanceof ClientError) {
            const newResponse = h.response({
                status: response.status,
                message: response.message,
            });
            newResponse.code(response.statusCode);
            return newResponse;
        }

        return h.continue;
    });

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
