import { GerenciadorHumor } from './humor';
import { Estagio } from './estagio';
import { GerenciadorEnergia } from './energia';
import { GerenciadorNutricao } from './nutricao';
import { GerenciadorHigiene } from './higiene';
import { GerenciadorSaude } from './saude';
import { GerenciadorConforto } from './conforto';
import { SistemaCuidado } from './sistema_cuidado';

export class Bixinho {
    nome: string;
    estagio: Estagio;
    idade: number;

    treinos: number;
    batalhas: number;
    limpezar: number;

    sistema_cuidados: SistemaCuidado;

    nutricao: GerenciadorNutricao;
    humor: GerenciadorHumor;
    energia: GerenciadorEnergia;
    higiene: GerenciadorHigiene;
    saude: GerenciadorSaude;
    conforto: GerenciadorConforto;

    constructor() {
        this.nome = "";
        this.estagio = Estagio.Ovo;
        this.idade = 0;

        this.treinos = 0;
        this.batalhas = 0;
        this.limpezar = 0;
        this.sistema_cuidados = new SistemaCuidado();

        this.nutricao = new GerenciadorNutricao();
        this.humor = new GerenciadorHumor();
        this.energia = new GerenciadorEnergia();
        this.higiene = new GerenciadorHigiene();
        this.saude = new GerenciadorSaude();
        this.conforto = new GerenciadorConforto();
    }
}
