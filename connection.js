require(dotenv).config()

module.exports = {
	//debug: ['ComQueryPacket', 'RowDataPacket'],
	host 		: process.env.HOST,
	user 		: process.env.USER,
	password: process.env.PW,
	// database: 'random_facts',
	database: 'test',
	port: process.env.PORT,
	charset: 'utf8mb4',
	waitForConnections: true,
	queueLimit: 0, // 0 = unlimited queueing
	connectionLimit: 10 // 0 = unlimited connections
}