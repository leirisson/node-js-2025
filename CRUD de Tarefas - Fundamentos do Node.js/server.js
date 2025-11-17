// import-csv.js
const fs = require('fs');
const { parse } = require('csv-parse');
const { nowISO } = require('./utils/dateUtils');

// 🔴 CONFIGURE AQUI: caminho do CSV
const CSV_PATH = './exemplo.csv';

async function importCSV() {
  console.log('🚀 Iniciando importação de CSV...');

  const parser = fs
    .createReadStream(CSV_PATH)
    .pipe(parse({
      columns: true,        // primeira linha = cabeçalho
      skip_empty_lines: true,
      bom: true             // suporte UTF-8 com BOM
    }));

  let count = 0;
  let errors = 0;

  for await (const record of parser) {
    count++;
    const { title, description } = record;

    if (!title) {
      console.warn(`⚠️  Linha ${count}: título ausente. Pulando.`);
      errors++;
      continue;
    }

    // Simula requisição POST para /tasks
    try {
      const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: (description || '').trim()
        })
      });

      if (response.ok) {
        const task = await response.json();
        console.log(`✅ [${count}] Criada: "${task.title}" (id: ${task.id})`);
      } else {
        const err = await response.json().catch(() => ({}));
        console.error(`❌ [${count}] Erro ao criar:`, err.erro || response.status);
        errors++;
      }
    } catch (err) {
      console.error(`💥 [${count}] Falha na requisição:`, err.message);
      errors++;
    }
  }

  console.log(`\n✅ Importação concluída.`);
  console.log(`   📊 Total: ${count} linhas`);
  console.log(`   ✅ Sucesso: ${count - errors}`);
  console.log(`   ❌ Erros: ${errors}`);
}

// Executa apenas se chamado diretamente
if (require.main === module) {
  importCSV().catch(err => {
    console.error('Erro fatal:', err);
    process.exit(1);
  });
}

module.exports = { importCSV };