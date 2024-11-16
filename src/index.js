const express = require("express"); 
const bodyParser = require("body-parser");
const apicache = require("apicache");
const cors = require("cors");  
const v1WorkoutRouter = require("./v1/routes/workoutRoutes");
const v1ProductsRouter = require("./v1/routes/productsRoutes");
const client = require('./database/conf');
const { swaggerDocs: V1SwaggerDocs } = require("./v1/swagger");

const app = express();
const cache = apicache.middleware;
const PORT = process.env.PORT || 3000; 

app.use(cors({
    origin: 'http://localhost:4200',  
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  
    allowedHeaders: ['Content-Type', 'Authorization']  
}));

const obtenerProductos = async () => {
    try {
        const res = await client.query('SELECT * FROM productos');
        console.log(res.rows); 
    } catch (err) {
        console.error('Error al obtener productos', err.stack);
    }
};

obtenerProductos();

app.use(bodyParser.json());
app.use(cache("2 minutes"));
app.use("/api/v1/workouts", v1WorkoutRouter);
app.use("/api/v1/products", v1ProductsRouter);

app.listen(PORT, () => { 
    console.log(`API is listening on port ${PORT}`); 
    V1SwaggerDocs(app, PORT);
});
