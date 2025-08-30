
# Projeto Academia — Full Stack Starter

Este pacote contém:
- **frontend/** (HTML/CSS do seu site + `admin.html` + `app.js` para consumir a API)
- **backend/** (Node.js + Express + MySQL) e `db.sql` com o esquema normalizado.

## Como rodar
1) **Banco (MySQL)**: importe `backend/db.sql`
2) **API**:
   ```bash
   cd backend
   copy .env.example .env   # Windows
   # edite .env com suas credenciais
   npm install
   npm run dev
   ```
3) **Frontend**: abra `frontend/admin.html` no navegador para testar as rotas.

> Dica: você pode subir um servidor estático simples no VS Code com a extensão "Live Server".
