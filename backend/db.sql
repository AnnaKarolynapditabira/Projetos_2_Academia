-- Criação do banco e tabelas para o sistema de academia
CREATE DATABASE IF NOT EXISTS academia_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE academia_db;

-- Tabela de Planos
CREATE TABLE IF NOT EXISTS Plano (
  id_plano INT PRIMARY KEY AUTO_INCREMENT,
  nome_plano VARCHAR(100) NOT NULL,
  valor DECIMAL(8,2) NOT NULL,
  descricao TEXT
);

-- Tabela de Professores
CREATE TABLE IF NOT EXISTS Professor (
  id_professor INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  especialidade VARCHAR(100),
  email VARCHAR(100),
  telefone VARCHAR(20)
);

-- Tabela de Categorias de Treino
CREATE TABLE IF NOT EXISTS Categoria (
  id_categoria INT PRIMARY KEY AUTO_INCREMENT,
  nome_categoria VARCHAR(100) NOT NULL,
  descricao TEXT
);

-- Tabela de Treinos
CREATE TABLE IF NOT EXISTS Treino (
  id_treino INT PRIMARY KEY AUTO_INCREMENT,
  nome_treino VARCHAR(100) NOT NULL,
  descricao TEXT,
  id_categoria INT,
  id_professor INT,
  FOREIGN KEY (id_categoria) REFERENCES Categoria(id_categoria),
  FOREIGN KEY (id_professor) REFERENCES Professor(id_professor)
);

-- Tabela de Alunos
CREATE TABLE IF NOT EXISTS Aluno (
  id_aluno INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  idade INT,
  email VARCHAR(100) UNIQUE,
  telefone VARCHAR(20),
  peso DECIMAL(5,2),
  altura DECIMAL(4,2),
  id_plano INT,
  FOREIGN KEY (id_plano) REFERENCES Plano(id_plano)
);

-- Tabela relacionando Aluno e Treino (N:N)
CREATE TABLE IF NOT EXISTS Aluno_Treino (
  id_aluno INT,
  id_treino INT,
  data_atribuicao DATE DEFAULT (CURRENT_DATE()),
  PRIMARY KEY (id_aluno, id_treino),
  FOREIGN KEY (id_aluno) REFERENCES Aluno(id_aluno) ON DELETE CASCADE,
  FOREIGN KEY (id_treino) REFERENCES Treino(id_treino) ON DELETE CASCADE
);

-- Seeds mínimos
INSERT INTO Plano (nome_plano, valor, descricao) VALUES
  ('Básico', 99.90, 'Acesso a musculação e aeróbico'),
  ('Premium', 149.90, 'Inclui aulas coletivas e avaliação'),
  ('VIP', 249.90, 'Personal trainer 1x/semana + todos os serviços')
ON DUPLICATE KEY UPDATE valor=VALUES(valor);

INSERT INTO Professor (nome, especialidade, email, telefone) VALUES
  ('Ana Souza', 'Musculação', 'ana@academia.com', '(31) 90000-0001'),
  ('Carlos Lima', 'Funcional', 'carlos@academia.com', '(31) 90000-0002')
ON DUPLICATE KEY UPDATE especialidade=VALUES(especialidade);

INSERT INTO Categoria (nome_categoria, descricao) VALUES
  ('Musculação', 'Treinos de força e resistência'),
  ('Cardio', 'Treinos aeróbicos'),
  ('Funcional', 'Treinos dinâmicos e funcionais')
ON DUPLICATE KEY UPDATE descricao=VALUES(descricao);

INSERT INTO Treino (nome_treino, descricao, id_categoria, id_professor) VALUES
  ('Força A', 'Peito/Tríceps', 1, 1),
  ('Força B', 'Costas/Bíceps', 1, 1),
  ('HIIT 20min', 'Alta intensidade', 2, 2)
ON DUPLICATE KEY UPDATE descricao=VALUES(descricao);

-- exemplo (backend)
