import {GerenciadorTransicoesComTempo} from './gerenciador_transicoes_de_estado_com_tempo'
import {Bixinho} from './bixinho';

export abstract class GerenciadorNivelEstado<T extends number> {

  protected gerenciador_transicoes_com_tempo: GerenciadorTransicoesComTempo<T>;
  private _estado_atual: T;
  private _nivel: number;

  estado_atual(): T { return this._estado_atual; }
  setar_estado_atual(novo_estado: T) { this._estado_atual = novo_estado; }
  modificar_nivel(em: number) {this._nivel += em;}
  nivel() { return this._nivel; }

  abstract avancar_estado(estado_atual:Readonly<T>, bixinho: Readonly<Bixinho>): T;

  constructor(nivel_inicial: number, tempos_transicoes: Array<[T, T, number]>) {
    this._nivel = nivel_inicial;
    this.gerenciador_transicoes_com_tempo = new GerenciadorTransicoesComTempo<T>(tempos_transicoes);
  }

}
