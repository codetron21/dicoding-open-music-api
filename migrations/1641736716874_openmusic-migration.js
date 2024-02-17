exports.up = (pgm) => {
    pgm.createTable("albums", {
        id: {
            type: "VARCHAR(50)",
            primaryKey: true,
        },
        name: {
            type: "TEXT",
            notNull: true,
        },
        year: {
            type: "INTEGER",
            notNull: true,
        },
        cover: {
            type: "TEXT",
            allowNull: true,
        }
    });

    pgm.createTable("songs", {
        id: {
            type: "VARCHAR(50)",
            primaryKey: true,
        },
        title: {
            type: "TEXT",
            notNull: true,
        },
        year: {
            type: "INTEGER",
            notNull: true,
        },
        genre: {
            type: "TEXT",
            notNull: true,
        },
        performer: {
            type: "TEXT",
            notNull: true,
        },
        duration: {
            type: "INTEGER",
        },
        album_id: {
            type: "VARCHAR(50)",
        },
    });

    pgm.addConstraint('songs', 'fk_album.songs_album.id', 'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
    pgm.dropConstraint('songs', 'fk_album.songs_album.id');
    pgm.dropTable("songs");
    pgm.dropTable("albums", {cascade: true});
};
