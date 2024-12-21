import { Usuario } from "./usuario";
import * as fs from 'fs';

export const validatorSubstituirFundo = (usuario: Usuario, callback: Function) => {
    if (!usuario.ImagemOriginal) {
        callback(false, 'A imagem que deseja substituir o fundo é obrigatória.');
    }
    else if (typeof usuario.ImagemOriginal != 'string') {
        callback(false, 'Deve-se enviar um base64 da imagem que deseja substituir o fundo.');
    }
    else if (usuario.Caminho) {
        if (typeof usuario.ImagemOriginal != 'string' || !fs.existsSync(usuario.Caminho)) {
            callback(false, 'O caminho para salvar a nova imagem é inválido');
        }
    } 
    if (usuario.ImagemFundo && typeof usuario.ImagemFundo != 'string') {
        callback(false, 'O parâmetro imagem de fundo é inválido.');
    }
    else {
        callback(true, '');
    }
}