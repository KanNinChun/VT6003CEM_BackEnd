import * as db from "../helpers/database";

export const findByUsername = async (username: string) => {
  const query = "select * from users where username = ?";
  const user = await db.run_query(query, [username]);
  return user;
};

export const register = async (username: string, email: string, password: string) => {
  try {
      // Check if the email already exists
      const existingUser = await db.run_query("SELECT * FROM users WHERE email = ?", [email]);
      if (existingUser.length > 0) {
          throw new Error(`Email '${email}' is already in use.`);
      }

      // If email doesn't exist, proceed with insertion
      const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
      const result = await db.run_query(query, [username, email, password]);
      return result;
  } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to register user");
  }
};

