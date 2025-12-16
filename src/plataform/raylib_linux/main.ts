import { ptr, dlopen, FFIType } from "bun:ffi";
import type { Raylib } from "./raylib.gerada.d.ts";
import { readdir } from "node:fs/promises";

export const raylib_interface = {
    InitWindow: {
        args: [FFIType.i32, FFIType.i32, FFIType.cstring],
        returns: FFIType.void,
    },
    WindowShouldClose: {
        args: [],
        returns: FFIType.bool,
    },

    SetTraceLogLevel: {
        args: [FFIType.i32],
        returns: FFIType.void,
    },

    CloseWindow: {
        args: [],
        returns: FFIType.void
    },

    SetTargetFPS: {
        args: [FFIType.i32],
        returns: FFIType.void,
    },

    BeginDrawing: {
        args: [],
        returns: FFIType.void
    },

    EndDrawing: {
        args: [],
        returns: FFIType.void
    },

    ClearBackground: {
        args: [FFIType.u32],
        returns: FFIType.void
    },

    DrawText: {
        args:[FFIType.cstring, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.u32],
        returns: FFIType.void
    },

    DirectoryExists: {
        args: [FFIType.cstring],
        returns: FFIType.bool,
    },

    LoadTexturePtr: {
        args: [FFIType.cstring],
        returns: FFIType.ptr,
    },
    DrawTexturePtr: {
        args: [FFIType.ptr, FFIType.i32, FFIType.i32, FFIType.u32],
        returns: FFIType.void,
    },
    UnloadTexturePtr: {
        args: [FFIType.ptr],
        returns: FFIType.void,
    },

    DrawTextureExPtr: {
        args: [FFIType.ptr, FFIType.i32, FFIType.i32, FFIType.float, FFIType.float, FFIType.u32],
        returns: FFIType.void,
    },

    GetMouseX: {
        args: [],
        returns: FFIType.i32,
    },

    GetMouseY: {
        args: [],
        returns: FFIType.i32,
    },

    TextureGetWidth: {
        args: [FFIType.ptr],
        returns: FFIType.i32,
    },

    TextureGetHeight: {
        args: [FFIType.ptr],
        returns: FFIType.i32,
    },

};

export const raylib_path = `/home/sekva/dados/progamming/bixinho/libraylib_ffi.so`;

// const _cStringPool = new Set<Uint8Array>();
export function to_c_str(str: string) {
    const buf = new TextEncoder().encode(str + "\0");
    // _cStringPool.add(buf); // mantém referência viva
    return ptr(buf);       // ponteiro para os bytes
}

export class TexturaRaylib {
    public caminho_imagem = "";
    private textura: number = 0;
    constructor(raylib: Raylib, caminho_imagem: string) {
        this.textura = raylib.LoadTexturePtr(to_c_str(caminho_imagem));
    }

    public desenhar(raylib: Raylib, x: number, y: number, escala: number, rotacao: number, tint: number) {
        raylib.DrawTextureExPtr(this.textura, x*escala, y*escala, escala, rotacao, tint);
    }

    public unload(raylib: Raylib) {
        raylib.UnloadTexturePtr(this.textura);
    }

    public largura(raylib: Raylib): number {
        return raylib.TextureGetWidth(this.textura)
    }

    public altura(raylib: Raylib): number {
        return raylib.TextureGetHeight(this.textura)
    }

}

export class AnimacaoTexturaRaylib {
    private frame_atual: number = 0;
    private frames: TexturaRaylib[] = [];
    public altura: number = 0;
    public largura: number = 0;
    public carregado: boolean = false;

    constructor(
        private raylib: Raylib,
        private diretorio_frames: string,
        private stops: number = 2
    ) {}
    private s2 = 0;

    async load() {
        const arquivos = (await readdir(this.diretorio_frames))
                             .map(nome => this.diretorio_frames + "/" + nome)
                             .sort();

        for (const arq of arquivos) {
            const textura = new TexturaRaylib(this.raylib, arq);
            this.frames.push(textura);
            this.altura = Math.max(this.altura, textura.altura(this.raylib));
            this.largura = Math.max(this.largura, textura.largura(this.raylib));
        }

        this.carregado = true;
        return this;
    }

    public update() {
        if(this.s2 % 2 == this.stops) {
            this.frame_atual = (this.frame_atual + 1) % this.frames.length;
        }

        this.s2 = (this.s2 + 1) % 100;
    }

    public desenhar(raylib: Raylib, x: number, y: number, escala: number, rotacao: number, tint: number) {
        console.log(this.frame_atual)
        this.frames[this.frame_atual]?.desenhar(raylib, x, y, escala, rotacao, tint);
    }

    public unload(raylib: Raylib) {
        this.frames.forEach((textura) => textura.unload(raylib));
    }

}


export class BotaoRaylib {
    private textura: TexturaRaylib;
    public tint: number;
    public tint_sobre: number;
    private ultimo_x: number = 0;
    private ultimo_y: number = 0;
    private ultima_escala: number = 0;

    constructor(raylib: Raylib, caminho_imagem: string, tint: number, tint_sobre: number) {
        this.textura = new TexturaRaylib(raylib, caminho_imagem);
        this.tint = tint;
        this.tint_sobre = tint_sobre;
    }

    public unload(raylib: Raylib) {
        this.textura.unload(raylib);
    }

    public desenhar(raylib: Raylib, x: number, y: number, escala: number, rotacao: number, destaque: boolean) {
        let cor_destaque;
        if (destaque) {
            cor_destaque = this.tint_sobre;
        } else {
            cor_destaque = this.tint;
        }

        this.ultimo_x = x;
        this.ultimo_y = y;
        this.ultima_escala = escala;
        this.textura.desenhar(raylib, x, y, escala, rotacao, cor_destaque);
    }


    public mouse_dentro(raylib: Raylib, mousex: number, mousey: number): boolean {
        mousex = mousex / this.ultima_escala;
        mousey = mousey / this.ultima_escala;
        let texw = this.textura.largura(raylib);
        let texh = this.textura.altura(raylib);
        let cond = (this.ultimo_x < mousex && mousex < (this.ultimo_x + texw)) && (this.ultimo_y < mousey && mousey < (this.ultimo_y + texh));
        return cond;
    }

}

export function wrapRaylib(symbols: any): Raylib {
    const proxy = new Proxy(symbols, {
        get(target, prop) {
            const fn = target[prop];
            if (typeof fn !== "function") return fn;

            return (...args: any[]) => {
                // Converte qualquer string → pointer automaticamente
                const converted = args.map(a =>
                    typeof a === "string" ? to_c_str(a) : a
                                          );

                return fn(...converted);
            };
        }
    });

    return proxy as Raylib;
}
