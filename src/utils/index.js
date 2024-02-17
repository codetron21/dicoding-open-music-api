const mapAlbumDBToModel = {
    list: ({id, name, year, cover}) => ({
        id,
        name,
        year,
        coverUrl: cover
    }),
};

const mapSongDBToModel = {
    list: ({id, title, performer}) => ({
        id,
        title,
        performer,
    }),
    detail: ({album_id, ...args}) => ({
        ...args,
        albumId: album_id,
    }),
};

module.exports = {mapAlbumDBToModel, mapSongDBToModel};
