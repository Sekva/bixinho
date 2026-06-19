# bixinho

`bixinho` e um jogo de bichinho virtual em TypeScript. O projeto tem duas formas de abrir: pelo navegador, que e o caminho mais simples para testar, e pelo alvo nativo Linux com Raylib.

## Abrir o jogo

### Web

Requisitos:

- Bun instalado.

Rode:

```bash
bun install
make serve
```

Depois abra:

```text
http://localhost:3000
```

O alvo `make serve` gera o `bundle.js` a partir de `src/web.ts` e sobe o servidor local em `src/server.ts`. Esse servidor tambem permite que o jogo liste os arquivos de sprites no navegador.

Para gerar apenas o bundle web:

```bash
make web
```

### Nativo Linux

Requisitos:

- Bun instalado.
- `gcc`.
- Raylib instalada no sistema, com a biblioteca disponivel para linkagem como `-lraylib`.

Rode:

```bash
bun install
make
```

Esse comando compila `libraylib_ffi.so`, gera a interface TypeScript da Raylib e executa `src/nativo.ts`.

### Controles atuais

- `ESC`: fecha o jogo.
- `N`: alterna o estado de nutricao no modo debug.
- `H`: alterna o estado de humor no modo debug.
- `E`: alterna o estado de energia no modo debug.
- `L`: alterna o estado de higiene no modo debug.
- `S`: alterna o estado de saude no modo debug.

## Contribuir com codigo

### Setup

Instale as dependencias:

```bash
bun install
```

Cheque tipagem e build web:

```bash
bunx tsc --noEmit
bun run build:web
```

Quando houver testes versionados, rode:

```bash
bun test
```

### Estrutura do projeto

- `lib/`: modelo do jogo, estados do bichinho, regras de transicao e utilitarios.
- `src/jogo.ts`: orquestra loop, update, desenho, interface e debug.
- `src/web.ts`: entrada do jogo no navegador.
- `src/nativo.ts`: entrada do jogo nativo via Raylib.
- `src/plataform/html5/`: implementacao grafica para canvas HTML5.
- `src/plataform/raylib_linux/`: implementacao grafica nativa usando Raylib via FFI.
- `src/plataform/leitor_fs_*`: adaptadores de leitura de arquivos para web e nativo.
- `bichov.kra`: arquivo-fonte dos sprites no Krita.
- `recursos/imagens/`: imagens exportadas localmente para o jogo.
- `anins.org`: tabela que mapeia combinacoes de estado para pastas de animacao.
- `maquinas.mmd`: fonte de referencia para as maquinas de estado e regras de transicao.

### Antes de mudar regras

Use `maquinas.mmd` como referencia principal para as transicoes. Se uma mudanca alterar comportamento de saude, humor, energia, nutricao, higiene, conforto, perfil ou evolucao, atualize o codigo em `lib/` mantendo a regra documentada no diagrama.

### Fluxo de sprites

Os sprites vem do arquivo `bichov.kra`, feito no Krita. Para atualizar as imagens usadas pelo jogo, exporte o arquivo layer a layer, mantendo os grupos como pastas, para gerar:

```text
recursos/imagens/bichov
```

A pasta `recursos/imagens/bichov` e uma exportacao local gerada a partir do `.kra`. Ela fica ignorada pelo Git, junto com o resto de `recursos/imagens/*`, deixando o repositorio guardar a fonte editavel em `bichov.kra`.

Depois de exportar sprites novos, confira se o caminho existe em `recursos/imagens/bichov` e se a combinacao correspondente esta registrada em `anins.org`.

### Artefatos gerados

Estes arquivos sao gerados localmente e nao precisam ser commitados:

- `bundle.js`
- `libraylib_ffi.so`
- `src/plataform/raylib_linux/raylib.gerada.d.ts`

Para limpar esses artefatos:

```bash
make clean
```

A exportacao de sprites em `recursos/imagens/bichov` tambem e gerada localmente, mas deve ser atualizada ou removida manualmente a partir do fluxo do Krita.
