import type { ILeitorFS } from "../../lib/leitor_fs";

export class LeitorFS implements ILeitorFS {
    conteudo_arquivo(arquivo: string): string {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', arquivo, false);
        xhr.send(null);
        if (xhr.status === 200) {
            return xhr.responseText;
        } else {
            console.error(`Erro ao carregar ${arquivo}: ${xhr.status} ${xhr.statusText}`);
            return "";
        }
    }

    listar_arquivos(dir: string): string[] {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', dir + '?format=json', false);
        xhr.send(null);

        if (xhr.status === 200) {
            try {
                const data = JSON.parse(xhr.responseText);
                return data.map((item: any) => item.name);
            } catch (e) {
                console.error('Erro ao processar resposta JSON:', e);
                return [];
            }
        } else {
            console.error(`Erro ao listar diretório ${dir}: ${xhr.status} ${xhr.statusText}`);
            return [];
        }

    }
}
