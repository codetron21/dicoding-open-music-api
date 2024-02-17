class AlbumLikesHandler {
    constructor(service, albumService, cacheService) {
        this._service = service;
        this._albumService = albumService;
        this._cacheService = cacheService;

        this.postAlbumsLikesHandler = this.postAlbumsLikesHandler.bind(this);
        this.getAlbumLikesHandler = this.getAlbumLikesHandler.bind(this);
        this.deleteAlbumLikesHandler = this.deleteAlbumLikesHandler.bind(this);
    }

    async postAlbumsLikesHandler(request, h) {
        const {id: credentialId} = request.auth.credentials;
        const {id} = request.params;

        await this._albumService.getAlbumById(id);
        await this._service.addAlbumLike(id, credentialId);
        await this._cacheService.delete(`album-likes:${id}`);

        const response = h.response({
            status: 'success',
            message: 'Berhasil menyukai album',
        });
        response.code(201);
        return response;
    }

    async getAlbumLikesHandler(request, h) {
        const {id} = request.params;

        await this._albumService.getAlbumById(id);
        let result;

        try {
            result = await this._cacheService.get(`album-likes:${id}`);
        } catch (e) {
            result = await this._service.getAlbumLikes(id);
            await this._cacheService.set(`album-likes:${id}`, result);
        }

        const response = h.response({
            status: 'success',
            data: {
                likes: result
            }
        });
        response.code(200);
        return response;
    }

    async deleteAlbumLikesHandler(request, h) {
        const {id: credentialId} = request.auth.credentials;
        const {id} = request.params;

        await this._albumService.getAlbumById(id);
        await this._service.removeAlbumLike(id, credentialId);
        await this._cacheService.delete(`album-likes:${id}`);

        const response = h.response({
            status: 'success',
            message: 'Batal menyukai album',
        });
        response.code(200);
        return response;
    }

}

module.exports = AlbumLikesHandler;