import { KeyboardKey, ContextoGraficoRaylib } from './plataform/raylib_linux/main'
import type { IContextoGrafico, ITextura, IAnimacaoTextura, IBotao } from '../lib/interfaces_graficas';
import { Bixinho, Marca } from '../lib/bixinho';
import { GerenciadorTexturasBixinho } from '../lib/gerenciador_texturas_bixinho';
import { bixinho_estado, conteudo_arquivo, prox_do_enum } from '../lib/utils';
import { EstadoNutricao } from '../lib/nutricao';
import { EstadoHigiene } from '../lib/higiene';
import { EstadoHumor } from '../lib/humor';
import { EstadoEnergia } from '../lib/energia';
import { EstadoSaude } from '../lib/saude';

const largura = 160;
const altura = 144;
const escala = 5;
const fps = 10;


let mousex: number = 0;
let mousey: number = 0;

const raylib_path = `/home/sekva/dados/progamming/bixinho/libraylib_ffi.so`;
const cg: IContextoGrafico = new ContextoGraficoRaylib(raylib_path);

cg.definir_nivel_log(4);
cg.inicializar_janela(largura * escala, altura * escala, "oi");
cg.definir_fps_alvo(fps);

const base_fundo = cg.criar_textura("recursos/imagens/bichov/base.PNG");
const botao_saude = cg.criar_botao("recursos/imagens/bichov/interface/saude.PNG", 0xFFFFFFFF, 0xACFFFFFF);
const botao_higiene = cg.criar_botao("recursos/imagens/bichov/interface/higiene.PNG", 0xFFFFFFFF, 0xACFFFFFF);
const botao_energia = cg.criar_botao("recursos/imagens/bichov/interface/energia.PNG", 0xFFFFFFFF, 0xACFFFFFF);

const animacao_cabelo = cg.criar_animacao("recursos/imagens/bichov/cabelo", 4);
const animacao_liga = cg.criar_animacao("recursos/imagens/bichov/liga_desliga", 1, false, -1);
const animacao_desliga = cg.criar_animacao("recursos/imagens/bichov/liga_desliga", 1, false, 1);

let bixinho = new Bixinho("axolote");

let gerenciador_texturas = new GerenciadorTexturasBixinho(
    conteudo_arquivo("anins.org")
        .split("\n")
        .map((x) => x.trim())
        .filter((x) => x != "")
        .slice(2)
        .map((x) => x.split("|").map((y) => y.trim()).filter((y) => y != "")),
    cg);

function animar_ligar_desligar(animacao: IAnimacaoTextura, cg: IContextoGrafico) {
    while (!animacao.terminada()) {
        cg.comecar_desenho();
        cg.limpar_fundo(0xFFFFFFFF);
        animacao.desenhar(cg, 0, 0, escala, 0, 0xFFFFFFFF);
        animacao.update();
        cg.terminar_desenho();
    }
}

function desenhar_bixinho(cg: IContextoGrafico, bixinho: Bixinho) {
    const animacao = gerenciador_texturas.pegar_anim(bixinho);
    if (animacao) {
        animacao.desenhar(cg, 75, 64, escala, 0, 0xFFFFFFFF);
        animacao.update();
    }
}

function debug(cg: IContextoGrafico, bixinho: Bixinho): Bixinho {
    cg.desenhar_texto(JSON.stringify(bixinho_estado(bixinho), null, 4), 0, 0, 16, 0xFFFFFFFF);

    if (cg.tecla_liberada(KeyboardKey.KEY_N)) {
        bixinho.nutricao.setar_estado_atual(prox_do_enum(EstadoNutricao, bixinho.nutricao.estado_atual()));
    }

    if (cg.tecla_liberada(KeyboardKey.KEY_H)) {
        bixinho.humor.setar_estado_atual(prox_do_enum(EstadoHumor, bixinho.humor.estado_atual()));
    }

    if (cg.tecla_liberada(KeyboardKey.KEY_E)) {
        bixinho.energia.setar_estado_atual(prox_do_enum(EstadoEnergia, bixinho.energia.estado_atual()));
    }
    if (cg.tecla_liberada(KeyboardKey.KEY_L)) {
        bixinho.higiene.setar_estado_atual(prox_do_enum(EstadoHigiene, bixinho.higiene.estado_atual()));
    }
    if (cg.tecla_liberada(KeyboardKey.KEY_S)) {
        bixinho.saude.setar_estado_atual(prox_do_enum(EstadoSaude, bixinho.saude.estado_atual()));
    }

    return bixinho;
}

function desenhar_interface(cg: IContextoGrafico) {
    base_fundo.desenhar(cg, 0, 0, escala, 0, 0xFFFFFFFF);
    animacao_cabelo.desenhar(cg, 0, 21, escala, 0, 0xFFFFFFFF);
    animacao_cabelo.update();
    botao_saude.desenhar(cg, 0, 57, escala, 0, botao_saude.mouse_dentro(cg, mousex, mousey));
    botao_higiene.desenhar(cg, 0, 71, escala, 0, botao_higiene.mouse_dentro(cg, mousex, mousey));
    botao_energia.desenhar(cg, 0, 85, escala, 0, botao_energia.mouse_dentro(cg, mousex, mousey));
}

while (!cg.janela_deve_fechar()) {
    animar_ligar_desligar(animacao_liga, cg);

    mousex = cg.obter_mouse_x();
    mousey = cg.obter_mouse_y();
    cg.comecar_desenho();
    {
        cg.limpar_fundo(0xFFFFFFFF);
        desenhar_interface(cg);
        desenhar_bixinho(cg, bixinho);
        bixinho = debug(cg, bixinho);
    }
    cg.terminar_desenho();

}

animar_ligar_desligar(animacao_desliga, cg);
cg.fechar_janela();
