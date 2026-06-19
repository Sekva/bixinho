import { GerenciadorHumor } from './humor';
import { Estagio } from './estagio';
import { GerenciadorEnergia } from './energia';
import { GerenciadorNutricao } from './nutricao';
import { GerenciadorHigiene } from './higiene';
import { GerenciadorSaude } from './saude';
import { GerenciadorConforto } from './conforto';
import { SistemaCuidado } from './sistema_cuidado';
import { GerenciadorNivelEstado } from './gerenciador_nivel_estado';
import { avanco_tempo } from './utils';

export enum Marca {
    OXOLOTE = "Axolotl"
}

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

    marca: Marca;

    data_ultimo_update_ms: number;
    impedir_update: boolean;

    private tickar(minutos: number = 1) {
        const TAXA_DESCARREGAMENTO: number = 100 / (24 * 60); // ~0.0694
        const TAXA_ESFOMEAMENTO: number = 100 / (48 * 60); // ~0.0347

        let fator_fome = 1 + (1 - this.nutricao.nivel()/100) * 0.3;
        let fator_cansaco = 1 + (1 - this.energia.nivel()/100) * 0.5;

        this.energia.modificar_nivel(-(TAXA_DESCARREGAMENTO * minutos * fator_fome));
        this.nutricao.modificar_nivel(-(TAXA_ESFOMEAMENTO * minutos * fator_cansaco));
    }

    private atualizarGerenciador(gerenciador: GerenciadorNivelEstado<any>): void {
        const novoEstado = gerenciador.avancar_estado(gerenciador.estado_atual(), this);
        gerenciador.setar_estado_atual(novoEstado);
    }

    update() {

        if(this.impedir_update) {return;}

        const ms_desde_ultimo_update = Date.now() - this.data_ultimo_update_ms;
        const minutos_desde_ultimo_update = Math.floor(ms_desde_ultimo_update / (1 /* min */ * 60000 * avanco_tempo));

        this.atualizarGerenciador(this.humor);
        this.atualizarGerenciador(this.nutricao);
        this.atualizarGerenciador(this.energia);
        this.atualizarGerenciador(this.higiene);
        this.atualizarGerenciador(this.saude);
        this.atualizarGerenciador(this.conforto);

        if(minutos_desde_ultimo_update >= 1) {
            this.tickar(minutos_desde_ultimo_update);
            this.data_ultimo_update_ms = Date.now();
        }

    }

    constructor(nome: string) {
        this.nome = nome;
        this.estagio = Estagio.Adulto_Normal;
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

        this.marca = Marca.OXOLOTE;

        this.data_ultimo_update_ms = Date.now();

        this.impedir_update = false;

    }
}
