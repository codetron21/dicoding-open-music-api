const Joi = require("joi");

const AlbumPayloadSchema = Joi.object({
    name: Joi.string().required(),
    year: Joi.number().positive().required(),
});

const SongPayloadSchema = Joi.object({
    title: Joi.string().required(),
    year: Joi.number().positive().required().max(new Date().getFullYear()),
    genre: Joi.string().required(),
    performer: Joi.string().required(),
    duration: Joi.number().positive(),
    albumId: Joi.string(),
});

const SongQuerySchema = Joi.object({
    title: Joi.string(),
    performer: Joi.string(),
});

const UserPayloadSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    fullname: Joi.string().required(),
});

const UserPostAuthSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

const UserPutAuthSchema = Joi.object({
    refreshToken: Joi.string().required(),
});

const UserDeleteAuthSchema = Joi.object({
    refreshToken: Joi.string().required(),
});

const PlaylistPostSchema = Joi.object({
    name: Joi.string().required(),
});

const PlaylistSongPostSchema = Joi.object({
    songId: Joi.string().required(),
});

const PlaylistSongDeleteSchema = Joi.object({
    songId: Joi.string().required(),
});

const ImageHeadersSchema = Joi.object({
    'content-type': Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp').required(),
}).unknown();

const CoverAlbumSchema = Joi.object({
    cover: Joi.required(),
}).unknown();

module.exports = {
    AlbumPayloadSchema,
    SongPayloadSchema,
    SongQuerySchema,
    UserPayloadSchema,
    UserPostAuthSchema,
    UserPutAuthSchema,
    UserDeleteAuthSchema,
    PlaylistPostSchema,
    PlaylistSongPostSchema,
    PlaylistSongDeleteSchema,
    ImageHeadersSchema,
    CoverAlbumSchema
};
