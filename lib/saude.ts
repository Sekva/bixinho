import {Bixinho} from './bixinho';
import { GerenciadorNivelEstado } from './gerenciador_nivel_estado';

export enum  EstadoSaude {
  Saudavel,
  Doente,
  Critico,
  Morto
}

export class GerenciadorSaude extends GerenciadorNivelEstado<EstadoSaude> {

  avancar_estado(estado_atual:Readonly<EstadoSaude>, _bixinho: Readonly<Bixinho>): EstadoSaude {
    let prox = estado_atual;

    switch(estado_atual) {
        // case EstadoHigiene.Limpo: {prox = this.avancar_estado_limpo();} break;
        // case EstadoHigiene.Sujo: {prox = this.avancar_estado_sujo();} break;
        // case EstadoHigiene.Sujismundo: {prox = this.avancar_estado_sujismundo();} break;
    }

    if(estado_atual != prox) {
      this.gerenciador_transicoes_com_tempo.limpar_tempo_transicao_passado()
    }

    return prox;
  }

  constructor() {
    super(100, [
      // [EstadoHigiene.Sujo, EstadoHigiene.Sujismundo, 2 * 60 * 60] // 2 h
    ]);
  }

}
