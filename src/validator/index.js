const {
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
} = require("./schema");
const InvariantError = require("../exceptions/InvariantError");

const Validator = {
    album: {
        validateAlbumPayload: (payload) => {
            const validationResult = AlbumPayloadSchema.validate(payload);
            checkValidation(validationResult);
        },
    },
    song: {
        validateSongPayload: (payload) => {
            const validationResult = SongPayloadSchema.validate(payload);
            checkValidation(validationResult);
        },
        validateSongQuery: (query) => {
            const validationResult = SongQuerySchema.validate(query);
            checkValidation(validationResult);
        }
    },
    user: {
        validateUserPayload: (payload) => {
            const validationResult = UserPayloadSchema.validate(payload);
            checkValidation(validationResult);
        },
        validateUserPostAuth: (payload) => {
            const validationResult = UserPostAuthSchema.validate(payload);
            checkValidation(validationResult);
        },
        validateUserPutAuth: (payload) => {
            const validationResult = UserPutAuthSchema.validate(payload);
            checkValidation(validationResult);
        },
        validateUserDeleteAuth: (payload) => {
            const validationResult = UserDeleteAuthSchema.validate(payload);
            checkValidation(validationResult);
        }
    },
    playlist: {
        validatePlaylistPayload: (payload) => {
            const validationResult = PlaylistPostSchema.validate(payload);
            checkValidation(validationResult);
        },
        validatePlaylistSongPostPayload: (payload) => {
            const validationResult = PlaylistSongPostSchema.validate(payload);
            checkValidation(validationResult);
        },
        validatePlaylistSongDeletePayload: (payload) => {
            const validationResult = PlaylistSongDeleteSchema.validate(payload);
            checkValidation(validationResult);
        },
    }
};

function checkValidation(validationResult) {
    if (validationResult.error) {
        throw new InvariantError(validationResult.error.message);
    }
}

module.exports = Validator;
