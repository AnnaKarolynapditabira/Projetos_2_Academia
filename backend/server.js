const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.options("*", cors()); // permite preflight
app.use(express.json());
app.use(morgan("dev")); // loga requisições no terminal

// Banco SQLite
const dbPath = path.resolve(__dirname, "academia.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erro ao conectar no banco:", err.message);
  } else {
    console.log("Conectado ao banco SQLite em", dbPath);
  }
});

// Criação das tabelas se não existirem
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS alunos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      idade INTEGER,
      email TEXT,
      tel TEXT,
      peso REAL,
      altura REAL,
      planoId TEXT,
      planoNome TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS planos (
      id TEXT PRIMARY KEY,
      nome TEXT
    )
  `);

  // Popular planos básicos (se não existirem)
  db.run(`INSERT OR IGNORE INTO planos (id, nome) VALUES
    ('bronze', 'Plano Bronze'),
    ('prata', 'Plano Prata'),
    ('ouro', 'Plano Ouro')
  `);
});

// Rotas -----------------

// Health (verifica disponibilidade e tabelas)
app.get("/api/health", (req, res) => {
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
    if (err) return res.status(500).json({ ok: false, error: err.message });
    const tables = rows.map((r) => r.name);
    res.json({ ok: true, tables });
  });
});

// Listar planos (usa tabela Plano criada por create_db.js)
app.get("/api/planos", (req, res) => {
  db.all(
    "SELECT id_plano AS id, nome_plano AS nome, valor, descricao FROM Plano",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows || []);
    }
  );
});

// Listar alunos (usa tabela Aluno)
app.get("/api/alunos", (req, res) => {
  db.all(
    `SELECT id_aluno AS id, nome, idade, email, telefone AS tel, peso, altura, id_plano AS planoId
     FROM Aluno`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows || []);
    }
  );
});

// Criar aluno
app.post("/api/alunos", (req, res) => {
  const { nome, idade, email, tel, peso, altura, planoId } = req.body;
  if (!nome || !planoId) {
    return res.status(400).json({ error: "nome e planoId são obrigatórios" });
  }

  const sql = `INSERT INTO Aluno (nome, idade, email, telefone, peso, altura, id_plano)
               VALUES (?,?,?,?,?,?,?)`;
  db.run(sql, [nome, idade || null, email || null, tel || null, peso || null, altura || null, planoId], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    const inserted = {
      id: this.lastID,
      nome, idade, email, tel, peso, altura, planoId
    };
    res.status(201).json(inserted);
  });
});

// Start
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
