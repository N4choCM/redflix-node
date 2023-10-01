exports.up = function (knex) {
	return knex.schema
	.withSchema('redflix_node_develop') // Specify the schema here
	  .createTable("users", function (table) {
		table.increments("id").primary();
		table.string("username").notNullable();
		table.string("email").notNullable().unique();
		table.string("password").notNullable();
		table.string("isEnabled").defaultTo('true'); // Corrected default value
		table.string("verifyToken");
		table.string("resetPasswordToken");
		table.string("role").notNullable().defaultTo("GUEST");
		table.string("firstName");
		table.string("lastName");
		table.timestamps("created_at");
	  })
	  .createTable("movies", function (table) {
		table.increments("id").primary();
		table.string("title").notNullable();
		table.text("description").notNullable();
		table.string("type").notNullable().defaultTo("movie");
		table.string("trailerLink").notNullable();
		table.timestamps("created_at");
	  });
  };
  
  exports.down = function (knex) {
	return knex.schema
	  .dropTableIfExists('movies')
	  .dropTableIfExists('users');
  };
  