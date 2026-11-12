import * as api from './api.js';

const estado = { editandoId: null, treinadorId: null };
const $ = (id) => document.getElementById(id);

// ---------- avisos ----------
function mostrarAviso(elemento, texto, tipo = 'erro') {
  elemento.textContent = texto;
  elemento.className = tipo === 'erro' ? 'aviso' : `aviso ${tipo}`;
  elemento.hidden = false;
}
const esconder = (elemento) => { elemento.hidden = true; };
const botao = (texto, aoClicar, classe = '') => {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = texto;
  if (classe) b.className = classe;
  b.addEventListener('click', aoClicar);
  return b;
};

// ---------- Pokémon ----------
// A imagem vem de outro site (o GitHub da PokéAPI). Se ela não carregar, some sem quebrar a tela.
function imagemDoPokemon(p) {
  const img = document.createElement('img');
  img.src = p.imagem;
  img.alt = p.nome;
  img.addEventListener('error', () => img.remove());
  return img;
}

// Um cartão do time. textContent, e não innerHTML, também para o que vem da PokéAPI.
function cartaoPokemon(p, aoTirar) {
  const carta = document.createElement('div');
  carta.className = 'carta';
  if (p.imagem) carta.append(imagemDoPokemon(p));
  const nome = document.createElement('strong');
  nome.textContent = `#${p.numero} ${p.nome}`;
  const tipos = document.createElement('span');
  tipos.textContent = p.tipos.join(', ');
  carta.append(nome, tipos);
  if (aoTirar) carta.append(botao('Tirar', aoTirar, 'secundario'));
  return carta;
}

// ---------- lista de treinadores ----------
function linhaDaTabela(t) {
  const tr = document.createElement('tr');
  if (t.id === estado.treinadorId) tr.className = 'escolhido';
  for (const valor of [t.id, t.nome, t.cidade, `${t.totalPokemon}/6`]) {
    const td = document.createElement('td');
    td.textContent = valor;
    tr.append(td);
  }
  const acoes = document.createElement('td');
  acoes.append(
    botao('Ver time', () => mostrarTime(t.id)),
    botao('Editar', () => carregarParaEdicao(t)),
    botao('Excluir', () => excluirTreinador(t), 'secundario'),
  );
  tr.append(acoes);
  return tr;
}

async function carregarLista() {
  const aviso = $('aviso-lista');
  mostrarAviso(aviso, 'Carregando...', 'info');
  try {
    const treinadores = await api.listarTreinadores();
    $('linhas').replaceChildren(...treinadores.map(linhaDaTabela));
    if (treinadores.length === 0) mostrarAviso(aviso, 'Nenhum treinador cadastrado.', 'info');
    else esconder(aviso);
  } catch (erro) {
    $('linhas').replaceChildren();
    mostrarAviso(aviso, erro.message);
  }
}

// ---------- cadastro e edição de treinador ----------
function limparFormulario() {
  $('cadastro').reset();
  estado.editandoId = null;
  $('titulo-form').textContent = 'Novo treinador';
  $('detalhes').replaceChildren();
}

function mostrarErroDoFormulario(erro) {
  mostrarAviso($('aviso-form'), erro.message);
  // os detalhes (corpo fora do contrato) viram uma lista, um item por problema
  $('detalhes').replaceChildren(...(erro.detalhes ?? []).map((d) => {
    const li = document.createElement('li');
    li.textContent = d;
    return li;
  }));
}

async function salvar(evento) {
  evento.preventDefault();
  esconder($('aviso-form'));
  $('detalhes').replaceChildren();
  const form = $('cadastro');
  const dados = { nome: form.nome.value.trim(), cidade: form.cidade.value.trim() };
  const enviar = evento.submitter;
  enviar.disabled = true;
  try {
    const salvo = estado.editandoId
      ? await api.atualizarTreinador(estado.editandoId, dados)
      : await api.criarTreinador(dados);
    limparFormulario();
    mostrarAviso($('aviso-form'), `${salvo.nome} salvo com o id ${salvo.id}.`, 'ok');
    await carregarLista();
    if (salvo.id === estado.treinadorId) await mostrarTime(salvo.id);
  } catch (erro) {
    mostrarErroDoFormulario(erro);
  } finally {
    enviar.disabled = false;
  }
}

