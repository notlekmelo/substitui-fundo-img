import express, { Request, Response } from "express";
import * as usuarioService from './usuarios/usuario.service';
import * as usuarioController from './usuarios/usuario.controller';
import swaggerUi from 'swagger-ui-express';
import { ConfigSwagger } from '../infra/swagger/configSwagger'; // Para utilização dos testes automatizados esta linha deve estar comentada
import * as fs from "fs";

const routes = express.Router();

routes.post('/substituir-fundo', (req: Request, res: Response) => {
    const usuario = req.body;
    usuarioController.validatorSubstituirFundo(usuario, (paramsValidos: boolean, mensagem: string) => {
        if (!paramsValidos){
            res.status(422).json({
                "statusCode": 422,
                "message": mensagem
            });
        }
        else {
            usuarioService.gravarAssinatura(usuario, (err: Error, caminhoArquivo: string, arquivoApagar: string) => {
                if (arquivoApagar && fs.existsSync(arquivoApagar)) {
                    fs.rmSync(arquivoApagar)
                }
                if (err) {
                    res.status(500).json({
                        "statusCode": 500,
                        "message": err.message
                    });
                }
                else {
                    res.status(200).json({
                        "statusCode": 200,
                        "nomeImagem": caminhoArquivo 
                    });
                }
            })
        }
    })
})

// Para utilização dos testes automatizados este bloco deve estar comentado
const configSwagger = new ConfigSwagger();
routes.use('/api/docs', swaggerUi.serve,
    swaggerUi.setup(configSwagger.swaggerDocument));
// Fim do bloco que deve estar comentado para uso dos testes automatizados
routes.get('/', function (req, res) {
    res.send('Api de substituição de fundo de imagens on-line');
});

export default routes;