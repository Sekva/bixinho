all: libraylib_ffi.so src/plataform/raylib_linux/raylib.gerada.d.ts imgs_mascaradas.db web
	bun run src/nativo.ts

imgs_mascaradas.db: recursos/imagens/bichov/base.PNG
	fd -e PNG -x python mascarar_imgs.py {}

src/plataform/raylib_linux/raylib.gerada.d.ts: src/plataform/raylib_linux/gerar_interface.ts
	bun run src/plataform/raylib_linux/gerar_interface.ts

libraylib_ffi.so: src/plataform/raylib_linux/raylib_ffi_wrapper.c
	gcc -fPIC -shared src/plataform/raylib_linux/raylib_ffi_wrapper.c -o libraylib_ffi.so -lraylib -lm -lpthread

web: imgs_mascaradas.db
	bun install
	bun run build:web

serve: web
	bun src/server.ts

clean:
	rm -f src/plataform/raylib_linux/raylib.gerada.d.ts libraylib_ffi.so bundle.js imgs_mascaradas.db
