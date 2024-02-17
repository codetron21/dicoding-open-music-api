const {Pool} = require("pg");
const NotFoundError = require("../../exceptions/NotFoundError");

class CoverAlbumService {

    constructor() {
        this._pool = new Pool();
    }

    async addCover(cover, albumId) {
        const query = {
            text: "UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id",
            values: [cover, albumId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError("Gagal memperbarui album, Id tidak ditemukan");
        }
    }

}

module.exports = CoverAlbumService;