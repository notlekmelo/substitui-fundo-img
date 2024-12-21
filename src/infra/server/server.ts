import express from "express";
import routes from "../../modules/routes"
import * as dotenv from "dotenv";


const server = express();
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // atualize para combinar com o domínio que você precisa
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'POST');
    next();
  });
dotenv.config();
server.use(express.json({limit: '10mb'}));
server.use(express.urlencoded({ extended: true, limit: '10mb' }));server.use(routes);

export default server;