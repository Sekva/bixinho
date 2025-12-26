import { readdirSync } from "fs";

const server = Bun.serve({
    port: 3000,
    async fetch(req) {
        const url = new URL(req.url);
        let filePath = url.pathname;

        if (filePath === '/') {
            filePath = '/src/index.html';
        }

        if (filePath === '/favicon.ico') {
            return new Response('', { status: 200, headers: { 'Content-Type': 'image/x-icon' } });
        }

        const basePath = '/home/sekva/dados/progamming/bixinho';
        const fullPath = basePath + filePath;

        try {
            const isDirectory = await isDir(fullPath);

            if (isDirectory) {
                const files = await listDirectoryContents(fullPath, filePath);

                if (url.searchParams.get('format') === 'json') {
                    return new Response(JSON.stringify(files, null, 2), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }

                const html = generateDirectoryListing(filePath, files);
                return new Response(html, {
                    status: 200,
                    headers: { 'Content-Type': 'text/html; charset=utf-8' }
                });
            }

            const file = Bun.file(fullPath);
            const exists = await file.exists();

            if (exists) {
                return new Response(file);
            }

            console.error("❌ Arquivo não encontrado:", fullPath);
            return new Response('Not Found: ' + filePath, { status: 404 });
        } catch (e) {
            console.error("❌ Erro ao servir arquivo:", e);
            return new Response('Erro interno', { status: 500 });
        }
    }
});

async function isDir(path: string) {
    try {
        let _ = readdirSync(path);
        return true;
    } catch (err) {
        return false;
    }

}
async function listDirectoryContents(dirPath: string, urlPath: string) {
    try {
        const entries = [];
        const files = readdirSync(dirPath);
        for (const fileName of files) {
            const fullEntryPath = dirPath + '/' + fileName;
            const isDirEntry = await isDir(fullEntryPath);
            entries.push({
                name: fileName,
                type: isDirEntry ? 'directory' : 'file',
                path: urlPath + (urlPath.endsWith('/') ? '' : '/') + fileName,
                url: `http://localhost:3000${urlPath}${urlPath.endsWith('/') ? '' : '/'}${fileName}`
            });
        }

        return entries.sort((a, b) => {
            if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
            return a.name.localeCompare(b.name);
        });
    } catch (error) {
        console.error("Erro ao listar diretório:", error);
        return [];
    }
}

function generateDirectoryListing(path: string, files: any[]) {
    const title = `Índice de ${path}`;

    let html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${title}</title>
<style>
body { font-family: sans-serif; margin: 40px; }
h1 { color: #333; }
ul { list-style: none; padding: 0; }
li { margin: 8px 0; padding: 8px; background: #f5f5f5; border-radius: 4px; }
a { text-decoration: none; color: #0066cc; }
a:hover { text-decoration: underline; }
.dir { font-weight: bold; color: #009900; }
.file { color: #333; }
.icon { margin-right: 8px; }
.json-link { margin-top: 20px; padding: 10px; background: #eef; border-radius: 4px; }
.size { float: right; color: #666; font-size: 0.9em; }
</style>
</head>
<body>
<h1>📁 ${title}</h1>
<p>${files.length} ite${files.length === 1 ? 'm' : 'ns'}</p>
<ul>
`;

    files.forEach(item => {
        const icon = item.type === 'directory' ? '📁' : '📄';
        const cssClass = item.type === 'directory' ? 'dir' : 'file';
        html += `
<li class="${cssClass}">
<span class="icon">${icon}</span>
<a href="${item.path}${item.type === 'directory' ? '/' : ''}">${item.name}</a>
${item.type === 'directory' ? '/' : ''}
<span class="size">${item.type === 'directory' ? 'Pasta' : 'Arquivo'}</span>
</li>`;
    });

    html += `</ul>
<div class="json-link">
<a href="?format=json">📊 Ver como JSON (para sua função listar_arquivos)</a>
</div>
<div style="margin-top: 20px; font-size: 0.8em; color: #666;">
<p>📌 <strong>Para usar no código TypeScript:</strong></p>
<pre style="background: #f0f0f0; padding: 10px; border-radius: 4px;">
listar_arquivos("${path}") // Retorna array de nomes
listar_arquivos_completo("${path}") // Retorna array de objetos com type, path, etc.
</pre>
</div>
</body>
</html>`;

    return html;
}

console.log(`🚀 Servidor rodando em http://localhost:${server.port}`);
console.log(`📂 Servindo arquivos de: /home/sekva/dados/progamming/bixinho`);
console.log('✨ Funcionalidades:');
console.log('   - Listagem automática de diretórios');
console.log('   - Acesso via browser: http://localhost:3000/caminho/');
console.log('   - Acesso via API JSON: http://localhost:3000/caminho/?format=json');
console.log('\n✨ Abra http://localhost:3000 no navegador');
