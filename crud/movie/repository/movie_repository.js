/**
 * @fileoverview Movie repository
 */
const { pool } = require("../../../config/db_config");

/**
 * Saves a movie in the DB.
 * @param {*} movie The info of the movie to be saved.
 */
const save = async (movie) => {
  const query = "INSERT INTO redflix_node_develop.movies (title, description, type, trailer_link, created_at) VALUES ($1, $2, $3, $4, $5)";
  try{
    await pool.query(query, [movie.title, movie.description, movie.type, movie.trailerLink, movie.createdAt]);
  } catch (error) {
    throw error;
  }
}

/**
 * Updates the info of a movie in the DB.
 * @param {*} movie The info of the movie to be updated.
 */
const update = async (movie) => {
  const query = "UPDATE redflix_node_develop.movies SET title = $1, description = $2, type = $3, trailer_link = $4 WHERE id = $5";
  try{
    await pool.query(query, [movie.title, movie.description, movie.type, movie.trailerLink, movie.id]);
  } catch (error) {
    throw error;
  }
}

/**
 * Finds a movie by its id.
 * @param {*} id The id of the movie to be searched.
 * @returns The movie if it exists, null otherwise.
 */
const findById = async (id) => {
  const query = "SELECT * FROM redflix_node_develop.movies WHERE id = $1";
  const dao = await pool.query(query, [id]);
  return dao;
};

/**
 * Finds all the movies.
 * @returns All the movies if they exist, null otherwise.
 */
const findAll = async () => {
  const query = "SELECT * FROM redflix_node_develop.movies";
  const dao = await pool.query(query);
  return dao;
};

/**
 * Deletes a movie by its id.
 * @param {*} id The id of the movie to be deleted.
 */
const deleteById = async (id) => {
  const query = "DELETE FROM redflix_node_develop.movies WHERE id = $1";
  await pool.query(query, [id]);
};

module.exports = {
  save,
  update,
  findById,
  findAll,
  deleteById
};
