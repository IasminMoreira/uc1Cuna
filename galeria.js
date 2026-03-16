/**
 * galeria.js — Galeria de Guardiões · Cuna
 *
 * Configuração rápida:
 *   1. Altere API_BASE para o seu endpoint real
 *   2. A galeria busca GET /guardioes automaticamente ao carregar
 *   3. O jogo envia POST /guardioes ao gerar o certificado
 */

'use strict';

/* ═══════════════════════════════════════════════════════
   CONFIGURAÇÃO — altere apenas aqui
═══════════════════════════════════════════════════════ */
const API_BASE = 'https://api.cuna.com.br/v1';   /* ← seu endpoint aqui */
const ENDPOINT_GUARDIOES = `${API_BASE}/guardioes`;

const SELOS = [
  { icon: '🌱', label: 'Iniciante'   },
  { icon: '🏠', label: 'Internas'    },
  { icon: '☀️', label: 'Jardim'      },
  { icon: '🌧', label: 'Chuva'       },
];

/* ═══════════════════════════════════════════════════════
   ESTADO LOCAL
═══════════════════════════════════════════════════════ */
let _todosGuardioes = [];   /* cache dos guardiões vindos da API */


/* ═══════════════════════════════════════════════════════
   API — funções de comunicação com o backend
═══════════════════════════════════════════════════════ */

/**
 * buscarGuardioes()
 * GET /guardioes
 * Retorna array de objetos: [{ id, nome, data, nivel }, ...]
 */
async function buscarGuardioes() {
  const resp = await fetch(ENDPOINT_GUARDIOES, {
    method:  'GET',
    headers: { 'Accept': 'application/json' },
  });
  if (!resp.ok) throw new Error(`Erro ${resp.status}: ${resp.statusText}`);
  return resp.json();
}

/**
 * salvarGuardiao(dados)
 * POST /guardioes
 * Envia os dados do novo guardião e retorna o objeto salvo.
 *
 * @param {{ nome: string, data: string, nivel: string, thumbBase64?: string }} dados
 */
async function salvarGuardiao(dados) {
  const resp = await fetch(ENDPOINT_GUARDIOES, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept':       'application/json',
    },
    body: JSON.stringify(dados),
  });
  if (!resp.ok) throw new Error(`Erro ${resp.status}: ${resp.statusText}`);
  return resp.json();
}


/* ═══════════════════════════════════════════════════════
   RENDER — constrói os cards na grade
═══════════════════════════════════════════════════════ */

