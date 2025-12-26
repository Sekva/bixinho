import { type IContextoGrafico, type ITextura, AnimacaoTextura, Botao, Tecla } from '../lib/interfaces_graficas';
import { Bixinho } from '../lib/bixinho';
import { GerenciadorTexturasBixinho } from '../lib/gerenciador_texturas_bixinho';
import { bixinho_estado, prox_do_enum } from '../lib/utils';
import { EstadoNutricao } from '../lib/nutricao';
import { EstadoHigiene } from '../lib/higiene';
import { EstadoHumor } from '../lib/humor';
import { EstadoEnergia } from '../lib/energia';
import { EstadoSaude } from '../lib/saude';
import type { ILeitorFS } from '../lib/leitor_fs';

enum EstadoJogo {
    Ligando = 0,
    Jogando = 1,
    Desligando = 2,
    Terminado = 3,
}

export class Jogo {
    private mousex: number = 0;
    private mousey: number = 0;
    private gerenciador_texturas_bixinho: GerenciadorTexturasBixinho;

    private texturas_basicas: Record<string, ITextura> = {} as any;
    private botaos_basicos: Record<string, Botao> = {} as any;
    private animacoes_basicas: Record<string, AnimacaoTextura> = {} as any;
    private estado: EstadoJogo = EstadoJogo.Ligando;

    constructor(
        private cg: IContextoGrafico,
        private arquivo_animacoes: string,
        public bixinho: Bixinho,
        private leitor_fs: ILeitorFS,
        private largura = 160,
        private altura = 144,
        private escala = 5,
        private fps = 10,

    )
    {

        this.cg.definir_nivel_log(4);
        this.cg.inicializar_janela(this.largura * escala, this.altura * escala, "oi");
        this.cg.definir_fps_alvo(this.fps);

        this.iniciar_texturas_basicas();
        this.gerenciador_texturas_bixinho = new GerenciadorTexturasBixinho(
            this.leitor_fs.conteudo_arquivo(this.arquivo_animacoes)
                .split("\n")
                .map((x) => x.trim())
                .filter((x) => x != "")
                .slice(2)
                .map((x) => x.split("|").map((y) => y.trim()).filter((y) => y != "")),
            cg);

    }

    private debug() {
        const texto = JSON.stringify(bixinho_estado(this.bixinho), null, 4);
        this.cg.desenhar_texto(texto, 0, 0, 16, 0xFFFFFFFF);
        console.log(JSON.stringify(bixinho_estado(this.bixinho)));

        if (this.cg.tecla_liberada(Tecla.Tecla_N)) {
            this.bixinho.nutricao.setar_estado_atual(prox_do_enum(EstadoNutricao, this.bixinho.nutricao.estado_atual()));
        }
        if (this.cg.tecla_liberada(Tecla.Tecla_H)) {
            this.bixinho.humor.setar_estado_atual(prox_do_enum(EstadoHumor, this.bixinho.humor.estado_atual()));
        }
        if (this.cg.tecla_liberada(Tecla.Tecla_E)) {
            this.bixinho.energia.setar_estado_atual(prox_do_enum(EstadoEnergia, this.bixinho.energia.estado_atual()));
        }
        if (this.cg.tecla_liberada(Tecla.Tecla_L)) {
            this.bixinho.higiene.setar_estado_atual(prox_do_enum(EstadoHigiene, this.bixinho.higiene.estado_atual()));
        }
        if (this.cg.tecla_liberada(Tecla.Tecla_S)) {
            this.bixinho.saude.setar_estado_atual(prox_do_enum(EstadoSaude, this.bixinho.saude.estado_atual()));
        }
    }

    private iniciar_texturas_basicas() {
        this.texturas_basicas["base_fundo"] = this.cg.criar_textura("recursos/imagens/bichov/base.PNG");

        this.botaos_basicos["botao_saude"] = this.cg.criar_botao("recursos/imagens/bichov/interface/saude.PNG", 0xFFFFFFFF, 0xACFFFFFF);
        this.botaos_basicos["botao_higiene"] = this.cg.criar_botao("recursos/imagens/bichov/interface/higiene.PNG", 0xFFFFFFFF, 0xACFFFFFF);
        this.botaos_basicos["botao_energia"] = this.cg.criar_botao("recursos/imagens/bichov/interface/energia.PNG", 0xFFFFFFFF, 0xACFFFFFF);

        this.animacoes_basicas["animacao_cabelo"] = this.cg.criar_animacao("recursos/imagens/bichov/cabelo", 4);
        this.animacoes_basicas["animacao_liga"] = this.cg.criar_animacao("recursos/imagens/bichov/liga_desliga", 1, false, -1);
        this.animacoes_basicas["animacao_desliga"] = this.cg.criar_animacao("recursos/imagens/bichov/liga_desliga", 1, false, 1);
    }

