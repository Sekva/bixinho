import {Bixinho} from './bixinho';
import { GerenciadorNivelEstado } from './gerenciador_nivel_estado';

export enum EstadoEnergia {
    Carregado,
    ComSono,
    Exausto
}

export class GerenciadorEnergia extends GerenciadorNivelEstado<EstadoEnergia> {

    avancar_estado_carregado(): EstadoEnergia {
        if(this.nivel() < 20) { return EstadoEnergia.ComSono; }
        return EstadoEnergia.Carregado;
    }

    avancar_estado_comsono(): EstadoEnergia {
        if(this.gerenciador_transicoes_com_tempo.verificar_tempo_no_estado(EstadoEnergia.ComSono, EstadoEnergia.Exausto, (this.nivel() === 0))) {
            return EstadoEnergia.Exausto;
        }

        if(this.nivel() >= 80) {
            return EstadoEnergia.Carregado;
        }

        return EstadoEnergia.ComSono;
    }

    avancar_estado_exausto(): EstadoEnergia {
        if(this.nivel() >= 80) { return EstadoEnergia.Carregado }
        return EstadoEnergia.Exausto;
    }

    avancar_estado(estado_atual:Readonly<EstadoEnergia>, _bixinho: Readonly<Bixinho>): EstadoEnergia {
        let prox = estado_atual;

        switch(estado_atual) {
            case EstadoEnergia.Carregado: {prox = this.avancar_estado_carregado();} break;
            case EstadoEnergia.ComSono: {prox = this.avancar_estado_comsono();} break;
            case EstadoEnergia.Exausto: {prox = this.avancar_estado_exausto();} break;
        }

        if(estado_atual != prox) {
            this.gerenciador_transicoes_com_tempo.limpar_tempo_transicao_passado()
        }

        return prox;
    }

    constructor() {
        super(EstadoEnergia.Carregado, 100, [
            [EstadoEnergia.ComSono, EstadoEnergia.Exausto, 30 * 60] // 30 min
        ]);
    }
}
