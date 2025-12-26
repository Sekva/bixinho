import { Bixinho } from "../lib/bixinho";
import type { IContextoGrafico } from "../lib/interfaces_graficas";
import type { ILeitorFS } from "../lib/leitor_fs";
import { Jogo } from "./jogo";
import { ContextoGraficoHTML5 } from "./plataform/html5/main";
import { LeitorFS } from "./plataform/leitor_fs_web";

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
if (!canvas) {
    throw new Error("Canvas não encontrado! Verifique se o HTML tem um elemento com id='gameCanvas'");
}

const leitor_fs: ILeitorFS = new LeitorFS();
const cg: IContextoGrafico = new ContextoGraficoHTML5(canvas, leitor_fs);
let jogo = new Jogo(cg, "anins.org", new Bixinho("axolote"), leitor_fs, 160, 144, 5);

function gameLoop() {
    if (!jogo.terminado()) {
        jogo.desenhar();
        jogo.update();
        requestAnimationFrame(gameLoop);
    }
}
gameLoop();
