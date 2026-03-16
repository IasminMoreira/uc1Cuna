'use strict';

const SUPABASE_URL      = 'https://vsibscelximuiciefcgt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Lc4tfyjQ6h9HLAVSb9ks1Q_2heTmAup';

const SELOS = [
  { icon: '🌱', label: 'Iniciante' },
  { icon: '🏠', label: 'Internas'  },
  { icon: '☀️', label: 'Jardim'    },
  { icon: '🌧', label: 'Chuva'     },
];

let _sb = null;
function _getClient() {
  if (_sb) return _sb;
  if (typeof supabase === 'undefined' || !supabase.createClient)
    throw new Error('SDK do Supabase não carregou.');
  _sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return _sb;
}

async function buscarGuardioes() {
  const { data, error } = await _getClient()
    .from('guardioes')
    .select('id, nome, data, nivel')
    .order('data', { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

async function salvarGuardiao(dados) {
  const { data, error } = await _getClient()
    .from('guardioes')
    .insert([{
      nome:         dados.nome,
      data:         dados.data || new Date().toISOString(),
      nivel:        dados.nivel || 'Guardião Expert',
      thumb_base64: dados.thumbBase64 || null,
    }])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

let _todos = [];

function _esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function _formatarData(iso) {
  try { return new Date(iso).toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'}); }
  catch { return iso; }
}

function _card(g, delay) {
  const el = document.createElement('article');
  el.className = 'guardiao-card';
  el.style.animationDelay = `${delay}ms`;
  el.innerHTML = `
    <div class="card-header">
      <span class="card-emblema" aria-hidden="true">🌿</span>
      <h2 class="card-nome">${_esc(g.nome)}</h2>
    </div>
    <div class="card-divisor"></div>
    <p class="card-nivel">${_esc(g.nivel||'Guardião Expert')}</p>
    <div class="card-selos">
      ${SELOS.map(s=>`<span class="card-selo"><span aria-hidden="true">${s.icon}</span>${s.label}</span>`).join('')}
    </div>
    <p class="card-data">${_formatarData(g.data)}</p>
    <span class="card-cuna" aria-hidden="true">Cuna · Jardim Urbano</span>`;
  return el;
}

function _render(lista) {
  const grid=document.getElementById('galeria-grid'), empty=document.getElementById('galeria-empty');
  if (!grid) return;
  grid.innerHTML='';
  if (!lista?.length){empty?.classList.remove('hidden');return;}
  empty?.classList.add('hidden');
  lista.forEach((g,i)=>grid.appendChild(_card(g,i*35)));
}

function _stats(lista) {
  const hoje=new Date().toDateString(), m=new Date().getMonth(), y=new Date().getFullYear();
  const anim=(id,v)=>{
    const el=document.getElementById(id); if(!el)return;
    const t0=performance.now();
    (function s(now){const p=Math.min((now-t0)/700,1);el.textContent=Math.round(p*v);if(p<1)requestAnimationFrame(s);})(t0);
  };
  anim('stat-total',lista.length);
  anim('stat-hoje', lista.filter(g=>{try{return new Date(g.data).toDateString()===hoje;}catch{return false;}}).length);
  anim('stat-mes',  lista.filter(g=>{try{const d=new Date(g.data);return d.getMonth()===m&&d.getFullYear()===y;}catch{return false;}}).length);
}

function _filtrar(busca,ordem){
  let l=[..._todos];
  if(busca.trim()){
    const q=busca.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    l=l.filter(g=>g.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(q));
  }
  if(ordem==='recente') l.sort((a,b)=>new Date(b.data)-new Date(a.data));
  else if(ordem==='antigo') l.sort((a,b)=>new Date(a.data)-new Date(b.data));
  else if(ordem==='nome') l.sort((a,b)=>a.nome.localeCompare(b.nome,'pt-BR'));
  return l;
}

async function carregarGaleria(){
  const loading=document.getElementById('galeria-loading');
  const erro=document.getElementById('galeria-erro');
  const grid=document.getElementById('galeria-grid');
  loading?.classList.remove('hidden');
  erro?.classList.add('hidden');
  if(grid) grid.innerHTML='';
  try{
    _todos=await buscarGuardioes();
    _stats(_todos);
    _render(_filtrar(
      document.getElementById('galeria-busca')?.value||'',
      document.getElementById('galeria-ordenar')?.value||'recente'
    ));
  }catch(err){
    console.error('[Galeria]',err);
    const msg=document.getElementById('galeria-erro-msg');
    if(msg) msg.textContent=`Erro ao carregar: ${err.message}`;
    erro?.classList.remove('hidden');
  }finally{
    loading?.classList.add('hidden');
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  const ano=document.getElementById('galeria-ano');
  if(ano) ano.textContent=new Date().getFullYear();
  carregarGaleria();
  document.getElementById('galeria-btn-retry')?.addEventListener('click',carregarGaleria);
  let db;
  document.getElementById('galeria-busca')?.addEventListener('input',e=>{
    clearTimeout(db);
    db=setTimeout(()=>_render(_filtrar(e.target.value,document.getElementById('galeria-ordenar')?.value||'recente')),300);
  });
  document.getElementById('galeria-ordenar')?.addEventListener('change',e=>{
    _render(_filtrar(document.getElementById('galeria-busca')?.value||'',e.target.value));
  });
});
