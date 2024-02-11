class PlaylistsHandler {

    constructor(service, songsService, validator) {
        this._service = service;
        this._songsService = songsService;
        this._validator = validator;

        this.postPlaylist = this.postPlaylist.bind(this);
        this.getPlaylist = this.getPlaylist.bind(this);
        this.deletePlaylist = this.deletePlaylist.bind(this);
        this.postSongToPlaylist = this.postSongToPlaylist.bind(this);
        this.getSongPlaylist = this.getSongPlaylist.bind(this);
        this.deleteSongPlaylist = this.deleteSongPlaylist.bind(this);
    }

    async postPlaylist(request, h) {
        this._validator.validatePlaylistPayload(request.payload);

        const {name} = request.payload;
        const {id: credentialId} = request.auth.credentials;

        const playlistId = await this._service.createPlaylist(credentialId, name);

        const response = h.response({
            status: 'success',
            message: 'Playlist berhasil ditambahkan',
            data: {
                playlistId,
            },
        });
        response.code(201);
        return response;
    }

    async getPlaylist(request) {
        const {id: credentialId} = request.auth.credentials;
        const playlists = await this._service.getPlaylistFromUserId(credentialId);
        return {
            status: 'success',
            data: {
                "playlists": playlists,
            },
        };
    }

    async deletePlaylist(request) {
        const {id: credentialId} = request.auth.credentials;

        const {id} = request.params;

        await this._service.verifyPlaylistOwner(id, credentialId);
        await this._service.removePlaylistById(id);

        return {
            status: 'success',
            message: 'Playlist berhasil dihapus',
        };
    }

    async postSongToPlaylist(request, h) {
        this._validator.validatePlaylistSongPostPayload(request.payload);

        const {id: credentialId} = request.auth.credentials;
        const {songId} = request.payload;
        const {id} = request.params;

        await this._service.verifyPlaylistOwner(id, credentialId);
        await this._songsService.getSongById(songId);
        await this._service.addSongToPlaylist(songId, id);

        const response = h.response({
            status: 'success',
            message: 'Lagu berhasil ditambahkan ke playlist',
        });
        response.code(201);
        return response;
    }

    async getSongPlaylist(request) {
        const {id: credentialId} = request.auth.credentials;

        const {id} = request.params;

        await this._service.verifyPlaylistOwner(id, credentialId);

        const {playlist, songs} = await this._service.getSongsFromPlaylistById(id);

        if (!playlist) {
            return {
                status: 'success',
                data: null,
            };
        }

        const objPlaylist = playlist[0];
        objPlaylist.songs = songs;

        return {
            status: 'success',
            data: {
                "playlist": objPlaylist,
            },
        };
    }

    async deleteSongPlaylist(request) {
        this._validator.validatePlaylistSongDeletePayload(request.payload);

        const {id: credentialId} = request.auth.credentials;
        const {id} = request.params;
        const {songId} = request.payload;

        await this._service.verifyPlaylistOwner(id, credentialId);
        await this._songsService.getSongById(songId);
        await this._service.removeSongFromPlaylist(songId, id);

        return {
            status: 'success',
            message: 'Lagu dari playlist berhasil dihapus',
        };
    }
}

module.exports = PlaylistsHandler;