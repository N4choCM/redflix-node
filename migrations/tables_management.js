exports.up = function (knex) {
	return knex.schema
	.withSchema('redflix_node_develop') 
	  .createTable("users", require('../core/model/user'))
	  .createTable("movies", require('../crud/movie/model/movie'))
	  };
  
  exports.down = function (knex) {
	return knex.schema
	.withSchema('redflix_node_develop') 
	  .dropTableIfExists('movies')
	  .dropTableIfExists('users');
  };
  