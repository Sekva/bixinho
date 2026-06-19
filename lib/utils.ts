import type { Bixinho, Marca } from "./bixinho";
import type { EstadoEnergia } from "./energia";
import type { Estagio } from "./estagio";
import type { EstadoHigiene } from "./higiene";
import type { EstadoHumor } from "./humor";
import type { EstadoNutricao } from "./nutricao";
import type { EstadoSaude } from "./saude";

/* Um segundo real / quantos segundos no jogo */
export const avanco_tempo = 1 / 1;

export const cartesianProduct = <T extends any[][]>(
    arrays: [...T],
): Array<{ [K in keyof T]: T[K][number] }> =>
    arrays.reduce((partialProduct, nextArray) =>
        partialProduct.flatMap((items) =>
            nextArray.map((nextItem) => [items, nextItem].flat()),
        ),
    );

export function obterValoresEnum<T extends object>(enumObj: T): Array<T[keyof T]> {
    const valores = Object.values(enumObj);
    return valores.filter(v =>
        typeof v === 'string' || typeof v === 'number'
    ) as Array<T[keyof T]>;
}

export interface Estado {
    marca: Marca;
    estagio: Estagio;
    saude: EstadoSaude;
    humor: EstadoHumor;
    energia: EstadoEnergia;
    nutricao: EstadoNutricao;
    higiene: EstadoHigiene;
}

export function bixinho_estado(bixinho: Bixinho) {

    const marca = bixinho.marca;
    const estagio = bixinho.estagio;
    const saude = bixinho.saude.estado_atual();
    const humor = bixinho.humor.estado_atual();
    const energia = bixinho.energia.estado_atual();
    const nutricao = bixinho.nutricao.estado_atual();
    const higiene = bixinho.higiene.estado_atual();

    const estado_bixinho: Estado = {
        marca,
        estagio,
        saude,
        humor,
        energia,
        nutricao,
        higiene
    };

    return estado_bixinho;
}


export function bixinho_estado_valores(bixinho: Bixinho) {

    const marca = bixinho.marca;
    const estagio = bixinho.estagio;
    const saude = bixinho.saude.nivel();
    const humor = bixinho.humor.nivel();
    const energia = bixinho.energia.nivel();
    const nutricao = bixinho.nutricao.nivel();
    const higiene = bixinho.higiene.nivel();

    const estado_bixinho_valores = {
        marca,
        estagio,
        saude,
        humor,
        energia,
        nutricao,
        higiene
    };

    return estado_bixinho_valores;
}




export function prox_do_enum<T extends object>(enumObj: T, atual: any): T[keyof T] {
    const itens = obterValoresEnum(enumObj);
    const idx = itens.indexOf(atual) + 1;
    let ret = itens[idx % itens.length];
    if (ret == undefined) {
        return atual;
    }
    return ret;
}
