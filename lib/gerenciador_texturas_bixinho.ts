import { Bixinho, Marca } from "./bixinho";
import { EstadoEnergia } from "./energia";
import { Estagio } from "./estagio";
import { EstadoHigiene } from "./higiene";
import { EstadoHumor } from "./humor";
import { EstadoNutricao } from "./nutricao";
import { EstadoSaude } from "./saude";
import { bixinho_estado, type Estado } from "./utils";
import type { IContextoGrafico, AnimacaoTextura, ITextura } from "./interfaces_graficas";

function estados_iguais(a: Estado, b: Estado): boolean {
    let valores_a = Object.values(a);
    let valores_b = Object.values(b);

    if (valores_a.length != valores_b.length) { return false; }

    for (let i = 0; i < valores_a.length; i++) {
        if (valores_a[i] != "_" && valores_b[i] === "_") { valores_b[i] = valores_a[i]; }
        if (valores_b[i] != "_" && valores_a[i] === "_") { valores_a[i] = valores_b[i]; }
        if (valores_a[i] != valores_b[i]) { return false; }
    }

    return true;
}

export class GerenciadorTexturasBixinho {
    private readonly base: string = "recursos/imagens/bichov/ANIMAIS/"
    private animacoes: Map<Estado, AnimacaoTextura> = new Map();
    private detalhes: Map<Estado, ITextura> = new Map();

    constructor(
        private mapa_anims: string[][],
        cg: IContextoGrafico
    ) {
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
                cg.criar_animacao(`${this.base}${animacao}`)
            );
        }
    }

    public pegar_anim(bixinho: Bixinho): AnimacaoTextura | undefined {
        // const estado = this.animacoes.keys().toArray()[2] as Estado;
        // console.log(estado);
        // console.log(bixinho_estado(bixinho));
        // console.log(estados_iguais(estado, bixinho_estado(bixinho)));
        for (let [estado, animacao] of this.animacoes) {
            if (estados_iguais(estado, bixinho_estado(bixinho))) {
                return animacao;
            }
        }
        return undefined;
    }

    public pegar_detalhe(bixinho: Bixinho): ITextura | undefined {
        for (let [estado, detalhe] of this.detalhes) {
            if (estados_iguais(estado, bixinho_estado(bixinho))) {
                return detalhe;
            }
        }
        return undefined;
    }

}
