export enum Tecla {
    Tecla_N,
    Tecla_H,
    Tecla_E,
    Tecla_L,
    Tecla_S,
}

export interface ITextura {
    desenhar(cg: IContextoGrafico, x: number, y: number, escala: number, rotacao: number, tint: number): void;
    unload(cg: IContextoGrafico): void;
    largura(cg: IContextoGrafico): number;
    altura(cg: IContextoGrafico): number;
}

export interface IAnimacaoTextura {
    desenhar(cg: IContextoGrafico, x: number, y: number, escala: number, rotacao: number, tint: number): void;
    update(): void;
    unload(cg: IContextoGrafico): void;
    terminada(): boolean;

    altura: number;
    largura: number;
    carregado: boolean;
}

export interface IBotao {
    desenhar(cg: IContextoGrafico, x: number, y: number, escala: number, rotacao: number, destaque: boolean): void;
    mouse_dentro(cg: IContextoGrafico, mousex: number, mousey: number): boolean;
    unload(cg: IContextoGrafico): void;
}

export interface IContextoGrafico {
    criar_textura(caminho: string): ITextura;
    criar_animacao(diretorio: string, stops?: number, repetir?: boolean, direcao?: number): IAnimacaoTextura;
    criar_botao(caminho: string, tint: number, tint_sobre: number): IBotao;

    obter_mouse_x(): number;
    obter_mouse_y(): number;
    tecla_liberada(tecla: Tecla): boolean;

    desenhar_texto(texto: string, x: number, y: number, tamanho: number, cor: number): void;

    inicializar_janela(largura: number, altura: number, titulo: string): void;
    definir_fps_alvo(fps: number): void;
    definir_nivel_log(nivel: number): void;
    janela_deve_fechar(): boolean;
    fechar_janela(): void;

    comecar_desenho(): void;
    terminar_desenho(): void;
    limpar_fundo(cor: number): void;
}
