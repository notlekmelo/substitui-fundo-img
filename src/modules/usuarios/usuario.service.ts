import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { Usuario } from "./usuario";
import { Rembg } from 'rembg';
import sharp from "sharp";
import { v4 as uuidv4 } from 'uuid';

export const gravarAssinatura = async (usuario: Usuario, callback: Function) => {
    dotenv.config();

    let novoFundo;
    const caminhoPrincipal = usuario.Caminho || String(process.env.DIRETORIO_BASE);
    
    // Verifica se o diretório existe e se não existir cria
    if (!fs.existsSync(caminhoPrincipal)) {
        fs.mkdirSync(caminhoPrincipal);
    }

    // Verifica se a imagem de fundo está definida
    if (usuario.ImagemFundo) {
        if (usuario.ImagemFundo.startsWith('C:/')) {
            if (!fs.existsSync(usuario.ImagemFundo)) {
                return callback({ message: "O caminho da imagem de fundo não foi encontrado" });
            } else {
                novoFundo = fs.readFileSync(usuario.ImagemFundo);
            }
        } else {
            novoFundo = Buffer.from(usuario.ImagemFundo, "base64");
        }
    } else {
        if (!fs.existsSync(path.join(caminhoPrincipal, String(process.env.IMAGEM_FUNDO)))) {
            return callback({ message: "O caminho da imagem de fundo não foi encontrado" });
        }
        novoFundo = fs.readFileSync(path.join(caminhoPrincipal, String(process.env.IMAGEM_FUNDO)));
    }

    try {
        const caminhoImagem = path.join(caminhoPrincipal, String(process.env.DIRETORIO_ANEXOS), uuidv4() + '.png');
        
        // Verifica a imagem original
        if (!usuario.ImagemOriginal) {
            return callback({ message: "Imagem original não fornecida" });
        }

        const sharpImage = sharp(Buffer.from(usuario.ImagemOriginal, 'base64'));

        // Remove o fundo da imagem
        const rembg = new Rembg();
        const imgSemFundo = await rembg.remove(sharpImage);

        // Verifica se a imagem sem fundo foi criada corretamente
        const gravaIMG = await new Promise((resolve, reject) => {
            imgSemFundo.toFile(caminhoImagem, (err, info) => {
                if (err) {
                    reject(err);
                } else {
                    console.log("Fundo Removido.");
                    resolve(info);
                }
            });
        });

        // Se a imagem sem fundo foi gravada com sucesso
        if (gravaIMG) {
            const novoNome = path.join(caminhoPrincipal, String(process.env.DIRETORIO_ANEXOS), uuidv4() + '.png');
            sharp(novoFundo)
                .composite([{ input: caminhoImagem, gravity: "center" }]) // Substitui o fundo
                .toFile(path.join(novoNome), (err, info) => {
                    if (err) {
                        return callback(err, '', caminhoImagem);
                    } else {
                        console.log("Imagem processada!");
                        return callback(null, novoNome, caminhoImagem);
                    }
                });
        }
    } catch (err) {
        callback(err);
    }
};
