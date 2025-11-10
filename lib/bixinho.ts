import { GerenciadorHumor } from './humor';
import { Estagio } from './estagio';
import { GerenciadorEnergia } from './energia';
import { GerenciadorNutricao } from './nutricao';
import { GerenciadorHigiene } from './higiene';
import { GerenciadorSaude } from './saude';

export class Bixinho {
  nome: string;
  estagio: Estagio;
  idade: number;

  nutricao: GerenciadorNutricao;
  humor: GerenciadorHumor;
  energia: GerenciadorEnergia;
  higiene: GerenciadorHigiene;
  saude: GerenciadorSaude;

  constructor() {
    this.nome = "";
    this.estagio = Estagio.Ovo;
    this.idade = 0;

    this.nutricao = new GerenciadorNutricao();
    this.humor = new GerenciadorHumor();
    this.energia = new GerenciadorEnergia();
    this.higiene = new GerenciadorHigiene();
    this.saude = new GerenciadorSaude();

  }
}
