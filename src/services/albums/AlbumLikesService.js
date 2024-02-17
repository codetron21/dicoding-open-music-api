const {Pool} = require("pg");
const {nanoid} = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");

class AlbumLikesService {

    constructor() {
        this._pool = new Pool();
    }

    async addAlbumLike(albumId, userId) {
        const checkQuery = {
            text:'SELECT * FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
            values:[albumId, userId]
        };

        const resultCheck = await this._pool.query(checkQuery);

        if (resultCheck.rowCount) {
            throw new InvariantError("Album sudah disukai.");
        }

        const id = `album_likes-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO user_album_likes(id, user_id, album_id) VALUES($1, $2, $3) RETURNING id',
            values: [id, userId, albumId]
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError("Gagal menyimpan data suka album.");
        }

        return result.rows[0].id;
    }

    async removeAlbumLike(albumId, userId) {
        const query = {
            text: `DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id`,
            values: [albumId, userId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError("Gagal menghapus data suka album.");
        }
    }

    async getAlbumLikes(albumId) {
        const query = {
            text: `SELECT * FROM user_album_likes WHERE album_id = $1`,
            values: [albumId],
        };

        const result = await this._pool.query(query);

        return result.rowCount;
    }

}

module.exports = AlbumLikesService;