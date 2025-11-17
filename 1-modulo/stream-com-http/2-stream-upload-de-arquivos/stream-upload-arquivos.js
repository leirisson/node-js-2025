
const http = require('http');
const fs = require('fs');
const path = require('path');

/*
 * Upload de arquivo usando Streams
 * Eficiente para arquivos grandes!
 */

const server = http.createServer((req, res) => {
  
  if (req.method === 'POST' && req.url === '/upload') {
    console.log('\n📤 Iniciando upload...');
    
    const fileName = `upload-${Date.now()}.txt`;
    const filePath = path.join(__dirname, fileName);
    
    // Cria um Writable Stream para o arquivo
    const fileStream = fs.createWriteStream(filePath);
    
    let bytesReceived = 0;
    
    // Monitora o progresso
    req.on('data', (chunk) => {
      bytesReceived += chunk.length;
      console.log(`📊 Progresso: ${bytesReceived} bytes`);
    });
    
    // PIPE: conecta req (Readable) ao arquivo (Writable)
    req.pipe(fileStream);
    
    fileStream.on('finish', () => {
      console.log(`✓ Upload concluído: ${fileName}`);
      console.log(`📁 Total: ${bytesReceived} bytes`);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        sucesso: true,
        arquivo: fileName,
        tamanho: bytesReceived
      }));
    });
    
    fileStream.on('error', (err) => {
      console.error('❌ Erro no upload:', err);
      res.writeHead(500);
      res.end('Erro ao salvar arquivo');
    });
    
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <h1>Upload com Streams</h1>
      <form method="POST" action="/upload">
        <textarea name="conteudo" rows="10" cols="50"></textarea><br>
        <button type="submit">Enviar</button>
      </form>
      <p>Ou teste via curl:</p>
      <code>curl -X POST http://localhost:3000/upload -d "Conteúdo do arquivo"</code>
    `);
  }
});

server.listen(3000, () => {
  console.log('🚀 Servidor em http://localhost:3000');
});