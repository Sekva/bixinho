import { type ITextura, type IContextoGrafico, Tecla, AnimacaoTextura, Botao } from "../../../lib/interfaces_graficas";
import type { ILeitorFS } from "../../../lib/leitor_fs";

export class TexturaHTML5 implements ITextura {
    private imagem: HTMLImageElement;
    public carregada: boolean = false;
    private larguraImg: number = 0;
    private alturaImg: number = 0;

    private tintCanvas?: HTMLCanvasElement;
    private tintCtx?: CanvasRenderingContext2D;

    private getTintCtx(w: number, h: number) {
        if (!this.tintCanvas) {
            this.tintCanvas = document.createElement("canvas");
            this.tintCtx = this.tintCanvas.getContext("2d")!;
            this.tintCtx.imageSmoothingEnabled = false;
        }
        if (this.tintCanvas.width !== w) this.tintCanvas.width = w;
        if (this.tintCanvas.height !== h) this.tintCanvas.height = h;
        return this.tintCtx!;
    }

    constructor(private caminho: string) {
        this.imagem = new Image();
        this.imagem.onload = () => {
            this.carregada = true;
            this.larguraImg = this.imagem.width;
            this.alturaImg = this.imagem.height;
        };
        this.imagem.onerror = () => {
            console.error(`Erro ao carregar textura: ${caminho}`);
            this.carregada = false;
        };
        this.imagem.src = caminho;
    }

    desenhar(cg: ContextoGraficoHTML5, x: number, y: number, escala: number, rotacao: number, tint: number): void {
        if (!this.carregada) return;

        const ctx = cg.ctx;

        ctx.save();
        ctx.translate(x * escala, y * escala);
        ctx.rotate(rotacao);
        ctx.scale(escala, escala);

        if (tint === 0xFFFFFFFF) {
            ctx.drawImage(this.imagem, 0, 0);
            ctx.restore();
            return;
        }

        const a = ((tint >>> 24) & 0xFF) / 255;
        const r = (tint >>> 16) & 0xFF;
        const g = (tint >>> 8) & 0xFF;
        const b = (tint >>> 0) & 0xFF;

        const w = this.larguraImg;
        const h = this.alturaImg;

        const tctx = this.getTintCtx(w, h);

        // IMPORTANTÍSSIMO: isso é no offscreen, não no canvas principal
        tctx.clearRect(0, 0, w, h);

        tctx.globalCompositeOperation = "source-over";
        tctx.drawImage(this.imagem, 0, 0);

        tctx.globalCompositeOperation = "source-in";
        tctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        tctx.fillRect(0, 0, w, h);

        tctx.globalCompositeOperation = "source-over";

        // Agora sim: joga o resultado no canvas principal
        ctx.drawImage(this.tintCanvas!, 0, 0);

        ctx.restore();
    }

    unload(_cg: ContextoGraficoHTML5): void {
        this.imagem.src = "";
        this.carregada = false;
        this.larguraImg = 0;
        this.alturaImg = 0;
    }

    largura(_cg: ContextoGraficoHTML5): number { return this.larguraImg; }
    altura(_cg: ContextoGraficoHTML5): number { return this.alturaImg; }
}

export class ContextoGraficoHTML5 implements IContextoGrafico {

    public ctx: CanvasRenderingContext2D;

    private mouseX: number = 0;
    private mouseY: number = 0;
    private teclasLiberadas: Map<Tecla, boolean> = new Map();
    private mouseEmCanvas: boolean = false;
    private ultimoFrameTime: number = 0;
    private deveFechar: boolean = false;
    private fpsAlvo: number = 10;
    private frameDelay: number;

