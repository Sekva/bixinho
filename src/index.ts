import  { raylib_path, raylib_interface, to_c_str, TexturaRaylib, BotaoRaylib, wrapRaylib, AnimacaoTexturaRaylib, KeyboardKey } from './plataform/raylib_linux/main'
import { dlopen } from "bun:ffi";
import type { Raylib } from './plataform/raylib_linux/raylib.gerada';
import { Bixinho, Marca } from '../lib/bixinho';
import { GerenciadorTexturasBixinho } from '../lib/gerenciador_texturas_bixinho';
import { bixinho_estado, conteudo_arquivo, prox_do_enum } from '../lib/utils';
import { EstadoNutricao } from '../lib/nutricao';
import { EstadoHigiene } from '../lib/higiene';
import { EstadoHumor } from '../lib/humor';
import { EstadoEnergia } from '../lib/energia';
import { EstadoSaude } from '../lib/saude';
import { exit } from 'process';

const largura = 160;
const altura = 144;
const escala = 5;
const fps = 10;


let mousex: number = 0;
let mousey: number = 0;

const { symbols } = dlopen(raylib_path, raylib_interface);
const raylib: Raylib = wrapRaylib(symbols);

raylib.SetTraceLogLevel(4);
raylib.InitWindow(largura * escala, altura * escala, "oi");
raylib.SetTargetFPS(fps);

const base_fundo = new TexturaRaylib(raylib, "recursos/imagens/bichov/base.PNG");
const botao_saude = new BotaoRaylib(raylib, "recursos/imagens/bichov/interface/saude.PNG", 0xFFFFFFFF, 0xACFFFFFF);
const botao_higiene = new BotaoRaylib(raylib, "recursos/imagens/bichov/interface/higiene.PNG", 0xFFFFFFFF, 0xACFFFFFF);
const botao_energia = new BotaoRaylib(raylib, "recursos/imagens/bichov/interface/energia.PNG", 0xFFFFFFFF, 0xACFFFFFF);

const animacao_cabelo = new AnimacaoTexturaRaylib(raylib, "recursos/imagens/bichov/cabelo", 4);
const animacao_liga = new AnimacaoTexturaRaylib(raylib, "recursos/imagens/bichov/liga_desliga", 1, false,  -1);
const animacao_desliga = new AnimacaoTexturaRaylib(raylib, "recursos/imagens/bichov/liga_desliga", 1, false, 1);

let bixinho = new Bixinho("axolote");

let gerenciador_texturas = new GerenciadorTexturasBixinho(
    conteudo_arquivo("anins.org")
        .split("\n")
        .map((x) => x.trim())
        .filter((x) => x != "")
        .slice(2)
        .map((x) => x.split("|").map((y) => y.trim()).filter((y) => y != "")),
    raylib);

function animar_ligar_desligar(animacao: AnimacaoTexturaRaylib, raylib: Raylib) {
    while(!animacao.terminada()) {
        raylib.BeginDrawing();
        raylib.ClearBackground(0xFFFFFFFF);
        animacao.desenhar(raylib, 0, 0, escala, 0, 0xFFFFFFFF);
        animacao.update();
        raylib.EndDrawing();
    }
}

function desenhar_bixinho(raylib: Raylib, bixinho: Bixinho) {
    const animacao = gerenciador_texturas.pegar_anim(bixinho);
    if(animacao) {
        animacao.desenhar(raylib, 75, 64, escala, 0, 0xFFFFFFFF);
        animacao.update();
    }
}

function debug(bixinho: Bixinho): Bixinho {
    raylib.DrawText(JSON.stringify(bixinho_estado(bixinho), null, 4), 0, 0, 16, 0xFFFFFFFF);

    if(raylib.IsKeyReleased(KeyboardKey.KEY_N)) {
        bixinho.nutricao.setar_estado_atual(prox_do_enum(EstadoNutricao, bixinho.nutricao.estado_atual()));
    }

    if(raylib.IsKeyReleased(KeyboardKey.KEY_H)) {
        bixinho.humor.setar_estado_atual(prox_do_enum(EstadoHumor, bixinho.humor.estado_atual()));
    }

    if(raylib.IsKeyReleased(KeyboardKey.KEY_E)) {
        bixinho.energia.setar_estado_atual(prox_do_enum(EstadoEnergia, bixinho.energia.estado_atual()));
    }
    if(raylib.IsKeyReleased(KeyboardKey.KEY_L)) {
        bixinho.higiene.setar_estado_atual(prox_do_enum(EstadoHigiene, bixinho.higiene.estado_atual()));
    }
    if(raylib.IsKeyReleased(KeyboardKey.KEY_S)) {
        bixinho.saude.setar_estado_atual(prox_do_enum(EstadoSaude, bixinho.saude.estado_atual()));
    }

    return bixinho;
}

function desenhar_interface() {
    base_fundo.desenhar(raylib, 0, 0, escala, 0, 0xFFFFFFFF);
    animacao_cabelo.desenhar(raylib, 0, 21, escala, 0, 0xFFFFFFFF);
    animacao_cabelo.update();
    botao_saude.desenhar(raylib, 0, 57,escala, 0, botao_saude.mouse_dentro(raylib, mousex, mousey));
    botao_higiene.desenhar(raylib, 0, 71,escala, 0, botao_higiene.mouse_dentro(raylib, mousex, mousey));
    botao_energia.desenhar(raylib, 0, 85,escala, 0, botao_energia.mouse_dentro(raylib, mousex, mousey));
}

while(!raylib.WindowShouldClose()) {
    animar_ligar_desligar(animacao_liga, raylib);

    mousex = raylib.GetMouseX();
    mousey = raylib.GetMouseY();
    raylib.BeginDrawing();
    {
        raylib.ClearBackground(0xFFFFFFFF);
        desenhar_interface();
        desenhar_bixinho(raylib, bixinho);
        bixinho = debug(bixinho);
    }
    raylib.EndDrawing();

}

animar_ligar_desligar(animacao_desliga, raylib);
raylib.CloseWindow();
