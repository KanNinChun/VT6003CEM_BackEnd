import * as db from '../helpers/database';

//get a single user by the (unique) username
export const findByUsername = async (username: any) => {
    const query = 'SELECT * from users where username = ?';
    const user = await db.run_query(query, [username]);
    return user;
   }