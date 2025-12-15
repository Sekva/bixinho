import { writeFileSync } from "node:fs";
import { raylib_interface } from "./main";
import { FFIType } from "bun:ffi";

const ffiToTS: Record<number, string> = {
    [FFIType.i32]: "number",
    [FFIType.u32]: "number",
    [FFIType.float]: "number",
    [FFIType.bool]: "boolean",
    [FFIType.ptr]: "number",   // pointer vira number
    [FFIType.cstring]: "Pointer",
    [FFIType.void]: "void",
};

function generateTSInterface(name: string, dict: any): string {
    let out = `// GERADO — NÃO EDITAR\nexport interface ${name} {\n`;

    for (const fn in dict) {
        const { args = [], returns = FFIType.void } = dict[fn];

        const tsArgs = args
            .map((a: number, i: number) => `arg${i}: ${ffiToTS[a] ?? "unknown"}`)
            .join(", ");

        const tsReturn = ffiToTS[returns] ?? "unknown";

        out += `  ${fn}(${tsArgs}): ${tsReturn};\n`;
    }

    out += "}\n";
    return out;
}

const output = generateTSInterface("Raylib", raylib_interface);
writeFileSync(import.meta.dir + "/" + "raylib.gerada.d.ts", output);
