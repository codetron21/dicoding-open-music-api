const {Pool} = require("pg");
const {nanoid} = require("nanoid");
const bcrypt = require('bcrypt');
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthenticationError = require("../../exceptions/AuthenticationError");

class UsersService {

    constructor() {
        this._pool = new Pool();
    }

    async addUser({username, password, fullname}) {
        const userIsExits = await this.checkUserIfExistsByUsername(username);

        if (userIsExits) {
            throw new InvariantError(`User dengan username ${username} sudah terdaftar`);
        }

        const id = `user-${nanoid(16)}`;
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = {
            text: "INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id",
            values: [id, username, hashedPassword, fullname],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError("User gagal ditambahkan");
        }

        return result.rows[0].id;
    }

    async verifyAuthUserCredential(username, password) {
        const query = {
            text: 'SELECT id, password FROM users WHERE username = $1',
            values: [username],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new AuthenticationError('Kredensial yang Anda berikan salah');
        }

        const {id, password: hashedPassword} = result.rows[0];

        const match = await bcrypt.compare(password, hashedPassword);

        if (!match) {
            throw new AuthenticationError('Kredensial yang Anda berikan salah');
        }

        return id;
    }

    async verifyTokenUser(userId, refreshToken) {
        const query = {
            text: 'SELECT id FROM users WHERE id = $1 AND refresh_token = $2',
            values: [userId, refreshToken],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError("Refresh token tidak valid");
        }
    }

    async addTokenUser(userId, refreshToken) {
        const query = {
            text: 'UPDATE users SET refresh_token = $2 WHERE id = $1',
            values: [userId, refreshToken],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError("Gagal menambahkan token pada user");
        }
    }

    async removeTokenUser(userId) {
        const query = {
            text: 'UPDATE users SET refresh_token = \'NULL\' WHERE id = $1',
            values: [userId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError("Gagal menghapus token pada user");
        }
    }

    async checkUserIfExistsByUsername(username) {
        try {
            await this.getUserByUsername(username);
            return true;
        } catch (e) {
            return false;
        }
    }

    async getUserByUsername(username) {
        const query = {
            text: "SELECT username FROM users WHERE username = $1",
            values: [username],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError(`User dengan username ${username} tidak ditemukan`);
        }

        return result.rows[0];
    }
}

module.exports = UsersService;