function carregarParaEdicao(t) {
  esconder($('aviso-form'));
  const form = $('cadastro');
  form.nome.value = t.nome;
  form.cidade.value = t.cidade;
  estado.editandoId = t.id;
  $('titulo-form').textContent = `Editando o treinador ${t.id}`;
}

async function excluirTreinador(t) {
  if (!confirm(`Excluir ${t.nome} e o time dele?`)) return;
  try {
    await api.removerTreinador(t.id);
    if (estado.editandoId === t.id) limparFormulario();
    if (estado.treinadorId === t.id) esconderTime();
    await carregarLista();
  } catch (erro) {
    mostrarAviso($('aviso-lista'), erro.message);
  }
}

// ---------- o time ----------
function esconderTime() {
  estado.treinadorId = null;
  $('titulo-time').textContent = 'Time';
  $('cartas').replaceChildren();
  $('adicionar').hidden = true;
  mostrarAviso($('aviso-time'), 'Escolha um treinador na lista.', 'info');
}

async function mostrarTime(id) {
  const aviso = $('aviso-time');
  mostrarAviso(aviso, 'Carregando o time...', 'info');
  try {
    const t = await api.buscarTreinador(id);
    estado.treinadorId = id;
    $('titulo-time').textContent = `Time de ${t.nome} (${t.time.length}/6)`;
    $('cartas').replaceChildren(...t.time.map((p) => cartaoPokemon(p, () => tirar(p))));
    $('adicionar').hidden = false;
    if (t.time.length === 0) mostrarAviso(aviso, 'O time está vazio.', 'info');
    else esconder(aviso);
    document.querySelectorAll('#linhas tr').forEach((tr) => {
      tr.classList.toggle('escolhido', tr.firstChild.textContent === String(id));
    });
  } catch (erro) {
    mostrarAviso(aviso, erro.message);
  }
}

// Mostra o Pokémon antes de pôr no time: a API consulta a PokéAPI e devolve só o que interessa
async function verPokemon() {
  const nome = $('adicionar').pokemon.value.trim();
  const previa = $('previa');
  if (!nome) return;
  previa.textContent = 'Buscando na PokéAPI...';
  try {
    previa.replaceChildren(cartaoPokemon(await api.buscarPokemon(nome)));
  } catch (erro) {
    previa.textContent = erro.message;
  }
}

async function adicionar(evento) {
  evento.preventDefault();
  const aviso = $('aviso-adicionar');
  esconder(aviso);
  const form = $('adicionar');
  const enviar = evento.submitter;
  enviar.disabled = true;
  try {
    const p = await api.adicionarAoTime(estado.treinadorId, form.pokemon.value.trim());
    form.reset();
    $('previa').replaceChildren();
    mostrarAviso(aviso, `${p.nome} entrou no time.`, 'ok');
    await Promise.all([mostrarTime(estado.treinadorId), carregarLista()]);
  } catch (erro) {
    mostrarAviso(aviso, erro.message);
  } finally {
    enviar.disabled = false;
  }
}

async function tirar(p) {
  try {
    await api.tirarDoTime(estado.treinadorId, p.numero);
    mostrarAviso($('aviso-adicionar'), `${p.nome} saiu do time.`, 'ok');
    await Promise.all([mostrarTime(estado.treinadorId), carregarLista()]);
  } catch (erro) {
    mostrarAviso($('aviso-adicionar'), erro.message);
  }
}

// ---------- ligações ----------
$('endereco-api').textContent = api.API;
$('cadastro').addEventListener('submit', salvar);
$('cancelar').addEventListener('click', limparFormulario);
$('adicionar').addEventListener('submit', adicionar);
$('ver-pokemon').addEventListener('click', verPokemon);

carregarLista();
