import { exit } from "node:process";
import { AnimacaoTexturaRaylib, type TexturaRaylib } from "../src/plataform/raylib_linux/main";
import type { Raylib } from "../src/plataform/raylib_linux/raylib.gerada";
import { Bixinho, Marca } from "./bixinho";
import { EstadoEnergia } from "./energia";
import { Estagio } from "./estagio";
import { EstadoHigiene } from "./higiene";
import { EstadoHumor } from "./humor";
import { EstadoNutricao } from "./nutricao";
import { EstadoSaude } from "./saude";
import { bixinho_estado, type Estado } from "./utils";

function estados_iguais(a: Estado, b: Estado): boolean {
    let valores_a = Object.values(a);
    let valores_b = Object.values(b);

    if(valores_a.length != valores_b.length) { return false; }

    for(let i = 0; i < valores_a.length; i++) {
        if(valores_a[i] != "_" && valores_b[i] === "_") { valores_b[i] = valores_a[i]; }
        if(valores_b[i] != "_" && valores_a[i] === "_") { valores_a[i] = valores_b[i]; }
        if(valores_a[i] != valores_b[i]) { return false; }
    }

    return true;
}



export class GerenciadorTexturas {
    private readonly base: string = "recursos/imagens/bichov/ANIMAIS/"
    private animacoes: Map<Estado, AnimacaoTexturaRaylib> = new Map();
    private detalhes: Map<Estado, AnimacaoTexturaRaylib> = new Map();

    constructor(
        private mapa_anims: string[][]
    ) {}

    public async load(raylib: Raylib): Promise<GerenciadorTexturas> {
        for (const partes of this.mapa_anims) {

            const marca = partes[0] as Marca;
            const estagio = partes[1] as Estagio;
            const saude = partes[2] as EstadoSaude;
            const humor = partes[3] as EstadoHumor;
            const energia = partes[4] as EstadoEnergia;
            const nutricao = partes[5] as EstadoNutricao;
            const higiene = partes[6] as EstadoHigiene;

            const animacao = partes[7];

            const estado: Estado = {
                marca,
                estagio,
                saude,
                humor,
                energia,
                nutricao,
                higiene
            };

            this.animacoes.set(
                estado,
                await (new AnimacaoTexturaRaylib(raylib, `${this.base}${animacao}`)).load()
            );
        }
        return this;
    }

    public pegar_anim(bixinho: Bixinho): AnimacaoTexturaRaylib | undefined {

        for(let [estado, animacao] of this.animacoes) {
            if (estados_iguais(estado, bixinho_estado(bixinho))) {
                return animacao;
            }
        }
        return undefined;
    }

}
