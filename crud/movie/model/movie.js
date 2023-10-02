const movieSchema = (table) => {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.text("description").notNullable();
    table.string("type").notNullable().defaultTo("movie");
    table.string("trailer_link").notNullable();
    table.timestamp("created_at");
}

module.exports = movieSchema;