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

    IsKeyReleased: {
        args: [FFIType.i32],
        returns: FFIType.bool,
    },

};

export enum KeyboardKey {
    KEY_NULL            = 0,        // Key: NULL, used for no key pressed
    // Alphanumeric keys
    KEY_APOSTROPHE      = 39,       // Key: '
    KEY_COMMA           = 44,       // Key: ,
    KEY_MINUS           = 45,       // Key: -
    KEY_PERIOD          = 46,       // Key: .
    KEY_SLASH           = 47,       // Key: /
    KEY_ZERO            = 48,       // Key: 0
    KEY_ONE             = 49,       // Key: 1
    KEY_TWO             = 50,       // Key: 2
    KEY_THREE           = 51,       // Key: 3
    KEY_FOUR            = 52,       // Key: 4
    KEY_FIVE            = 53,       // Key: 5
    KEY_SIX             = 54,       // Key: 6
    KEY_SEVEN           = 55,       // Key: 7
    KEY_EIGHT           = 56,       // Key: 8
    KEY_NINE            = 57,       // Key: 9
    KEY_SEMICOLON       = 59,       // Key: ;
    KEY_EQUAL           = 61,       // Key: =
    KEY_A               = 65,       // Key: A | a
    KEY_B               = 66,       // Key: B | b
    KEY_C               = 67,       // Key: C | c
    KEY_D               = 68,       // Key: D | d
    KEY_E               = 69,       // Key: E | e
    KEY_F               = 70,       // Key: F | f
    KEY_G               = 71,       // Key: G | g
    KEY_H               = 72,       // Key: H | h
    KEY_I               = 73,       // Key: I | i
    KEY_J               = 74,       // Key: J | j
    KEY_K               = 75,       // Key: K | k
    KEY_L               = 76,       // Key: L | l
    KEY_M               = 77,       // Key: M | m
    KEY_N               = 78,       // Key: N | n
    KEY_O               = 79,       // Key: O | o
    KEY_P               = 80,       // Key: P | p
    KEY_Q               = 81,       // Key: Q | q
    KEY_R               = 82,       // Key: R | r
    KEY_S               = 83,       // Key: S | s
    KEY_T               = 84,       // Key: T | t
    KEY_U               = 85,       // Key: U | u
    KEY_V               = 86,       // Key: V | v
    KEY_W               = 87,       // Key: W | w
    KEY_X               = 88,       // Key: X | x
    KEY_Y               = 89,       // Key: Y | y
    KEY_Z               = 90,       // Key: Z | z
    KEY_LEFT_BRACKET    = 91,       // Key: [
    KEY_BACKSLASH       = 92,       // Key: '\'
    KEY_RIGHT_BRACKET   = 93,       // Key: ]
    KEY_GRAVE           = 96,       // Key: `
    // Function keys
    KEY_SPACE           = 32,       // Key: Space
    KEY_ESCAPE          = 256,      // Key: Esc
    KEY_ENTER           = 257,      // Key: Enter
    KEY_TAB             = 258,      // Key: Tab
    KEY_BACKSPACE       = 259,      // Key: Backspace
    KEY_INSERT          = 260,      // Key: Ins
    KEY_DELETE          = 261,      // Key: Del
    KEY_RIGHT           = 262,      // Key: Cursor right
    KEY_LEFT            = 263,      // Key: Cursor left
    KEY_DOWN            = 264,      // Key: Cursor down
    KEY_UP              = 265,      // Key: Cursor up
    KEY_PAGE_UP         = 266,      // Key: Page up
    KEY_PAGE_DOWN       = 267,      // Key: Page down
    KEY_HOME            = 268,      // Key: Home
    KEY_END             = 269,      // Key: End
    KEY_CAPS_LOCK       = 280,      // Key: Caps lock
    KEY_SCROLL_LOCK     = 281,      // Key: Scroll down
    KEY_NUM_LOCK        = 282,      // Key: Num lock
    KEY_PRINT_SCREEN    = 283,      // Key: Print screen
    KEY_PAUSE           = 284,      // Key: Pause
    KEY_F1              = 290,      // Key: F1
    KEY_F2              = 291,      // Key: F2
    KEY_F3              = 292,      // Key: F3
    KEY_F4              = 293,      // Key: F4
    KEY_F5              = 294,      // Key: F5
    KEY_F6              = 295,      // Key: F6
    KEY_F7              = 296,      // Key: F7
    KEY_F8              = 297,      // Key: F8
    KEY_F9              = 298,      // Key: F9
    KEY_F10             = 299,      // Key: F10
    KEY_F11             = 300,      // Key: F11
    KEY_F12             = 301,      // Key: F12
    KEY_LEFT_SHIFT      = 340,      // Key: Shift left
    KEY_LEFT_CONTROL    = 341,      // Key: Control left
    KEY_LEFT_ALT        = 342,      // Key: Alt left
    KEY_LEFT_SUPER      = 343,      // Key: Super left
    KEY_RIGHT_SHIFT     = 344,      // Key: Shift right
    KEY_RIGHT_CONTROL   = 345,      // Key: Control right
    KEY_RIGHT_ALT       = 346,      // Key: Alt right
    KEY_RIGHT_SUPER     = 347,      // Key: Super right
    KEY_KB_MENU         = 348,      // Key: KB menu
    // Keypad keys
    KEY_KP_0            = 320,      // Key: Keypad 0
    KEY_KP_1            = 321,      // Key: Keypad 1
    KEY_KP_2            = 322,      // Key: Keypad 2
    KEY_KP_3            = 323,      // Key: Keypad 3
    KEY_KP_4            = 324,      // Key: Keypad 4
    KEY_KP_5            = 325,      // Key: Keypad 5
    KEY_KP_6            = 326,      // Key: Keypad 6
    KEY_KP_7            = 327,      // Key: Keypad 7
    KEY_KP_8            = 328,      // Key: Keypad 8
    KEY_KP_9            = 329,      // Key: Keypad 9
    KEY_KP_DECIMAL      = 330,      // Key: Keypad .
    KEY_KP_DIVIDE       = 331,      // Key: Keypad /
    KEY_KP_MULTIPLY     = 332,      // Key: Keypad *
    KEY_KP_SUBTRACT     = 333,      // Key: Keypad -
    KEY_KP_ADD          = 334,      // Key: Keypad +
    KEY_KP_ENTER        = 335,      // Key: Keypad Enter
    KEY_KP_EQUAL        = 336,      // Key: Keypad =
    // Android key buttons
    KEY_BACK            = 4,        // Key: Android back button
    KEY_MENU            = 5,        // Key: Android menu button
    KEY_VOLUME_UP       = 24,       // Key: Android volume up button
    KEY_VOLUME_DOWN     = 25        // Key: Android volume down button
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
    private anim_terminada: boolean= false;

    constructor(
        private raylib: Raylib,
        private diretorio_frames: string,
        private stops: number = 2,
        private repetir = true,
        private direcao = 1
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
        if(this.direcao == -1) {
            this.frames.reverse();
        }
        return this;
    }

    public terminada(): boolean {
        return this.anim_terminada;
    }

    public update() {

        if(!this.repetir &&  this.frame_atual == (this.frames.length - 1)) {
            this.anim_terminada = true;
            return;
        }

        if(this.s2 % this.stops == 0) {
            this.frame_atual = (this.frame_atual + 1) % this.frames.length;
        }

        this.s2 = (this.s2 + 1) % this.stops;
    }

    public desenhar(raylib: Raylib, x: number, y: number, escala: number, rotacao: number, tint: number) {
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
