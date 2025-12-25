import { type ITextura, type IContextoGrafico, Tecla, AnimacaoTextura, Botao } from "../../../lib/interfaces_graficas";

export class TexturaHTML5 implements ITextura {
    private imagem: HTMLImageElement;
    public carregada: boolean = false;
    private larguraImg: number = 0;
    private alturaImg: number = 0;

    constructor(
        private ctx: CanvasRenderingContext2D,
        private caminho: string
    ) {
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

        cg.ctx.save();

        cg.ctx.translate(x, y);
        cg.ctx.rotate(rotacao);
        cg.ctx.scale(escala, escala);

        if (tint !== 0xFFFFFF) {
            cg.ctx.save();

            const r = ((tint >> 16) & 0xFF) / 255;
            const g = ((tint >> 8) & 0xFF) / 255;
            const b = (tint & 0xFF) / 255;

            cg.ctx.filter = `brightness(0) saturate(100%)
                         sepia(100%)
                         hue-rotate(0deg)
                         saturate(100%)
                         brightness(100%)
                         contrast(100%)
                         drop-shadow(0px 0px 0px rgb(${r * 255}, ${g * 255}, ${b * 255}))`;
        }

        // Desenhar imagem centralizada
        const offsetX = 0;//-this.larguraImg / 2;
        const offsetY = 0;//-this.alturaImg / 2;
        cg.ctx.drawImage(this.imagem, offsetX, offsetY);

        // Restaurar estado
        if (tint !== 0xFFFFFF) {
            cg.ctx.restore(); // Restaurar filter
        }
        cg.ctx.restore();
    }

    unload(cg: ContextoGraficoHTML5): void {
        // Liberar recursos da imagem
        this.imagem.src = '';
        this.carregada = false;
        this.larguraImg = 0;
        this.alturaImg = 0;
    }

    largura(cg: ContextoGraficoHTML5): number {
        return this.larguraImg;
    }

    altura(cg: ContextoGraficoHTML5): number {
        return this.alturaImg;
    }

}



export class ContextoGraficoHTML5 implements IContextoGrafico {

    public ctx: CanvasRenderingContext2D;

    private mouseX: number = 0;
    private mouseY: number = 0;
    private teclasPressionadas: Map<Tecla, boolean> = new Map();
    private teclasLiberadas: Map<Tecla, boolean> = new Map();
    private mouseEmCanvas: boolean = false;
    private ultimoFrameTime: number = 0;
    private deveFechar: boolean = false;
    private fpsAlvo: number = 10;
    private frameDelay: number;

    constructor(
        public canvas: HTMLCanvasElement,
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
                this.teclasPressionadas.set(tecla, false);
                this.teclasLiberadas.set(tecla, true);
            }
        });

        this.frameDelay = 1000 / this.fpsAlvo;

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
        document.addEventListener('keydown', (e) => {
            const tecla = this.mapearTecla(e.key);
            if (tecla !== undefined) {
                this.teclasPressionadas.set(tecla, true);
                this.teclasLiberadas.set(tecla, false);
                e.preventDefault();
            }
        });

        document.addEventListener('keyup', (e) => {
            const tecla = this.mapearTecla(e.key);
            if (tecla !== undefined) {
                this.teclasPressionadas.set(tecla, false);
                this.teclasLiberadas.set(tecla, true);
                e.preventDefault();
            }
        });
    }


      private mapearTecla(key: string): Tecla | undefined {
        switch(key.toLowerCase()) {
            case 'n': return Tecla.Tecla_N;
            case 'h': return Tecla.Tecla_H;
            case 'e': return Tecla.Tecla_E;
            case 'l': return Tecla.Tecla_L;
            case 's': return Tecla.Tecla_S;
            default: return undefined;
        }
    }

    criar_textura(caminho: string): ITextura {
        return new TexturaHTML5(this.ctx, caminho);
    }

    criar_animacao(diretorio: string, stops: number = 2, repetir: boolean = true, direcao: number = 1): AnimacaoTextura {
        return new AnimacaoTextura(this, diretorio, stops, repetir, direcao);
    }

    criar_botao(caminho: string, tint: number, tint_sobre: number): Botao {
        return new Botao(this, caminho, tint, tint_sobre);
    }

    obter_mouse_x(): number {
        return this.mouseX;
    }

    obter_mouse_y(): number {
        return this.mouseY;
    }

    tecla_liberada(tecla: Tecla): boolean {
        return this.teclasLiberadas.get(tecla) || false;
    }

    desenhar_texto(texto: string, x: number, y: number, tamanho: number, cor: number): void {
        this.ctx.save();
        const corHex = `#${cor.toString(16).padStart(6, '0')}`;
        this.ctx.fillStyle = corHex;
        this.ctx.font = `${tamanho}px Arial`;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(texto, x, y);
        this.ctx.restore();
    }

    inicializar_janela(largura: number, altura: number, titulo: string): void {
        this.canvas.width = largura;
        this.canvas.height = altura;
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
