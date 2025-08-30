const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'academia.db');
console.log('Abrindo DB em:', dbPath);

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Erro ao abrir DB:', err.message);
    process.exit(1);
  }
  console.log('DB aberto com sucesso.');
});

db.serialize(() => {
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (err) return console.error('Erro listar tabelas:', err.message);
    console.log('Tabelas encontradas:', tables.map(t => t.name));
  });

  db.all('SELECT id, nome FROM planos LIMIT 5', (err, rows) => {
    if (err) {
      console.warn('Tabela "planos" não encontrada ou erro:', err.message);
    } else {
      console.log('planos (ex):', rows);
    }
  });

  db.all('SELECT id, nome FROM alunos LIMIT 5', (err, rows) => {
    if (err) {
      console.warn('Tabela "alunos" não encontrada ou erro:', err.message);
    } else {
      console.log('alunos (ex):', rows);
    }
  });
});

db.close();