export interface ILeitorFS {
    conteudo_arquivo(arquivo: string): string;
    listar_arquivos(dir: string): string[];
}
