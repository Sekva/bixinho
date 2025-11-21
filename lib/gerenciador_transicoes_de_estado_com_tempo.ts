export class GerenciadorTransicoesComTempo<T extends string | number | symbol> {
    private tempos_msegundos_passados = new Map<[T, T], number>();
    private tempos_segundos_objetivos = new Map<[T, T], number>();

    private tempo_transicao_passado(de: T, para: T): number {
        return this.tempos_msegundos_passados.get([de, para]) || 0;
    }

    private setar_tempo_transicao_passado(de: T, para: T, tempo: number) {
        const tempo_atual = this.tempo_transicao_passado(de, para);
        if(tempo_atual === 0 || tempo === 0) {
            this.tempos_msegundos_passados.set([de, para], tempo);
        }
    }

    limpar_tempo_transicao_passado(): void {
        this.tempos_msegundos_passados.clear();
    }

    private tempo_transicao_objetivo(de: T, para: T): number {
        return this.tempos_segundos_objetivos.get([de, para]) || 0;
    }

    private setar_tempo_transicao_objetivo(de: T, para: T, tempo: number) {
        const tempo_atual = this.tempo_transicao_objetivo(de, para);
        if(tempo_atual === 0 || tempo === 0) {
            this.tempos_segundos_objetivos.set([de, para], tempo);
        }
    }

    limpar_tempo_transicao_objetivo(): void {
        this.tempos_segundos_objetivos.clear();
    }

    verificar_tempo_no_estado(de: T, para: T, condicao: boolean): boolean {

        const tempo_passado_na_condicao = this.tempo_transicao_passado(de, para);
        const tempo_para_prox = this.tempo_transicao_objetivo(de, para);

        // Entrou pela primeira vez na condição, então seta o timestamp
        // se era 0, coloca o valor, se não era, não atualiza. só volta pra zero se for explicito
        // então pode chamar essa função verificar_tempo_no_estado quantas vezes quiser

        if(condicao) {
            this.setar_tempo_transicao_passado(de, para, Date.now());
        } else {
            this.setar_tempo_transicao_passado(de, para, 0);
        }

        return ((Date.now() - tempo_passado_na_condicao) >= tempo_para_prox * 1000) && condicao;
    }


    constructor(tempos_transicoes: Array<[T, T, number]>) {
        for (const [de, para, tempoSegundos] of tempos_transicoes) {
            this.setar_tempo_transicao_objetivo(de, para, tempoSegundos);
        }
    }
}
