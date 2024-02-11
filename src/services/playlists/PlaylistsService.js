const {Pool} = require("pg");
const {nanoid} = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");

class PlaylistsService {

    constructor() {
        this._pool = new Pool();
    }

    async verifyPlaylistOwner(id, userId) {
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Resource yang Anda minta tidak ditemukan');
        }

        const note = result.rows[0];

        if (note.owner !== userId) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }

    async createPlaylist(userId, name) {
        const id = `playlist-${nanoid(16)}`;

        const query = {
            text: "INSERT INTO playlists VALUES($1, $2, $3) RETURNING id",
            values: [id, name, userId],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError("Playlist gagal ditambahkan");
        }

        return result.rows[0].id;
    }

    async getPlaylistFromUserId(userId) {
        const query = {
            text: `SELECT p.id, p.name, u.username FROM playlists AS p 
                 INNER JOIN users AS u ON p.owner = u.id
                 WHERE p.owner = $1`,
            values: [userId],
        };

        const result = await this._pool.query(query);

        return result.rows;
    }

    async removePlaylistById(id) {
        const query = {
            text: "DELETE FROM playlists WHERE id = $1 RETURNING id",
            values: [id]
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError("Playlist gagal dihapus. Id tidak ditemukan");
        }
    }

    async addSongToPlaylist(songId, playlistId) {
        const id = `playlist_songs-${nanoid(16)}`;

        const query = {
            text: "INSERT INTO playlist_songs VALUES($1, $2, $3)",
            values: [id, playlistId, songId]
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError("Lagu gagal ditambahkan");
        }
    }

    async getSongsFromPlaylistById(id) {
        const query1 = {
            text: `SELECT p.id, p.name, u.username FROM playlists AS p 
                 INNER JOIN users AS u ON p.owner = u.id
                 WHERE p.id = $1`,
            values: [id],
        };

        const query2 = {
            text: `SELECT s.id, s.title, s.performer FROM playlist_songs AS ps 
                 INNER JOIN songs AS s ON s.id = ps.song_id
                 WHERE ps.playlist_id = $1`,
            values: [id],
        };

        const result1 = await this._pool.query(query1);
        const result2 = await this._pool.query(query2);

        const playlist = result1.rows;
        const songs = result2.rows;

        return {playlist, songs}
    }

    async removeSongFromPlaylist(songId, playlistId) {
        const query = {
            text: "DELETE FROM playlist_songs WHERE song_id = $1 AND playlist_id = $2 RETURNING id",
            values: [songId, playlistId]
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError("Lagu gagal dihapus dari playlist. Id tidak ditemukan");
        }
    }

}

module.exports = PlaylistsService;