import  { raylib_path, raylib_interface, to_c_str, TexturaRaylib, BotaoRaylib, wrapRaylib, AnimacaoTexturaRaylib } from './plataform/raylib_linux/main'
import { ptr, dlopen, FFIType, CString } from "bun:ffi";
import type { Raylib } from './plataform/raylib_linux/raylib.gerada';
import { Bixinho } from '../lib/bixinho';
import { GerenciadorTexturas } from '../lib/gerenciador_texturas_bixinho';

const largura = 160;
const altura = 144;
const escala = 5;
const fps = 3;

// let bixinho = new Bixinho("axolote");
// let gerenciador_texturas = new GerenciadorTexturas(bixinho.marca);

let mousex: number = 0;
let mousey: number = 0;

// const { symbols: raylib, } = dlopen(raylib_path, raylib_interface);
const { symbols } = dlopen(raylib_path, raylib_interface);
const raylib: Raylib = wrapRaylib(symbols);

// raylib.SetTraceLogLevel(5);
raylib.InitWindow(largura * escala, altura * escala, "oi");
raylib.SetTargetFPS(fps);


















const base_fundo = new TexturaRaylib(raylib, "recursos/imagens/bichov/base.PNG");
const botao_saude = new BotaoRaylib(raylib, "recursos/imagens/bichov/interface/saude.PNG", 0xFFFFFFFF, 0xACFFFFFF);
const botao_higiene = new BotaoRaylib(raylib, "recursos/imagens/bichov/interface/higiene.PNG", 0xFFFFFFFF, 0xACFFFFFF);
const botao_energia = new BotaoRaylib(raylib, "recursos/imagens/bichov/interface/energia.PNG", 0xFFFFFFFF, 0xACFFFFFF);

const animacao_cabelo = await (new AnimacaoTexturaRaylib(raylib, "recursos/imagens/bichov/cabelo", 2).load());

while(!raylib.WindowShouldClose()) {
    mousex = raylib.GetMouseX();
    mousey = raylib.GetMouseY();

    raylib.BeginDrawing();
    raylib.ClearBackground(0xFFFFFFFF);
    base_fundo.desenhar(raylib, 0, 0, escala, 0, 0xFFFFFFFF);
    animacao_cabelo.desenhar(raylib, 0, 21, escala, 0, 0xFFFFFFFF);
    botao_saude.desenhar(raylib, 0, 57,escala, 0, botao_saude.mouse_dentro(raylib, mousex, mousey));
    botao_higiene.desenhar(raylib, 0, 71,escala, 0, botao_higiene.mouse_dentro(raylib, mousex, mousey));
    botao_energia.desenhar(raylib, 0, 85,escala, 0, botao_energia.mouse_dentro(raylib, mousex, mousey));
    raylib.EndDrawing();

    animacao_cabelo.update();
}

raylib.CloseWindow();
