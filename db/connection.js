require('dotenv').config()

module.exports = {
	//debug: ['ComQueryPacket', 'RowDataPacket'],
	host 		: process.env.DBHOST,
	user 		: process.env.DBUSER,
	password: process.env.DBPASS,
	port		: process.env.DBPORT,
	database: process.env.DB,
	//database: 'test',
	charset	: 'utf8mb4',
	waitForConnections: true,
	queueLimit: 0, // 0 = unlimited queueing
	connectionLimit: 10 // 0 = unlimited connections
}