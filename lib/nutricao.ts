import {Bixinho} from './bixinho';
import { GerenciadorNivelEstado } from './gerenciador_nivel_estado';

export enum EstadoNutricao {
    Buxinxei = "Buxinxei",
    ComFome = "Com Fome",
    Faminto = "Faminto"
}

export class GerenciadorNutricao extends GerenciadorNivelEstado<EstadoNutricao> {


    avancar_estado_buxinxei(): EstadoNutricao {
        if(this.nivel() < 30) { return EstadoNutricao.ComFome; }
        return EstadoNutricao.Buxinxei;
    }

    avancar_estado_comfome(): EstadoNutricao{
        if(this.gerenciador_transicoes_com_tempo.verificar_tempo_no_estado(EstadoNutricao.ComFome, EstadoNutricao.Faminto, (this.nivel() === 0))) {
            return EstadoNutricao.Faminto;
        }

        if(this.nivel() >= 70) {
            return EstadoNutricao.Buxinxei;
        }

        return EstadoNutricao.ComFome;
    }

    avancar_estado_faminto(): EstadoNutricao{
        if(this.nivel() > 70) { return EstadoNutricao.Buxinxei; }
        return EstadoNutricao.Faminto;
    }

    avancar_estado(estado_atual:Readonly<EstadoNutricao>, _bixinho: Readonly<Bixinho>): EstadoNutricao {
        let prox = estado_atual;

        switch(estado_atual) {
            case EstadoNutricao.Buxinxei: {prox = this.avancar_estado_buxinxei();} break;
            case EstadoNutricao.ComFome: {prox = this.avancar_estado_comfome();} break;
            case EstadoNutricao.Faminto: {prox = this.avancar_estado_faminto();} break;
        }

        if(estado_atual != prox) {
            this.gerenciador_transicoes_com_tempo.limpar_tempo_transicao_passado()
        }

        return prox;
    }

    constructor() {
        super(EstadoNutricao.Buxinxei, 100, [
            [EstadoNutricao.ComFome, EstadoNutricao.Faminto, 60 * 60] // 60 min
        ]);
    }
}
