/* eslint-disable camelcase */

exports.up = pgm => {
    pgm.createTable('user_album_likes', {
        id: {
            type: "VARCHAR(50)",
            primaryKey: true,
        },
        user_id: {
            type: "VARCHAR(50)",
            notNull: true,
        },
        album_id: {
            type: "VARCHAR(50)",
            notNull: true,
        }
    });
    pgm.addConstraint('user_album_likes', 'fk_user_album_likes.users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
    pgm.addConstraint('user_album_likes', 'fk_user_album_likes.albums.id', 'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE');
};

exports.down = pgm => {
    pgm.dropConstraint('user_album_likes', 'fk_user_album_likes.users.id');
    pgm.dropConstraint('user_album_likes', 'fk_user_album_likes.albums.id');
    pgm.dropTable('user_album_likes');
};
