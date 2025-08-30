const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbFile = path.join(__dirname, 'academia.db');
// remove DB antigo (já que disse que não precisa backup)
if (fs.existsSync(dbFile)) fs.unlinkSync(dbFile);

const db = new sqlite3.Database(dbFile, (err) => {
  if (err) { console.error('Erro ao criar DB:', err.message); process.exit(1); }
  console.log('Novo DB criado em:', dbFile);
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS Plano (
    id_plano INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_plano TEXT NOT NULL,
    valor REAL NOT NULL,
    descricao TEXT
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS Professor (
    id_professor INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    especialidade TEXT,
    email TEXT,
    telefone TEXT
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS Categoria (
    id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_categoria TEXT NOT NULL,
    descricao TEXT
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS Treino (
    id_treino INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_treino TEXT NOT NULL,
    descricao TEXT,
    id_categoria INTEGER,
    id_professor INTEGER
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS Aluno (
    id_aluno INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    idade INTEGER,
    email TEXT UNIQUE,
    telefone TEXT,
    peso REAL,
    altura REAL,
    id_plano INTEGER
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS Aluno_Treino (
    id_aluno INTEGER,
    id_treino INTEGER,
    data_atribuicao DATE DEFAULT (DATE('now')),
    PRIMARY KEY (id_aluno, id_treino)
  );`);

  db.run(`INSERT INTO Plano (nome_plano, valor, descricao) VALUES
    ('Básico', 99.90, 'Acesso a musculação e aeróbico'),
    ('Premium', 149.90, 'Inclui aulas coletivas e avaliação'),
    ('VIP', 249.90, 'Personal trainer 1x/semana + todos os serviços')
  ;`, (err) => { if (err) console.warn('seed planos:', err.message); });

  db.run(`INSERT INTO Professor (nome, especialidade, email, telefone) VALUES
    ('Ana Souza', 'Musculação', 'ana@academia.com', '(31) 90000-0001'),
    ('Carlos Lima', 'Funcional', 'carlos@academia.com', '(31) 90000-0002')
  ;`, (err) => { if (err) console.warn('seed professores:', err.message); });

  console.log('Tabelas e seeds criados.');
});

db.close();