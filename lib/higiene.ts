import {Bixinho} from './bixinho';
import { GerenciadorNivelEstado } from './gerenciador_nivel_estado';

export enum EstadoHigiene {
  Limpo,
  Sujo,
  Sujismundo
}

export class GerenciadorHigiene extends GerenciadorNivelEstado<EstadoHigiene> {


  avancar_estado_limpo(): EstadoHigiene {
    if(this.nivel() < 30) { return EstadoHigiene.Sujo; }
    return EstadoHigiene.Limpo;
  }

  avancar_estado_sujo(): EstadoHigiene{
    if(this.gerenciador_transicoes_com_tempo.verificar_tempo_no_estado(EstadoHigiene.Sujo, EstadoHigiene.Sujismundo, (this.nivel() === 0))) {
      return EstadoHigiene.Sujismundo;
    }

    if(this.nivel() >= 80) {
      return EstadoHigiene.Limpo;
    }

    return EstadoHigiene.Sujo;
  }

  avancar_estado_sujismundo(): EstadoHigiene{
    if(this.nivel() > 80) { return EstadoHigiene.Limpo; }
    return EstadoHigiene.Sujismundo;
  }

  avancar_estado(estado_atual:Readonly<EstadoHigiene>, _bixinho: Readonly<Bixinho>): EstadoHigiene {
    let prox = estado_atual;

    switch(estado_atual) {
      case EstadoHigiene.Limpo: {prox = this.avancar_estado_limpo();} break;
      case EstadoHigiene.Sujo: {prox = this.avancar_estado_sujo();} break;
      case EstadoHigiene.Sujismundo: {prox = this.avancar_estado_sujismundo();} break;
    }

    if(estado_atual != prox) {
      this.gerenciador_transicoes_com_tempo.limpar_tempo_transicao_passado()
    }

    return prox;
  }

  constructor() {
    super(100, [
      [EstadoHigiene.Sujo, EstadoHigiene.Sujismundo, 2 * 60 * 60] // 2 h
    ]);
  }
}
