
# Backend — Academia (Node + MySQL)

## Passo a passo (Windows / VS Code)
1. **Instale o MySQL** e crie um usuário (ex.: root) com senha.
2. **Abra o PowerShell** e rode o script SQL:
   ```powershell
   mysql -u root -p < db.sql
   ```
3. **Configure variáveis de ambiente**: copie `.env.example` para `.env` e ajuste `DB_HOST`, `DB_USER`, `DB_PASS` se necessário.
4. **Instale as dependências**:
   ```powershell
   npm install
   ```
5. **Inicie a API**:
   ```powershell
   npm run dev
   ```
6. A API ficará em `http://localhost:3000/api`.

## Endpoints
- `GET /api/health` — teste
- `GET /api/planos` — lista planos
- `GET /api/treinos` — lista treinos
- `GET /api/alunos` — lista alunos (com nome do plano)
- `POST /api/alunos` — cria aluno
- `POST /api/alunos/:id/treinos` — vincula um treino ao aluno
- `GET /api/alunos/:id/treinos` — lista treinos do aluno

## Observação
Se a sua interface principal não possui formulários, use `frontend/admin.html` para testar.