function _formatarData(isoString) {
  try {
    return new Date(isoString).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

function _criarCard(guardiao, delay = 0) {
  const card = document.createElement('article');
  card.className = 'guardiao-card';
  card.style.animationDelay = `${delay}ms`;
  card.setAttribute('aria-label', `Guardião ${guardiao.nome}`);

  const nivel = guardiao.nivel || 'Guardião Expert';
  const dataFormatada = _formatarData(guardiao.data || guardiao.createdAt || new Date().toISOString());

  card.innerHTML = `
    <div class="card-header">
      <span class="card-emblema" aria-hidden="true">🌿</span>
      <h2 class="card-nome">${_escaparHTML(guardiao.nome)}</h2>
    </div>
    <div class="card-divisor"></div>
    <p class="card-nivel">${_escaparHTML(nivel)}</p>
    <div class="card-selos" aria-label="Conquistas">
      ${SELOS.map(s => `
        <span class="card-selo">
          <span class="card-selo-icon" aria-hidden="true">${s.icon}</span>
          ${s.label}
        </span>`).join('')}
    </div>
    <p class="card-data">${dataFormatada}</p>
    <span class="card-cuna" aria-hidden="true">Cuna · Jardim Urbano</span>
  `;
  return card;
}

function _escaparHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function _renderizarGrade(lista) {
  const grid   = document.getElementById('galeria-grid');
  const empty  = document.getElementById('galeria-empty');
  if (!grid) return;

  grid.innerHTML = '';

  if (!lista || lista.length === 0) {
    empty?.classList.remove('hidden');
    return;
  }
  empty?.classList.add('hidden');

  lista.forEach((g, i) => {
    grid.appendChild(_criarCard(g, i * 40));   /* stagger de 40ms por card */
  });
}

function _atualizarStats(lista) {
  const hoje = new Date().toDateString();
  const mesAtual = new Date().getMonth();
  const anoAtual = new Date().getFullYear();

  const total  = lista.length;
  const deHoje = lista.filter(g => {
    try { return new Date(g.data || g.createdAt).toDateString() === hoje; }
    catch { return false; }
  }).length;
  const doMes  = lista.filter(g => {
    try {
      const d = new Date(g.data || g.createdAt);
      return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
    } catch { return false; }
  }).length;

  const el = id => document.getElementById(id);
  _animarNumero(el('stat-total'), total);
  _animarNumero(el('stat-hoje'),  deHoje);
  _animarNumero(el('stat-mes'),   doMes);
}

function _animarNumero(el, alvo) {
  if (!el) return;
  const duracao = 800;
  const inicio  = performance.now();
  function passo(agora) {
    const t = Math.min((agora - inicio) / duracao, 1);
    el.textContent = Math.round(t * alvo);
    if (t < 1) requestAnimationFrame(passo);
  }
  requestAnimationFrame(passo);
}


/* ═══════════════════════════════════════════════════════
   FILTRO E ORDENAÇÃO
═══════════════════════════════════════════════════════ */

function _filtrarEOrdenar(busca, ordem) {
  let lista = [..._todosGuardioes];

  /* Filtra por nome */
  if (busca.trim()) {
    const q = busca.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    lista = lista.filter(g => {
      const nome = g.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return nome.includes(q);
    });
  }

  /* Ordena */
  if (ordem === 'recente') {
    lista.sort((a, b) => new Date(b.data || b.createdAt) - new Date(a.data || a.createdAt));
  } else if (ordem === 'antigo') {
    lista.sort((a, b) => new Date(a.data || a.createdAt) - new Date(b.data || b.createdAt));
  } else if (ordem === 'nome') {
    lista.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  }

  return lista;
}


/* ═══════════════════════════════════════════════════════
   CARREGAMENTO INICIAL
═══════════════════════════════════════════════════════ */

async function carregarGaleria() {
  const loading = document.getElementById('galeria-loading');
  const erro    = document.getElementById('galeria-erro');
  const grid    = document.getElementById('galeria-grid');

  loading?.classList.remove('hidden');
  erro?.classList.add('hidden');
  if (grid) grid.innerHTML = '';

  try {
    _todosGuardioes = await buscarGuardioes();
    _atualizarStats(_todosGuardioes);
    const busca  = document.getElementById('galeria-busca')?.value  || '';
    const ordem  = document.getElementById('galeria-ordenar')?.value || 'recente';
    _renderizarGrade(_filtrarEOrdenar(busca, ordem));
  } catch (err) {
    console.error('[Galeria] Erro ao carregar:', err);
    const msg = document.getElementById('galeria-erro-msg');
    if (msg) msg.textContent = `Não foi possível carregar a galeria. (${err.message})`;
    erro?.classList.remove('hidden');
  } finally {
    loading?.classList.add('hidden');
  }
}


/* ═══════════════════════════════════════════════════════
   INICIALIZAÇÃO
═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  /* Ano no rodapé */
  const anoEl = document.getElementById('galeria-ano');
  if (anoEl) anoEl.textContent = new Date().getFullYear();

  /* Carrega guardiões */
  carregarGaleria();

  /* Retry em caso de erro */
  document.getElementById('galeria-btn-retry')
    ?.addEventListener('click', carregarGaleria);

  /* Busca em tempo real (debounce 300ms) */
  let debounce;
  document.getElementById('galeria-busca')?.addEventListener('input', e => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      const ordem = document.getElementById('galeria-ordenar')?.value || 'recente';
      _renderizarGrade(_filtrarEOrdenar(e.target.value, ordem));
    }, 300);
  });

  /* Reordenar */
  document.getElementById('galeria-ordenar')?.addEventListener('change', e => {
    const busca = document.getElementById('galeria-busca')?.value || '';
    _renderizarGrade(_filtrarEOrdenar(busca, e.target.value));
  });
});