    constructor(
        public canvas: HTMLCanvasElement,
        private leitor_fs: ILeitorFS,
    ) {
        let ctx_temp = canvas.getContext("2d");
        if (ctx_temp) {
            this.ctx = ctx_temp;
        } else {
            throw "Sem contexto HTMLCanvas";
        }

        this.configurarEventosMouse();
        this.configurarEventosTeclado();

        Object.values(Tecla).forEach(tecla => {
            if (typeof tecla === 'number') {
                this.teclasLiberadas.set(tecla, false);
            }
        });

        this.frameDelay = 1000 / this.fpsAlvo;
        this.ctx.imageSmoothingEnabled = false;

    }

    private configurarEventosMouse(): void {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });

        this.canvas.addEventListener('mouseenter', () => {
            this.mouseEmCanvas = true;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouseEmCanvas = false;
        });
    }

    private configurarEventosTeclado(): void {
        document.addEventListener('keyup', (e) => {
            const tecla = this.mapearTecla(e.key);
            if (tecla !== undefined) {
                this.teclasLiberadas.set(tecla, true);
                e.preventDefault();
            }
        });
    }


    private mapearTecla(key: string): Tecla | undefined {
        switch(key.toLowerCase()) {
            case 'escape': return Tecla.Tecla_ESC;
            case 'n': return Tecla.Tecla_N;
            case 'h': return Tecla.Tecla_H;
            case 'e': return Tecla.Tecla_E;
            case 'l': return Tecla.Tecla_L;
            case 's': return Tecla.Tecla_S;
            default: return undefined;
        }
    }

    criar_textura(caminho: string): ITextura {
        return new TexturaHTML5(caminho);
    }

    criar_animacao(diretorio: string, stops: number = 2, repetir: boolean = true, direcao: number = 1): AnimacaoTextura {
        return new AnimacaoTextura(this, diretorio, this.leitor_fs, stops, repetir, direcao);
    }

    criar_botao(caminho: string, tint: number, tint_sobre: number): Botao {
        return new Botao(this, caminho, tint, tint_sobre);
    }

    obter_mouse_x(): number {
        if(this.mouseEmCanvas) {
            return this.mouseX;
        }
        return 0;
    }

    obter_mouse_y(): number {
        if(this.mouseEmCanvas) {
            return this.mouseY;
        }
        return 0;
    }

    tecla_liberada(tecla: Tecla): boolean {
        const val = this.teclasLiberadas.get(tecla) || false;
        this.teclasLiberadas.set(tecla, false);
        return val;
    }

    desenhar_texto(texto: string, x: number, y: number, tamanho: number, cor: number): void {
        this.ctx.save();
        const corHex = `#${cor.toString(16).padStart(6, '0')}`;
        this.ctx.fillStyle = corHex;
        this.ctx.font = `${tamanho}px Calibri`;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(texto, x, y, this.canvas.width);
        this.ctx.restore();
    }

    inicializar_janela(largura: number, altura: number, titulo: string): void {
        this.canvas.width = largura;
        this.canvas.height = altura;
        this.ctx.imageSmoothingEnabled = false;
        if (typeof document !== 'undefined') {
            document.title = titulo;
        }
        this.ultimoFrameTime = performance.now();
    }

    definir_fps_alvo(fps: number): void {
        this.fpsAlvo = Math.max(1, fps);
        this.frameDelay = 1000 / this.fpsAlvo;
    }

    definir_nivel_log(nivel: number): void {
        console.log(`Nível de log definido para: ${nivel}`);
    }

    janela_deve_fechar(): boolean {
        return this.deveFechar;
    }

    fechar_janela(): void {
        this.deveFechar = true;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    comecar_desenho(): void {
        let delta = this.frameDelay + 1;
        do  {
            const agora = performance.now();
            delta = agora - this.ultimoFrameTime;
        } while(delta < this.frameDelay)
        this.ultimoFrameTime = performance.now();
        this.ctx.save();
    }

    terminar_desenho(): void {
        this.ctx.restore();
    }

    limpar_fundo(cor: number): void {
        const corHex = `#${cor.toString(16).padStart(6, '0')}`;
        this.ctx.save();
        this.ctx.fillStyle = corHex;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    }

}
