// tentar ler apiBase do DOM (admin.html) para facilitar configuração
const apiBaseEl = document.getElementById('apiBase');
const apiBase = apiBaseEl ? apiBaseEl.textContent.replace(/\/$/,'') : "http://localhost:3000/api";

// Criar aluno
async function criarAluno() {
  const nome = document.getElementById('aluno_nome').value;
  const idade = document.getElementById('aluno_idade').value;
  const email = document.getElementById('aluno_email').value;
  const tel = document.getElementById('aluno_tel').value;
  const peso = document.getElementById('aluno_peso').value;
  const altura = document.getElementById('aluno_altura').value;

  const selectPlano = document.getElementById('aluno_plano');
  const planoId = selectPlano.value;
  const planoNome = selectPlano.options[selectPlano.selectedIndex]?.text || "";

  const aluno = { nome, idade, email, tel, peso, altura, planoId, planoNome };

  try {
    const res = await fetch(apiBase + "/alunos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aluno)
    });

    if (res.ok) {
      document.getElementById("aluno_msg").textContent = "✅ Aluno cadastrado!";
      carregarAlunos();
    } else {
      const txt = await res.text();
      document.getElementById("aluno_msg").textContent = `❌ Erro (${res.status}): ${txt || res.statusText}`;
      console.error('Erro ao cadastrar:', res.status, txt);
    }
  } catch (e) {
    document.getElementById("aluno_msg").textContent = `⚠️ Falha de conexão com API: ${e.message}`;
    console.error('Falha de conexão', e);
  }
}

// Carregar alunos na tabela
async function carregarAlunos() {
  try {
    const res = await fetch(apiBase + "/alunos");
    if (!res.ok) {
      console.error('Erro ao buscar alunos', res.status);
      return;
    }
    const data = await res.json();
    const tbody = document.querySelector("#tb_alunos tbody");
    tbody.innerHTML = "";

    (data || []).forEach(aluno => {
      const linha = document.createElement("tr");
      linha.innerHTML = `
        <td>${aluno.id || ""}</td>
        <td>${aluno.nome || ""}</td>
        <td>${aluno.idade || ""}</td>
        <td>${aluno.email || ""}</td>
        <td>${aluno.planoNome || aluno.planoId || ""}</td>
      `;
      tbody.appendChild(linha);
    });

    // preencher lista de alunos em "Vincular Treino"
    const selAluno = document.getElementById("vt_aluno");
    if (selAluno) {
      selAluno.innerHTML = '<option value="">Selecione um aluno</option>';
      (data || []).forEach(aluno => {
        const opt = document.createElement("option");
        opt.value = aluno.id;
        opt.textContent = aluno.nome;
        selAluno.appendChild(opt);
      });
    }

  } catch (e) {
    console.error("Erro ao carregar alunos", e);
  }
}

// Função exemplo para vincular treino (pode adaptar)
async function vincularTreino() {
  const alunoId = document.getElementById("vt_aluno").value;
  const treinoId = document.getElementById("vt_treino").value;
  if (!alunoId || !treinoId) {
    document.getElementById("vt_msg").textContent = "Selecione aluno e treino.";
    return;
  }
  document.getElementById("vt_msg").textContent = `Treino ${treinoId} vinculado ao aluno ${alunoId}.`;
}

// Carregar alunos logo que abrir
carregarAlunos();