    private avancar_estado_jogo() {
        switch(this.estado) {
            case EstadoJogo.Ligando: {this.estado = EstadoJogo.Jogando} break;
            case EstadoJogo.Jogando: {this.estado = EstadoJogo.Desligando} break;
            case EstadoJogo.Desligando: {this.estado = EstadoJogo.Terminado} break;
            default: EstadoJogo.Terminado
        }
    }

    public update() {
        this.mousex = this.cg.obter_mouse_x();
        this.mousey = this.cg.obter_mouse_y();

        if(this.cg.janela_deve_fechar()) {
            this.estado = EstadoJogo.Desligando;
            return;
        }

        switch(this.estado) {
            case EstadoJogo.Ligando: { this.update_liga_desliga("animacao_liga"); } break;
            case EstadoJogo.Jogando: { this.update_jogando(); } break;
            case EstadoJogo.Desligando: { this.update_liga_desliga("animacao_desliga"); } break;
            case EstadoJogo.Terminado: { this.cg.fechar_janela(); } break;
        }
    }

    private update_liga_desliga(anim: string) {
        const animacao = this.animacoes_basicas[anim];
        animacao?.update();
        if(animacao?.terminada()) {
            this.avancar_estado_jogo();
        }
    }

    private update_jogando() {
        this.update_bixinho();
        this.animacoes_basicas["animacao_cabelo"]?.update();
        // controles...
    }

    public terminado(): boolean {
        return this.estado === EstadoJogo.Terminado;
    }

    private update_bixinho() {
        const animacao = this.gerenciador_texturas_bixinho.pegar_anim(this.bixinho);
        if (animacao) {
            animacao.update();
        }
    }

    public desenhar() {
        if(this.terminado()) { return; }
        this.cg.comecar_desenho();
        this.cg.limpar_fundo(0xFFFFFFFF);
        switch(this.estado) {
            case EstadoJogo.Ligando: { this.animar_ligar_desligar("animacao_liga"); } break;
            case EstadoJogo.Jogando: { this.desenhar_jogando() } break;
            case EstadoJogo.Desligando: { this.animar_ligar_desligar("animacao_desliga"); } break;
            default: break;
        }
        this.cg.terminar_desenho();
    }


    private desenhar_bixinho() {
        const animacao = this.gerenciador_texturas_bixinho.pegar_anim(this.bixinho);
        if (animacao) {
            animacao.desenhar(this.cg, 75, 64, this.escala, 0, 0xFFFFFFFF);
        }
    }

    private desenhar_interface() {
        this.texturas_basicas["base_fundo"]?.desenhar(this.cg, 0, 0, this.escala, 0, 0xFFFFFFFF);
        this.animacoes_basicas["animacao_cabelo"]?.desenhar(this.cg, 0, 21, this.escala, 0, 0xFFFFFFFF);

        const botao_saude = this.botaos_basicos["botao_saude"];
        const botao_higiene = this.botaos_basicos["botao_higiene"]
        const botao_energia = this.botaos_basicos["botao_energia"]

        botao_saude?.desenhar(this.cg, 0, 57, this.escala, 0, botao_saude.mouse_dentro(this.cg, this.mousex, this.mousey));
        botao_higiene?.desenhar(this.cg, 0, 71, this.escala, 0, botao_higiene.mouse_dentro(this.cg, this.mousex, this.mousey));
        botao_energia?.desenhar(this.cg, 0, 85, this.escala, 0, botao_energia.mouse_dentro(this.cg, this.mousex, this.mousey));
    }

    private animar_ligar_desligar(anim: string) {
        const animacao = this.animacoes_basicas[anim];
        if(animacao) {
            animacao.desenhar(this.cg, 0, 0, this.escala, 0, 0xFFFFFFFF);
        }
    }

    private desenhar_jogando() {
        this.desenhar_interface();
        this.desenhar_bixinho();
        this.debug();
    }

}
