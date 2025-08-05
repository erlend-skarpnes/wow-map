import mariadb from 'mariadb';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER, GAME_SERVER, GAME_PORT } from '$env/static/private';
import net from 'node:net';

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
		if (conn) await conn.release();
	}
};

export const getServerUp = async (): Promise<boolean> => {
	return new Promise((resolve) => {
		const socket = new net.Socket();

		const onError = () => {
			socket.destroy();
			resolve(false);
		};

		socket.setTimeout(500);
		socket.once('error', onError);
		socket.once('timeout', onError);

		socket.connect(parseInt(GAME_PORT), GAME_SERVER, () => {
			socket.end();
			resolve(true);
		});
	});
}

export interface ServerStatusData {
	uptime: number;
	isUp: boolean;
	playersOnline: number;
}

export const getServerInfo = async (): Promise<ServerStatusData | undefined> => {
	const isServerUp = await getServerUp();

	if (!isServerUp) return {uptime: 0, isUp: isServerUp, playersOnline: 0};

	let conn;
	try {
		conn = await pool.getConnection();

		const rows = await conn.query(`
			SELECT UNIX_TIMESTAMP() as timestamp, starttime, maxplayers
			FROM classicrealmd.uptime
			WHERE starttime = (SELECT MAX(starttime) FROM classicrealmd.uptime)
		`);

		const result = rows[0];

		const serverStatus = {
			uptime: Number(result.timestamp - result.starttime),
			isUp: isServerUp,
			playersOnline: result.maxplayers
		}

		return serverStatus;
	} catch (err) {
		console.error('Database error:', err);
	} finally {
		if (conn) await conn.release();
	}
}
