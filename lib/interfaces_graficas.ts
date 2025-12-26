import type { ILeitorFS } from "./leitor_fs";

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

export class AnimacaoTextura {
    private frame_atual: number = 0;
    private frames: ITextura[] = [];
    public altura: number = 0;
    public largura: number = 0;
    public carregado: boolean = false;
    private anim_terminada: boolean = false;
    private s2 = 0;

    constructor(
        cg: IContextoGrafico,
        diretorio_frames: string,
        leitor_fs: ILeitorFS,
        private stops: number = 2,
        private repetir = true,
        private direcao = 1
    ) {
        let arquivos = leitor_fs.listar_arquivos(diretorio_frames)
            .map(nome => diretorio_frames + "/" + nome)
            .sort();

        for (const arq of arquivos) {
            const textura = cg.criar_textura(arq);
            this.frames.push(textura);
            this.altura = Math.max(this.altura, textura.altura(cg));
            this.largura = Math.max(this.largura, textura.largura(cg));
        }

        this.carregado = true;
        if (this.direcao == -1) {
            this.frames.reverse();
        }

    }

    public terminada(): boolean {
        return this.anim_terminada;
    }

    public update() {

        if (!this.repetir && this.frame_atual == (this.frames.length - 1)) {
            this.anim_terminada = true;
            return;
        }

        if (this.s2 % this.stops == 0) {
            this.frame_atual = (this.frame_atual + 1) % this.frames.length;
        }

        this.s2 = (this.s2 + 1) % this.stops;
    }

    public desenhar(cg: IContextoGrafico, x: number, y: number, escala: number, rotacao: number, tint: number) {
        this.frames[this.frame_atual]?.desenhar(cg, x, y, escala, rotacao, tint);
    }

    public unload(cg: IContextoGrafico) {
        this.frames.forEach((textura) => textura.unload(cg));
    }
}

export class Botao {
    private textura: ITextura;
    public tint: number;
    public tint_sobre: number;
    private ultimo_x: number = 0;
    private ultimo_y: number = 0;
    private ultima_escala: number = 0;

    constructor(cg: IContextoGrafico, caminho_imagem: string, tint: number, tint_sobre: number) {
        this.textura = cg.criar_textura(caminho_imagem);
        this.tint = tint;
        this.tint_sobre = tint_sobre;
    }

    public unload(cg: IContextoGrafico) {
        this.textura.unload(cg);
    }

    public desenhar(cg: IContextoGrafico, x: number, y: number, escala: number, rotacao: number, destaque: boolean) {
        let cor_destaque;
        if (destaque) {
            cor_destaque = this.tint_sobre;
        } else {
            cor_destaque = this.tint;
        }

        this.ultimo_x = x;
        this.ultimo_y = y;
        this.ultima_escala = escala;
        this.textura.desenhar(cg, x, y, escala, rotacao, cor_destaque);
    }

    public mouse_dentro(cg: IContextoGrafico, mousex: number, mousey: number): boolean {
        mousex = mousex / this.ultima_escala;
        mousey = mousey / this.ultima_escala;
        let texw = this.textura.largura(cg);
        let texh = this.textura.altura(cg);
        let cond = (this.ultimo_x < mousex && mousex < (this.ultimo_x + texw)) && (this.ultimo_y < mousey && mousey < (this.ultimo_y + texh));
        return cond;
    }
}

export interface IContextoGrafico {
    criar_textura(caminho: string): ITextura;
    criar_animacao(diretorio: string, stops?: number, repetir?: boolean, direcao?: number): AnimacaoTextura;
    criar_botao(caminho: string, tint: number, tint_sobre: number): Botao;

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
