import { Bixinho } from "../lib/bixinho";
import type { IContextoGrafico } from "../lib/interfaces_graficas";
import { Jogo } from "./jogo";
import { ContextoGraficoRaylib } from "./plataform/raylib_linux/main";

const raylib_path = `/home/sekva/dados/progamming/bixinho/libraylib_ffi.so`;
const cg: IContextoGrafico = new ContextoGraficoRaylib(raylib_path);

let jogo = new Jogo(cg, "anins.org", new Bixinho("axolote"));
while(!jogo.terminado()) {
    jogo.desenhar();
    jogo.update();
}
