const sql = require('mssql');

const config = {
    user: 'barberia_user',
    password: 'Barberia2024!',
    server: 'ADRIEL',
    database: 'BlackWhite',
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    }
};

let pool = null;

async function getPool() {
    if (!pool) {
        try {
            pool = await sql.connect(config);
            console.log('✅ Conectado a SQL Server - Base de datos BlackWhite');
        } catch (err) {
            console.error('❌ Error de conexión:', err.message);
            throw err;
        }
    }
    return pool;
}

module.exports = { getPool, sql };