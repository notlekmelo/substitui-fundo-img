import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { Rembg } from "rembg";
import sharp from "sharp";
import { Usuario } from "./usuario";

export const gravarAssinatura = async (
  usuario: Usuario,
  callback: Function
) => {
  dotenv.config();

  let novoFundo: Buffer;
  const caminhoPrincipal =
    usuario.Caminho || String(process.env.DIRETORIO_BASE);

  // Verifica se o diretório existe e se não existir cria
  if (!fs.existsSync(caminhoPrincipal)) {
    fs.mkdirSync(caminhoPrincipal);
  }

  // Verifica se a imagem de fundo está definida
  if (
    !fs.existsSync(
      path.join(caminhoPrincipal, String(process.env.IMAGEM_FUNDO))
    )
  ) {
    return callback({
      message: "O caminho da imagem de fundo não foi encontrado",
    });
  }
  novoFundo = fs.readFileSync(
    path.join(caminhoPrincipal, String(process.env.IMAGEM_FUNDO))
  );

  try {
    const caminhoImagem = path.join(
      caminhoPrincipal,
      String(process.env.DIRETORIO_ANEXOS),
      "NovaImagem.png"
    );

    // Verifica a imagem original
    if (!usuario.ImagemOriginal) {
      return callback({ message: "Imagem original não fornecida" });
    }

    sharp.cache(false);

    const sharpImage = sharp(Buffer.from(usuario.ImagemOriginal, "base64"));

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
      const medidas = await sharp(caminhoImagem).metadata();
      sharp(caminhoImagem)
        .resize({
          width: Math.ceil((medidas.width || 1280) * 0.232),
          height: 168,
          fit: "fill",
          position: "left",
          // width: 168,
          // height: 168,
          // fit: "inside",
        })
        .toBuffer()
        .then((resizedBuffer) => {
          const composites = [];
          for (let x = 0; x < 4; x++) {
            composites.push({
              input: resizedBuffer,
              top: 0,
              gravity: "east",
              left: x * 168 - Math.ceil((medidas.width || 1280) * 0.049),
              // input: resizedBuffer,
              // gravity: "center",
              // top: 40,
              // left: x * 168,
            });
          }
          const novoNome = path.join(
            caminhoPrincipal,
            String(process.env.DIRETORIO_ANEXOS),
            "FundoSubstituido.png"
          );
          sharp(novoFundo)
            .composite(composites) // Substitui o fundo
            .toFile(path.join(novoNome), (err, info) => {
              if (err) {
                return callback(err, "", caminhoImagem);
              } else {
                console.log("Imagem processada!");
                return callback(null, novoNome, caminhoImagem);
              }
            });
        });
    }
  } catch (err) {
    callback(err);
  }
};
