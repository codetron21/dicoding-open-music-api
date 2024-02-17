class CoverAlbumHandler {
    constructor(storageService, coverAlbumService, validator) {
        this._storageService = storageService;
        this._coverAlbumService = coverAlbumService;
        this._validator = validator;

        this.postUploadCoverHandler = this.postUploadCoverHandler.bind(this);
    }

    async postUploadCoverHandler(request, h) {
        const { cover } = request.payload;
        const { id } = request.params;

        const headers =   cover.hapi.headers;
        const payload =   request.payload;

        this._validator.validateHeaderAndPayload(headers,payload);

        const filename = await this._storageService.writeFile(cover, cover.hapi);
        await this._coverAlbumService.addCover(filename, id);

        const response = h.response({
            status: 'success',
            message: "Sampul berhasil diunggah",
        });
        response.code(201);

        return response;
    }
}

module.exports = CoverAlbumHandler;
