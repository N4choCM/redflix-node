exports.up = function (knex) {
	return knex.schema
	.withSchema('redflix_node_develop') 
	  .createTable("users", require('../core/model/schema/user_schema'))
	  .createTable("movies", require('../crud/movies/model/schema/movie_schema'))
	  };
  
  exports.down = function (knex) {
	return knex.schema
	.withSchema('redflix_node_develop') 
	  .dropTableIfExists('movies')
	  .dropTableIfExists('users');
  };
  