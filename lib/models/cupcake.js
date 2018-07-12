const client = require('../db-client');

module.exports = {
    select(id) {
        return id ? this.selectOne(id) : this.selectAll();
    },
    selectAll() {
        return client.query('SELECT * FROM CUPCAKES')
            .then(({ rows }) => rows);
    },
    selectOne(id) {
        return client.query(`
            SELECT *
            FROM CUPCAKES
            WHERE id = $1;
        `,
        [id]
        ).then(({ rows }) => rows[0]);
    },
    insert(cupcake) {
        return client.query(`
            INSERT INTO CUPCAKES (
                name, color, category_id, description
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `,
        [cupcake.name, cupcake.color, cupcake.category_id, cupcake.description]
        ).then(({ rows }) => rows[0]);
    },
    update(cupcake) {
        return client.query(`
            UPDATE CUPCAKES
            SET
                name = $1,
                color = $2,
                category_id = $3,
                description = $4
            WHERE id = $5
            RETURNING *;
        `,
        [cupcake.name, cupcake.color, cupcake.category_id, cupcake.description, cupcake.id]
        ).then(({ rows }) => rows[0]);
    },
    delete(id) {
        return client.query(`
            DELETE FROM CUPCAKES
            WHERE id = $1;
        `,
        [id]
        ).then(() => null);
    }
};