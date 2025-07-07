import mariadb from 'mariadb';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from '$env/static/private';

export interface PlayerInfo {
	account: string;
	name: string;
	race: string;
	map: number;
	level: number;
	x: number;
	y: number;
}

// Database connection configuration
const dbConfig = {
	host: DB_HOST || 'localhost',
	port: DB_PORT || 3306,
	user: DB_USER || 'root',
	password: DB_PASSWORD || '',
	database: DB_NAME || 'game_db',
	connectionLimit: 5
};

// Create connection pool
console.log('Connecting to database...');
const pool = mariadb.createPool(dbConfig);

const races = ["Human", "Orc", "Dwarf", "Night Elf", "Undead", "Tauren", "Gnome", "Troll"];

export const getFromDb = async (): Promise<PlayerInfo[] | undefined> => {
	let conn;
	try {
		conn = await pool.getConnection();

		const rows = await conn.query(`
			SELECT classicrealmd.account.username as account, name, race, position_x, position_y, map, level
			FROM characters 
			JOIN classicrealmd.account ON characters.account = classicrealmd.account.id
			WHERE online = 1
		`);

		// Transform database rows to PlayerInfo objects
		return rows.map((row: any) => ({
			account: row.account,
			name: row.name,
			race: races[row.race - 1],
			level: row.level,
			map: row.map,
			x: row.position_x,
			y: row.position_y
		}));
	} catch (err) {
		console.error('Database error:', err);
	} finally {
		// Release connection back to the pool if it was obtained
		if (conn) conn.release();
	}
};

