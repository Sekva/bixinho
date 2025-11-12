import {Bixinho} from './bixinho';
import { EstadoConforto } from './conforto';
import { EstadoEnergia } from './energia';
import { GerenciadorNivelEstado } from './gerenciador_nivel_estado';
import { EstadoHigiene } from './higiene';
import { EstadoNutricao } from './nutricao';

export enum  EstadoSaude {
    Saudavel,
    Doente,
    Critico,
    Morto,

    DoenteFaminto,
    DoenteExausto,
    DoenteSujismundo
}

export class GerenciadorSaude extends GerenciadorNivelEstado<EstadoSaude> {

    avancar_estado_doente(bixinho: Readonly<Bixinho>): EstadoSaude {
        //TODO: remedio
        if(bixinho.saude.nivel() > 40 && bixinho.conforto.estado_atual() == EstadoConforto.Satisfeito) {
            return EstadoSaude.Saudavel;
        }

        if(bixinho.saude.nivel() < 20) {
            return EstadoSaude.Critico;
        }

        return EstadoSaude.Doente;
    }

    avancar_estado_critico(bixinho: Readonly<Bixinho>): EstadoSaude {
        if(bixinho.saude.nivel() >= 20) {
            return EstadoSaude.Doente;
        }

        if(bixinho.saude.nivel() < 1) {
            return EstadoSaude.Morto;
        }

        return EstadoSaude.Critico;
    }

    avancar_estado_morto(_bixinho: Readonly<Bixinho>): EstadoSaude { return EstadoSaude.Morto; }

    avancar_estado_saudavel(bixinho: Readonly<Bixinho>): EstadoSaude {
        if(this.gerenciador_transicoes_com_tempo.verificar_tempo_no_estado(EstadoSaude.Saudavel, EstadoSaude.DoenteFaminto, (bixinho.nutricao.estado_atual() == EstadoNutricao.Faminto))) {
            return EstadoSaude.DoenteFaminto;
        }

        if(this.gerenciador_transicoes_com_tempo.verificar_tempo_no_estado(EstadoSaude.Saudavel, EstadoSaude.DoenteExausto, (bixinho.energia.estado_atual() == EstadoEnergia.Exausto))) {
            return EstadoSaude.DoenteExausto;
        }

        if(this.gerenciador_transicoes_com_tempo.verificar_tempo_no_estado(EstadoSaude.Saudavel, EstadoSaude.DoenteSujismundo, (bixinho.higiene.estado_atual() == EstadoHigiene.Sujismundo))) {
            return EstadoSaude.DoenteSujismundo;
        }

        if(bixinho.saude.nivel() < 40) {
            return EstadoSaude.Doente;
        }

        return EstadoSaude.Saudavel;
    }

    avancar_estado(estado_atual:Readonly<EstadoSaude>, bixinho: Readonly<Bixinho>): EstadoSaude {
        let prox = estado_atual;

        switch(estado_atual) {
            case EstadoSaude.Saudavel: {prox = this.avancar_estado_saudavel(bixinho);} break;
            case EstadoSaude.Doente: {prox = this.avancar_estado_doente(bixinho);} break;
            case EstadoSaude.Critico: {prox = this.avancar_estado_critico(bixinho);} break;
            case EstadoSaude.Morto: {prox = this.avancar_estado_morto(bixinho);} break;

            case EstadoSaude.DoenteFaminto: {prox = EstadoSaude.Doente;} break;
            case EstadoSaude.DoenteExausto: {prox = EstadoSaude.Doente;} break;
            case EstadoSaude.DoenteSujismundo: {prox = EstadoSaude.Doente;} break;
        }

        if(estado_atual != prox) {
            this.gerenciador_transicoes_com_tempo.limpar_tempo_transicao_passado();
        }

        return prox;
    }

    constructor() {
        super(EstadoSaude.Saudavel, 100, [
            [EstadoSaude.Saudavel, EstadoSaude.DoenteFaminto, 2 * 60 * 60], // 2 h
            [EstadoSaude.Saudavel, EstadoSaude.DoenteExausto, 1 * 60 * 60], // 1 h
            [EstadoSaude.Saudavel, EstadoSaude.DoenteSujismundo, 4 * 60 * 60], // 4 h
        ]);
    }

}
