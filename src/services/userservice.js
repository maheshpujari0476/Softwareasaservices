import argon2 from "argon2";
import { pool } from "../config/db.js";

export const createUser = async (name, email, password) => {
  const client = await pool.connect();
  try{
    //  if (process.env.NODE_ENV === "test") {
    //     await client.query("BEGIN");
    //    const query = `INSERT INTO userstest(name,email,password) 
    // VALUES ($1,$2,$3)
    // RETURNING id, name, email, created_at`;

    // const values = [name, email, hashpass];
    // const result = await client.query(query, values);
    //    await client.query("COMMIT");
    //  return result.rows;
  
    //  }
    //  else{
  
    await client.query('BEGIN');
  const hashpass = await argon2.hash(password);
  const query = `INSERT INTO users(name,email,password) 
    VALUES ($1,$2,$3)
    RETURNING id, name, email, created_at`;

  const values = [name, email, hashpass];
  const result = await client.query(query, values);

  const user = result.rows[0];
  const query1 = `INSERT INTO audit_logs(user_id,action)
  VALUES($1,$2)`;
  const action = "user registered";
  const values2 = [user.id,action];
  const result1 = await client.query(query1,values2);

  const query2 = `INSERT INTO profile_logs(user_id,name,email)
  VALUES($1,$2,$3)`;
  const values3 = [user.id,name,email];
  const result2 = await client.query(query2,values3);
  console.log(result.rows[0]);
  await client.query('COMMIT')
  return result.rows[0];
  // }
  }catch(err){
    await client.query('ROLLBACK');
   throw err;
  }finally{
  client.release();
  }
};


export const findUserByEmail = async(email)=>{
  // if (process.env.NODE_ENV === "test") {
  //   const query = `SELECT * FROM userstest WHERE email = $1`;
  //   const result = await pool.query(query, [email]);
  //   return result.rows[0];
  // }else{
  
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await pool.query(query,[email]);
    return result.rows[0];
  // }
}

export const Allusers = async()=>{
    const query = `SELECT * FROM users`;
    const allusers = await pool.query(query);
    return allusers.rows;
}

export const getUsers =async(page=1,limit = 4)=>{
const offset = (page - 1) * limit;

const totalResult = await pool.query(
  `SELECT COUNT(*) FROM users`
)

const totlaItems = parseInt(totalResult.rows[0].count);

const result = await pool.query(`
    SELECT id,name,email
    FROM users
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2`,
    [limit,offset]
);

const totalPages = Math.ceil(totlaItems/limit)
console.log(totalPages)
return {
 data:result.rows,
 totlaItems,
 totalPages,
 currentPage:page,
 hasNextPage:page<totalPages,
 hasPrevPage:page > 1,
};
}