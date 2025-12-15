import type { TexturaRaylib } from "../src/plataform/raylib_linux/main";
import type { Raylib } from "../src/plataform/raylib_linux/raylib.gerada";
import { Marca } from "./bixinho";
import { EstadoEnergia } from "./energia";
import { EstadoHigiene } from "./higiene";
import type { EstadoHumor } from "./humor";
import { EstadoNutricao } from "./nutricao";
import type { EstadoSaude } from "./saude";

type Estado =
    | EstadoHigiene
    | EstadoEnergia
    | EstadoNutricao
    | EstadoSaude
    | EstadoHumor;

export class GerenciadorTexturas {
    marca: Marca;
    // dict: { [estado:number]: string }= {};

    constructor(marca: Marca) {
        this.marca = marca;

        switch(this.marca) {
            case Marca.OXOLOTE: { this.carregar_texturas_oxolote() }; break;
        }
    }

    private carregar_texturas_oxolote() {

        function carregar_texturas_oxolote(raylib: Raylib): Record<Estado, TexturaRaylib> {
            const tex: Record<Estado, TexturaRaylib> = {} as any;

            // tex[EstadoHigiene.LIMPO] = new TexturaRaylib(raylib, "limpo.png");
            // tex[EstadoHigiene.SUJO] = new TexturaRaylib(raylib, "sujo.png");

            // tex[EstadoEnergia.ACORDADO] = new TexturaRaylib(raylib, "acordado.png");
            // tex[EstadoEnergia.DORMINDO] = new TexturaRaylib(raylib, "dormindo.png");

            // tex[EstadoNutricao.COM_FOME] = new TexturaRaylib(raylib, "fome.png");
            // tex[EstadoNutricao.CHEIO] = new TexturaRaylib(raylib, "cheio.png");

            // tex[EstadoSaude.BEM] = new TexturaRaylib(raylib, "bem.png");
            // tex[EstadoSaude.DOENTE] = new TexturaRaylib(raylib, "doente.png");

            // tex[EstadoHumor.FELIZ] = new TexturaRaylib(raylib, "feliz.png");
            // tex[EstadoHumor.TRISTE] = new TexturaRaylib(raylib, "triste.png");

            return tex;
        }


    }

}
