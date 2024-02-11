/* eslint-disable camelcase */

exports.up = pgm => {
    pgm.createTable('playlists', {
        id: {
            type: "VARCHAR(50)",
            primaryKey: true,
        },
        name: {
            type: "TEXT",
            notNull: true,
        },
        owner: {
            type: "VARCHAR(50)",
            references: 'users',
            notNull: true,
        },
    });
    pgm.addConstraint('playlists', 'fk_playlists.playlists_owner.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = pgm => {
    pgm.dropConstraint('playlists', 'fk_playlists.playlists_owner.id');
    pgm.dropTable("playlists", {cascade: true});
};
