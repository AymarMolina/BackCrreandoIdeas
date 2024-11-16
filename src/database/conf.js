const { Client } = require('pg');

const client = new Client({
    host: 'ep-royal-base-a5ui2esd.us-east-2.aws.neon.tech',    
    port: 5432,            
    user: 'CIdeas_owner',    
    password: 'tmAgZxyT9Mf6', 
    database: 'CIdeas', 
    ssl: {
        rejectUnauthorized: false 
    }
});

client.connect()
    .then(() => {
        console.log("Conectado a PostgreSQL");
    })
    .catch((err) => {
        console.error("Error al conectar a la base de datos", err.stack);
    });

module.exports = client; 
