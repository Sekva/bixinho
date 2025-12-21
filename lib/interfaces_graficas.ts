/**
 * Interfaces genéricas para abstração de contexto gráfico.
 * Permite que a biblioteca não dependa diretamente de implementações específicas
 * de plataforma (Raylib, SDL, etc.)
 */

/**
 * Interface para representar uma textura genérica
 */
export interface ITextura {
    desenhar(cg: IContextoGrafico, x: number, y: number, escala: number, rotacao: number, tint: number): void;
    unload(cg: IContextoGrafico): void;
    largura(cg: IContextoGrafico): number;
    altura(cg: IContextoGrafico): number;
}

/**
 * Interface para representar uma animação de texturas
 */
export interface IAnimacaoTextura {
    desenhar(cg: IContextoGrafico, x: number, y: number, escala: number, rotacao: number, tint: number): void;
    update(): void;
    unload(cg: IContextoGrafico): void;
    terminada(): boolean;

    // Propriedades
    altura: number;
    largura: number;
    carregado: boolean;
}

/**
 * Interface para representar um botão interativo
 */
export interface IBotao {
    desenhar(cg: IContextoGrafico, x: number, y: number, escala: number, rotacao: number, destaque: boolean): void;
    mouse_dentro(cg: IContextoGrafico, mousex: number, mousey: number): boolean;
    unload(cg: IContextoGrafico): void;
}

/**
 * Interface principal do Contexto Gráfico (CG)
 * Abstrai todas as operações gráficas necessárias para o jogo
 */
export interface IContextoGrafico {
    // Criação de recursos
    criar_textura(caminho: string): ITextura;
    criar_animacao(diretorio: string, stops?: number, repetir?: boolean, direcao?: number): IAnimacaoTextura;
    criar_botao(caminho: string, tint: number, tint_sobre: number): IBotao;

    // Input
    obter_mouse_x(): number;
    obter_mouse_y(): number;
    tecla_liberada(tecla: number): boolean;

    // Desenho direto
    desenhar_texto(texto: string, x: number, y: number, tamanho: number, cor: number): void;

    // Controle de janela e renderização
    inicializar_janela(largura: number, altura: number, titulo: string): void;
    definir_fps_alvo(fps: number): void;
    definir_nivel_log(nivel: number): void;
    janela_deve_fechar(): boolean;
    fechar_janela(): void;

    // Ciclo de renderização
    comecar_desenho(): void;
    terminar_desenho(): void;
    limpar_fundo(cor: number): void;
}
