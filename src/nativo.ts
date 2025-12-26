import { Bixinho } from "../lib/bixinho";
import type { IContextoGrafico } from "../lib/interfaces_graficas";
import type { ILeitorFS } from "../lib/leitor_fs";
import { Jogo } from "./jogo";
import { LeitorFS } from "./plataform/leitor_fs_nativo";

const { ContextoGraficoRaylib } = await import("./plataform/raylib_linux/main");
const raylib_path = `/home/sekva/dados/progamming/bixinho/libraylib_ffi.so`;
const leitor_fs: ILeitorFS = new LeitorFS()
const cg: IContextoGrafico = new ContextoGraficoRaylib(raylib_path, leitor_fs);
let jogo = new Jogo(cg, "anins.org", new Bixinho("axolote"), leitor_fs);
while (!jogo.terminado()) {
    jogo.desenhar();
    jogo.update();
}
