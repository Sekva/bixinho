import { readFileSync } from "fs";
import { readdirSync } from "fs";
import type { ILeitorFS } from "../../lib/leitor_fs";

export class LeitorFS implements ILeitorFS {
    conteudo_arquivo(arquivo: string): string {
        return readFileSync(arquivo).toString();
    }

    listar_arquivos(dir: string): string[] {
        return readdirSync(dir);
    }
}
