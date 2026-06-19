export NO_COLOR := 1
SPRITE_EXPORT_DIR ?= recursos/imagens

.PHONY: web serve export-sprites clean

all: libraylib_ffi.so src/plataform/raylib_linux/raylib.gerada.d.ts
	bun run src/nativo.ts

src/plataform/raylib_linux/raylib.gerada.d.ts: src/plataform/raylib_linux/gerar_interface.ts
	bun run src/plataform/raylib_linux/gerar_interface.ts

libraylib_ffi.so: src/plataform/raylib_linux/raylib_ffi_wrapper.c
	gcc -fPIC -shared src/plataform/raylib_linux/raylib_ffi_wrapper.c -o libraylib_ffi.so -lraylib -lm -lpthread

web:
	bun install
	bun run build:web

serve: web
	bun src/server.ts

export-sprites:
	python3 scripts/export_krita_layers.py bichov.kra "$(SPRITE_EXPORT_DIR)"

clean:
	rm -f src/plataform/raylib_linux/raylib.gerada.d.ts libraylib_ffi.so bundle.js
