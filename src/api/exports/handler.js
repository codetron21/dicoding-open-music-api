class ExportsHandler {
    constructor(service, playlistService, validator) {
        this._service = service;
        this._playlistService = playlistService;
        this._validator = validator;

        this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
    }

    async postExportPlaylistHandler(request, h) {
        this._validator.validatePayload(request.payload);

        const {id: credentialId} = request.auth.credentials;
        const { playlistId } = request.params;
        const { targetEmail } = request.payload;

        await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);

        const message = {
            playlistId: playlistId,
            targetEmail: targetEmail,
        };
        await this._service.sendMessage('export:playlist', JSON.stringify(message));

        const response = h.response({
            "status": "success",
            "message": "Permintaan Anda sedang kami proses",
        });
        response.code(201);
        return response;
    }
}

module.exports = ExportsHandler;
