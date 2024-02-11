class UsersHandler {
    constructor(service, validator, tokenManager) {
        this._service = service;
        this._validator = validator;
        this._tokenManager = tokenManager;

        this.postUserHandler = this.postUserHandler.bind(this);
        this.postUserAuthHandler = this.postUserAuthHandler.bind(this);
        this.putUserAuthHandler = this.putUserAuthHandler.bind(this);
        this.deleteUserAuthHandler = this.deleteUserAuthHandler.bind(this);
    }

    async postUserHandler(request, h) {
        this._validator.validateUserPayload(request.payload);
        const userId = await this._service.addUser(request.payload);
        const response = h.response({
            status: "success",
            data: {userId},
        });
        response.code(201);
        return response;
    }

    async postUserAuthHandler(request, h) {
        this._validator.validateUserPostAuth(request.payload);

        const {username, password} = request.payload;

        const id = await this._service.verifyAuthUserCredential(username, password);

        const accessToken = this._tokenManager.generateAccessToken({id});
        const refreshToken = this._tokenManager.generateRefreshToken({id});

        await this._service.addTokenUser(id, refreshToken);

        const response = h.response({
            status: 'success',
            message: 'Authentication berhasil ditambahkan',
            data: {
                accessToken,
                refreshToken,
            },
        });
        response.code(201);
        return response;
    }

    async putUserAuthHandler(request) {
        this._validator.validateUserPutAuth(request.payload);

        const {refreshToken} = request.payload;
        const {id} = this._tokenManager.verifyRefreshToken(refreshToken);

        await this._service.verifyTokenUser(id, refreshToken);

        const accessToken = this._tokenManager.generateAccessToken({id});
        return {
            status: 'success',
            message: 'Access Token berhasil diperbarui',
            data: {
                accessToken,
            },
        };
    }

    async deleteUserAuthHandler(request) {
        this._validator.validateUserDeleteAuth(request.payload);

        const {refreshToken} = request.payload;
        const {id} = this._tokenManager.verifyRefreshToken(refreshToken);
        await this._service.verifyTokenUser(id, refreshToken);
        await this._service.removeTokenUser(id);

        return {
            status: 'success',
            message: 'Refresh token berhasil dihapus',
        };
    }
}

module.exports = UsersHandler;
