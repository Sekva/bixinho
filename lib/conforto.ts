import {Bixinho} from './bixinho';
import { EstadoEnergia } from './energia';
import { GerenciadorNivelEstado } from './gerenciador_nivel_estado';
import { EstadoHigiene } from './higiene';
import { EstadoNutricao } from './nutricao';
import { EstadoSaude } from './saude';

export enum EstadoConforto {
    Satisfeito,
    Desconfortavel
}

export class GerenciadorConforto extends GerenciadorNivelEstado<EstadoConforto> {

    avancar_estado_satisfeito(bixinho: Readonly<Bixinho>): EstadoConforto {
        if(bixinho.saude.estado_atual() == EstadoSaude.Doente) {
            return EstadoConforto.Desconfortavel;
        }

        return EstadoConforto.Satisfeito;
    }

    avancar_estado_desconfortavel(bixinho: Readonly<Bixinho>): EstadoConforto {

        if(this.gerenciador_transicoes_com_tempo.verificar_tempo_no_estado(EstadoConforto.Desconfortavel, EstadoConforto.Satisfeito,
                                                                           (bixinho.energia.estado_atual() === EstadoEnergia.Carregado
                                                                               && bixinho.higiene.estado_atual() === EstadoHigiene.Limpo
                                                                               && bixinho.nutricao.estado_atual() === EstadoNutricao.Buxinxei))) {
            return EstadoConforto.Satisfeito;
        }

        return EstadoConforto.Desconfortavel;
    }

    avancar_estado(estado_atual: Readonly<EstadoConforto>, bixinho: Readonly<Bixinho>): EstadoConforto {
        let prox = estado_atual;

        switch(estado_atual) {
            case EstadoConforto.Satisfeito: {prox = this.avancar_estado_satisfeito(bixinho);} break;
            case EstadoConforto.Desconfortavel: {prox = this.avancar_estado_desconfortavel(bixinho);} break;
        }

        // Se mudou o estado, limpa todos os tempos dentro dos estados
        if(estado_atual != prox) {
            this.gerenciador_transicoes_com_tempo.limpar_tempo_transicao_passado()
        }

        return prox;
    }

    constructor () {
        super(EstadoConforto.Satisfeito, 0,[
            [EstadoConforto.Desconfortavel, EstadoConforto.Satisfeito, 2 * 60 * 60],   // 2 horas
        ]);
    }
}
