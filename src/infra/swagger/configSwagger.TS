import fs from 'fs';

export class ConfigSwagger {
    swaggerFile: any = (process.cwd() + "/src/infra/swagger/swagger.json");
    swaggerData: any = fs.readFileSync(this.swaggerFile, 'utf8');
    swaggerDocument: any = JSON.parse(this.swaggerData);
}