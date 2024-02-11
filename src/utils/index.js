const mapAlbumDBToModel = ({id, name, year}) => ({
    id,
    name,
    year,
});

const mapSongDBToModel = {
    list: ({id, title, performer}) => ({
        id,
        title,
        performer,
    }),
    detail: ({...args, album_id}) => ({
        ...args,
        albumId: album_id,
    }),
};

module.exports = {mapAlbumDBToModel, mapSongDBToModel};
