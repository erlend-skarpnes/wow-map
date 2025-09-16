import mariadb, { type PoolConfig } from 'mariadb';
import {
	DB_HOST,
	DB_NAME,
	DB_PASSWORD,
	DB_PORT,
	DB_USER,
	GAME_SERVER,
	GAME_PORT
} from '$env/static/private';
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

export type AccountData<TCharacter extends CharacterData | null = CharacterData> =
	null extends TCharacter
		? OnlineAccountData<TCharacter> | OfflineAccountData
		: OnlineAccountData<TCharacter>;

export interface AccountOverviewData<T extends CharacterData> {
	account: string;
	online: boolean;
	characters: T[];
}

export interface CharacterData {
	name: string;
	race: string;
	gender: string;
	level: number;
	class: string;
	online: boolean;
}

export interface CharacterDataWithCoordinates extends CharacterData {
	coordinates: Coordinates;
}

export interface Coordinates {
	map: number;
	x: number;
	y: number;
}

export interface CharacterStatsData {
	level: CharacterStat[];
	playtime: CharacterStat[];
	money: CharacterStat[];
	quests: CharacterStat[];
	profession: CharacterStat[];
}

export interface CharacterStat {
	name: string;
	value: number;
}

export interface AuctionData {
	itemName: string;
	quantity: number;
	buyoutPrice: number;
	startBid: number;
	lastBid: number;
	sellerCharacter: string;
	sellerAccount: string;
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

const races = ['Human', 'Orc', 'Dwarf', 'Night Elf', 'Undead', 'Tauren', 'Gnome', 'Troll'];
const classes = [
	'Warrior',
	'Paladin',
	'Hunter',
	'Rogue',
	'Priest',
	'DeathKnight',
	'Shaman',
	'Mage',
	'Warlock',
	'NotInUse?',
	'Druid'
];

export const getStats = async (): Promise<CharacterStatsData | undefined> => {
	let conn;
	try {
		conn = await pool.getConnection();

		const level = await conn.query(`
			SELECT c.name, c.level as value
			FROM classiccharacters.characters c
				JOIN (SELECT id, a.username FROM classicrealmd.account a WHERE a.username NOT LIKE 'RNDBOT%' AND a.username NOT LIKE 'GM') a
			ON a.id = c.account
			ORDER BY value DESC
				LIMIT 5;
		`);

		const playtime = await conn.query(`
			SELECT c.name, c.totaltime as value
			FROM classiccharacters.characters c
				JOIN (SELECT id, a.username FROM classicrealmd.account a WHERE a.username NOT LIKE 'RNDBOT%' AND a.username NOT LIKE 'GM') a
			ON a.id = c.account
			ORDER BY value DESC
				LIMIT 5;
		`);

		const money = await conn.query(`
			SELECT c.name, c.money as value
			FROM classiccharacters.characters c
				JOIN (SELECT id, a.username FROM classicrealmd.account a WHERE a.username NOT LIKE 'RNDBOT%' AND a.username NOT LIKE 'GM') a
			ON a.id = c.account
			ORDER BY value DESC
				LIMIT 5;
		`);

		const quests = await conn.query(`
			SELECT c.name, COUNT(*) AS value
			FROM classiccharacters.character_queststatus cq
				JOIN classiccharacters.characters c
			ON c.guid = cq.guid
				JOIN classicrealmd.account a ON a.id = c.account
			WHERE cq.status = 1
				AND a.username NOT LIKE 'RNDBOT%'
				AND a.username NOT LIKE 'GM'
			GROUP BY c.guid
			ORDER BY value DESC
				LIMIT 5;
		`);

		const profession = await conn.query(`
			SELECT c.name, SUM(cs.value) as value
			FROM classiccharacters.character_skills cs
				JOIN classiccharacters.characters c
			ON c.guid = cs.guid
				JOIN classicrealmd.account a ON a.id = c.account
			WHERE a.username NOT LIKE 'RNDBOT%'
				AND a.username NOT LIKE 'GM'
				AND cs.skill IN (393
					, 182
					, 186
					, 171
					, 164
					, 165
					, 197
					, 202
					, 333
					, 185
					, 129
					, 356)
				AND cs.value
					> 1
			GROUP BY c.guid
			ORDER BY value DESC
				LIMIT 5;
		`);

		return {
			level: level.map((row: any) => ({ name: row.name, value: Number.parseInt(row.value) })),
			playtime: playtime.map((row: any) => ({ name: row.name, value: Number.parseInt(row.value) })),
			money: money.map((row: any) => ({ name: row.name, value: Number.parseInt(row.value)  })),
			quests: quests.map((row: any) => ({ name: row.name, value: Number.parseInt(row.value)  })),
			profession: profession.map((row: any) => ({ name: row.name, value: Number.parseInt(row.value)  }))
		};
	} catch (err) {
		console.error('Database error:', err);
	} finally {
		// Release connection back to the pool if it was obtained
		if (conn) await conn.release();
	}
};

export const getOnlineAccounts = async (): Promise<AccountData<CharacterData | null>[] | undefined> => {
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
			WHERE a.username NOT LIKE 'RNDBOT%'
				AND a.username NOT LIKE 'GM';
		`);

		return rows.map(
			(row: any) =>
				({
					account: row.username,
					online: row.online,
					character: row.online
						? {
								name: row.name,
								race: races[row.race - 1],
								gender: row.gender === 0 ? 'Male' : 'Female',
								level: row.level,
								class: classes[row.class - 1],
								online: row.online
							}
						: null
				}) satisfies AccountData<CharacterData | null>
		);
	} catch (err) {
		console.error('Database error:', err);
	} finally {
		// Release connection back to the pool if it was obtained
		if (conn) await conn.release();
	}
};

export const getAccounts = async (): Promise<Record<string, AccountOverviewData<CharacterData>> | undefined> => {
	let conn;
	try {
		conn = await pool.getConnection();

		const rows = await conn.query(`
			SELECT a.username, c.name, c.level, c.race, c.gender, c.class, c.online
			FROM classicrealmd.account a
						 INNER JOIN (SELECT account, name, level, race, gender, class, online
												FROM classiccharacters.characters) c
											 ON a.id = c.account
			WHERE a.username NOT LIKE 'RNDBOT%'
				AND a.username NOT LIKE 'GM';
		`);

		return rows.reduce((acc: any, row: any) => {
			if (!acc[row.username]) {
				acc[row.username] = {
					account: row.username,
					online: row.online,
					characters: [{
						name: row.name,
						race: races[row.race - 1],
						gender: row.gender === 0 ? 'Male' : 'Female',
						level: row.level,
						class: classes[row.class - 1],
						online: row.online
					} satisfies CharacterData]
				} satisfies AccountOverviewData<CharacterData>;
			} else {
				acc[row.username].characters.push({
					name: row.name,
					race: races[row.race - 1],
					gender: row.gender === 0 ? 'Male' : 'Female',
					level: row.level,
					class: classes[row.class - 1],
					online: row.online
				} satisfies CharacterData)
			}
			return acc;
		}, {})
	} catch (err) {
		console.error('Database error:', err);
	} finally {
		// Release connection back to the pool if it was obtained
		if (conn) await conn.release();
	}
};

export const getFromDb = async (): Promise<
	AccountOverviewData<CharacterDataWithCoordinates>[] | undefined
> => {
	let conn;
	try {
		conn = await pool.getConnection();

		const rows = await conn.query(`
			SELECT classicrealmd.account.username as account,
						 online,
						 name,
						 race,
						 gender,
						 class,
						 position_x,
						 position_y,
						 map,
						 level
			FROM characters
						 JOIN classicrealmd.account ON characters.account = classicrealmd.account.id
			WHERE classicrealmd.account.username NOT LIKE 'RNDBOT%'
				AND classicrealmd.account.username NOT LIKE 'GM';
		`);

		// Transform database rows to PlayerInfo objects
		let accumulator = rows.reduce((acc: any, row: any) => {
			if (!acc[row.username]) {
				acc[row.username] = {
					account: row.username,
					online: row.online,
					characters: [{
						name: row.name,
						race: races[row.race - 1],
						gender: row.gender === 0 ? 'Male' : 'Female',
						level: row.level,
						class: classes[row.class - 1],
						online: row.online === 1,
						coordinates: {
							map: row.map,
							x: row.position_x,
							y: row.position_y
						}
					} satisfies CharacterDataWithCoordinates]
				} satisfies AccountOverviewData<CharacterDataWithCoordinates>;
			} else {
				acc[row.username].characters.push({
					name: row.name,
					race: races[row.race - 1],
					gender: row.gender === 0 ? 'Male' : 'Female',
					level: row.level,
					class: classes[row.class - 1],
					online: row.online === 1,
					coordinates: {
						map: row.map,
						x: row.position_x,
						y: row.position_y
					}
				} satisfies CharacterDataWithCoordinates)
			}
			return acc;
		}, {});
		return Object.values(accumulator);

	} catch (err) {
		console.error('Database error:', err);
	} finally {
		// Release connection back to the pool if it was obtained
		if (conn) await conn.release();
	}
};

export const getAuctions = async () => {
	let conn;
	try {
		conn = await pool.getConnection();

		const rows = await conn.query(`
			SELECT i.name as item_name, a.item_count, a.buyoutprice, a.startbid, a.lastbid, c.name, acc.username
			FROM classiccharacters.auction a
						 INNER JOIN classicmangos.item_template i ON a.item_template = i.entry
						 INNER JOIN classiccharacters.characters c ON a.itemowner = c.guid
						 INNER JOIN classicrealmd.account acc ON c.account = acc.id
			WHERE acc.username NOT LIKE 'RNDBOT%'
				AND acc.username NOT LIKE 'GM';
		`);

		return rows.map(
			(row: any) =>
				({
					itemName: row.item_name,
					quantity: row.item_count,
					buyoutPrice: row.buyoutprice,
					startBid: row.startbid,
					lastBid: row.lastbid,
					sellerCharacter: row.name,
					sellerAccount: row.username
				}) satisfies AuctionData)
	} catch (err) {
		console.error('Database error:', err);
	} finally {
		// Release connection back to the pool if it was obtained
		if (conn) await conn.release();
	}
}

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
};

export interface ServerStatusData {
	uptime: number;
	isUp: boolean;
}

export const getServerInfo = async (): Promise<ServerStatusData | undefined> => {
	const isServerUp = await getServerUp();

	if (!isServerUp) return { uptime: 0, isUp: isServerUp };

	let conn;
	try {
		conn = await pool.getConnection();

		const rows = await conn.query(`
			SELECT UNIX_TIMESTAMP() as timestamp, starttime
			FROM classicrealmd.uptime
			WHERE starttime = (SELECT MAX (starttime) FROM classicrealmd.uptime)
		`);

		const result = rows[0];

		const serverStatus = {
			uptime: Number(result.timestamp - result.starttime),
			isUp: isServerUp
		};

		return serverStatus;
	} catch (err) {
		console.error('Database error:', err);
	} finally {
		if (conn) await conn.release();
	}
};
