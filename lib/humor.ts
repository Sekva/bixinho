import { Bixinho } from './bixinho';
import { GerenciadorNivelEstado } from './gerenciador_nivel_estado';

export enum EstadoHumor {
    Normal = "Normal",
    Feliz = "Feliz",
    Irritado = "Irritado",
    Triste = "Triste"
}

export class GerenciadorHumor  extends GerenciadorNivelEstado<EstadoHumor> {

    avancar_estado_normal(bixinho: Readonly<Bixinho>): EstadoHumor {
        if(bixinho.nutricao.nivel() > 80 && this.nivel() > 80 && bixinho.higiene.nivel() > 80) {
            return EstadoHumor.Feliz;
        }

        if(bixinho.nutricao.nivel() < 30 || this.nivel() < 30) {
            return EstadoHumor.Irritado;
        }

        return EstadoHumor.Normal;
    }

    avancar_estado_feliz(bixinho: Readonly<Bixinho>): EstadoHumor {
        if(bixinho.nutricao.nivel() <= 80 || this.nivel() <= 80) {
            return EstadoHumor.Normal;
        }

        return EstadoHumor.Feliz;
    }

    avancar_estado_irritado(bixinho: Readonly<Bixinho>): EstadoHumor {
        // Irritado -> Normal
        if(this.gerenciador_transicoes_com_tempo.verificar_tempo_no_estado(EstadoHumor.Irritado, EstadoHumor.Normal, (bixinho.nutricao.nivel() > 50 && this.nivel() > 50))) {
            return EstadoHumor.Normal;
        }

        // Irritado -> Triste
        if(this.gerenciador_transicoes_com_tempo.verificar_tempo_no_estado(EstadoHumor.Irritado, EstadoHumor.Triste, (bixinho.nutricao.nivel() < 15 && this.nivel() < 15))) {
            return EstadoHumor.Triste;
        }

        // Mantém irritado
        return EstadoHumor.Irritado;
    }


    avancar_estado_triste(bixinho: Readonly<Bixinho>): EstadoHumor {
        // Triste -> Irritado
        if(this.gerenciador_transicoes_com_tempo.verificar_tempo_no_estado(EstadoHumor.Triste, EstadoHumor.Irritado, (bixinho.nutricao.nivel() > 30 && this.nivel() > 30))) {
            return EstadoHumor.Irritado;
        }

        return EstadoHumor.Triste;
    }

    avancar_estado(humor_atual: Readonly<EstadoHumor>, bixinho: Readonly<Bixinho>): EstadoHumor {
        let prox = humor_atual;

        switch(humor_atual) {
            case EstadoHumor.Normal: {prox = this.avancar_estado_normal(bixinho);} break;
            case EstadoHumor.Feliz: {prox = this.avancar_estado_feliz(bixinho);} break;
            case EstadoHumor.Irritado: {prox = this.avancar_estado_irritado(bixinho);} break;
            case EstadoHumor.Triste: {prox = this.avancar_estado_triste(bixinho);} break;
        }

        // Se mudou o estado, limpa todos os tempos dentro dos estados
        if(humor_atual != prox) {
            this.gerenciador_transicoes_com_tempo.limpar_tempo_transicao_passado()
        }

        return prox;
    }


    constructor() {
        super(EstadoHumor.Normal, 100, [
            [EstadoHumor.Irritado, EstadoHumor.Normal, 2 * 60 * 60],   // 2 horas
            [EstadoHumor.Irritado, EstadoHumor.Triste, 2 * 60 * 60],   // 2 horas
            [EstadoHumor.Triste, EstadoHumor.Irritado, 3 * 60 * 60],   // 3 horas
        ]);
    }
}
