const userSchema = (table) => {
    table.increments("id").primary();
    table.string("username").notNullable();
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
    table.string("is_enabled").defaultTo('true');
    table.string("verifyToken");
    table.string("reset_password_token");
    table.string("role").notNullable().defaultTo("GUEST");
    table.string("first_name");
    table.string("last_name");
    table.timestamp("created_at");
}
  
module.exports = userSchema;