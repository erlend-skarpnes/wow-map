import mariadb, { type PoolConfig } from 'mariadb';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER, GAME_SERVER, GAME_PORT } from '$env/static/private';
import net from 'node:net';

export interface PlayerData {
	account: string;
	name: string;
	race: string;
	map: number;
	level: number;
	x: number;
	y: number;
}

export interface OnlineAccountData<TCharacter> {
	account: string;
	online: true;
	character: TCharacter;
}

export interface OfflineAccountData {
	account: string;
	online: false;
	character: null;
}

export type AccountData<TCharacter extends CharacterData = CharacterData> =
	null extends TCharacter
		? OnlineAccountData<TCharacter> | OfflineAccountData
		: OnlineAccountData<TCharacter>;

export interface CharacterData {
	name: string;
	race: string;
	gender: string;
	level: number;
	class: string;
}

export interface CharacterDataWithCoordinates extends CharacterData {
	coordinates: Coordinates;
}

export interface Coordinates {
	map: number;
	x: number;
	y: number;
}

// Database connection configuration
const dbConfig = {
	host: DB_HOST || 'localhost',
	port: Number.parseInt(DB_PORT) || 3306,
	user: DB_USER || 'root',
	password: DB_PASSWORD || '',
	database: DB_NAME || 'game_db',
	connectionLimit: 5
} satisfies PoolConfig;

// Create connection pool
console.log('Connecting to database...');
const pool = mariadb.createPool(dbConfig);

const races = ["Human", "Orc", "Dwarf", "Night Elf", "Undead", "Tauren", "Gnome", "Troll"];
const classes = ["Warrior", "Paladin", "Hunter", "Rogue", "Priest", "DeathKnight", "Shaman", "Mage", "Warlock", "NotInUse?", "Druid"];

export const getAccounts = async (): Promise<AccountData[] | undefined> => {
	let conn;
	try {
		conn = await pool.getConnection();

		const rows = await conn.query(`
			SELECT a.username, c.name, c.level, c.race, c.gender, c.class, c.online
			FROM classicrealmd.account a
						 LEFT JOIN (SELECT account, name, level, race, gender, class, online
												FROM classiccharacters.characters
												WHERE online = 1) c
											 ON a.id = c.account
			WHERE a.username NOT LIKE 'RNDBOT%' AND a.username NOT LIKE 'GM';
		`);

		return rows.map((row: any) => ({
			account: row.username,
			online: true,
			character:
				 {
						name: row.name,
						race: races[row.race - 1],
						gender: row.gender === 0 ? 'Male' : 'Female',
						level: row.level,
						class: classes[row.class - 1]
					}

		} satisfies AccountData));

	} catch (err) {
		console.error('Database error:', err);
	} finally {
		// Release connection back to the pool if it was obtained
		if (conn) await conn.release();
	}
};

export const getFromDb = async (): Promise<AccountData<CharacterDataWithCoordinates>[] | undefined> => {
	let conn;
	try {
		conn = await pool.getConnection();

		const rows = await conn.query(`
			SELECT classicrealmd.account.username as account, online, name, race, class, position_x, position_y, map, level
			FROM characters 
			JOIN classicrealmd.account ON characters.account = classicrealmd.account.id
			WHERE online = 1
		`);

		// Transform database rows to PlayerInfo objects
		return rows.map((row: any) => ({
			account: row.account,
			online: true,
			character: {
					name: row.name,
					race: races[row.race - 1],
					gender: row.gender === 0 ? 'Male' : 'Female',
					level: row.level,
					class: classes[row.class - 1],
					coordinates: {
						map: row.map,
						x: row.position_x,
						y: row.position_y
					}
				}
		} satisfies AccountData<CharacterDataWithCoordinates>));
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
}

export const getServerInfo = async (): Promise<ServerStatusData | undefined> => {
	const isServerUp = await getServerUp();

	if (!isServerUp) return {uptime: 0, isUp: isServerUp };

	let conn;
	try {
		conn = await pool.getConnection();

		const rows = await conn.query(`
			SELECT UNIX_TIMESTAMP() as timestamp, starttime
			FROM classicrealmd.uptime
			WHERE starttime = (SELECT MAX(starttime) FROM classicrealmd.uptime)
		`);

		const result = rows[0];

		const serverStatus = {
			uptime: Number(result.timestamp - result.starttime),
			isUp: isServerUp
		}

		return serverStatus;
	} catch (err) {
		console.error('Database error:', err);
	} finally {
		if (conn) await conn.release();
	}
}
