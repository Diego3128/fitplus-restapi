import { pool } from '../db.js';


export const ping = async (req, res) => {
    let [result] = await pool.query("SELECT 'pong' as result ");
    result = result[0];
    res.send(result);
}
