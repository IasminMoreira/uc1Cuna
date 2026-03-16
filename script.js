/**
 * ═══════════════════════════════════════════════════════════
 * JARDIM URBANO — script.js (v4 — Final)
 *
 * Estágio 4 — O Retorno Transformador:
 *   Modo 'reflect' — as plantas do apartamento voltam felizes.
 *   O jogador clica nas plantas para ouvir uma fala de
 *   reconhecimento. A Jabuticabeira (como fruta na mesa)
 *   entrega a mensagem final da jornada.
 *
 *   irParaEstagioFinal() → transição com animação dourada
 *   Guia de Cuidados     → modal com dados reais das plantas
 *   Recomeçar Jornada    → reinicia o gameState e o DOM
 * ═══════════════════════════════════════════════════════════
 */


/* ═══════════════════════════════════════════════════════════
   1. BASE DE DADOS — PLANTAS (todos os estágios)
═══════════════════════════════════════════════════════════ */
const PLANT_DATA = {

  /* ── Estágio 1 ── */
  maranta: {
    stage: 1, mode: 'care',
    name: 'Maranta-zebrina', icon: '🌿',
    needIcon: '💧', caredIcon: '✨',
    action: 'Regar com carinho',
    flavor: 'As folhas listradas da Maranta estão caídas — ela está com sede. Você pega o regador de bico fino e hidrata a terra devagar, em círculos. As folhas lentamente se erguem, gratas.',
  },
  samambaia: {
    stage: 1, mode: 'care',
    name: 'Samambaia-asplênio', icon: '🌿',
    needIcon: '🌿', caredIcon: '✨',
    action: 'Borrifar e ajustar',
    flavor: 'As pontas das frondes estão secas e quebradiças. Você borrifa água fina sobre cada fronde e ajeita as mais caídas para que recebam ar. Ela respira aliviada.',
  },
  palmeira: {
    stage: 1, mode: 'care',
    name: 'Palmeira-juçara', icon: '🌴',
    needIcon: '☀️', caredIcon: '✨',
    action: 'Girar o vaso',
    flavor: 'A palmeira está inclinada em direção à janela, buscando luz. Você gira o vaso 180° para que o outro lado também receba sol. As folhas apontam ao céu com renovado vigor.',
  },
  bromelia: {
    stage: 1, mode: 'care',
    name: 'Bromélia-gusmânia', icon: '🌺',
    needIcon: '🌺', caredIcon: '✨',
    action: 'Encher a roseta',
    flavor: 'A bromélia acumula água no funil formado por suas folhas centrais — esse reservatório está vazio. Você despeja água fresca ali. A flor vermelha no centro pulsa viva.',
  },

  /* ── Estágio 2 ── */
  ipe: {
    stage: 2, mode: 'care',
    name: 'Ipê-amarelo', icon: '🌼',
    needIcon: '💧', caredIcon: '✨',
    action: 'Regar a base',
    flavor: 'O ipê está ressecado — a calçada de concreto aquece demais as raízes. Você abre o registro do mangueiro e deixa a água correr devagar ao redor do tronco. As flores amarelas tremem de alívio.',
  },
  manaca: {
    stage: 2, mode: 'care',
    name: 'Manacá-da-serra', icon: '💜',
    needIcon: '✂️', caredIcon: '✨',
    action: 'Podar os galhos secos',
    flavor: 'O manacá tem galhos cruzados que roubam luz uns dos outros. Com uma tesoura de poda, você remove os ramos mortos. A planta logo mostra novas brotações lilás.',
  },
  quaresmeira: {
    stage: 2, mode: 'care',
    name: 'Quaresmeira', icon: '🌸',
    needIcon: '🌸', caredIcon: '✨',
    action: 'Adubar o solo',
    flavor: 'As flores da quaresmeira estão pálidas — o solo está esgotado. Você mistura adubo orgânico à terra ao redor das raízes. Em minutos, as pétalas retomam seu rosa vibrante.',
  },
  jabuticabeira: {
    stage: 2, mode: 'care',
    name: 'Jabuticabeira', icon: '🫐',
    needIcon: '🔒', caredIcon: '🫐',
    action: 'Regar o caule',
    flavor: 'A jabuticabeira floresce diretamente no tronco — uma raridade. Você rega com cuidado ao redor da casca rugosa. Pequeníssimas flores brancas abrem, e logo surgem os frutos roxo-escuros, lustrosos.',
    dropsItem: {
      id: 'jabuticaba', name: 'Jabuticaba', icon: '🫐',
      desc: 'Um fruto fresco, colhido do tronco. Dizem que abre portas inesperadas.',
    },
    lockedMsg: 'A jabuticabeira aguarda, silenciosa. Cuide das outras plantas do jardim primeiro — ela exige paciência.',
  },

  /* ── Estágio 3 ── */
  iris: {
    stage: 3, mode: 'visit',
    name: 'Íris-da-praia', icon: '🪻',
    needIcon: '☔', visitedIcon: '🏠',
    action: 'Observar a íris',
    flavor: 'Veja como minhas raízes bebem cada gota que cai. Nasci para isso — capturar a água das chuvas antes que ela escorra pelo concreto sem deixar rastro. Cada folha minha é um canal. Estou filtrando a cidade agora mesmo.',
  },
  guaivira: {
    stage: 3, mode: 'visit',
    name: 'Guaivira', icon: '🌀',
    needIcon: '☔', visitedIcon: '🏠',
    action: 'Ficar sob a copa',
    flavor: 'Olha como a água corre pelo meu tronco até o solo sem desperdiçar uma gota. Sou nativa do cerrado, sei o que é sobreviver. Aqui na calçada de concreto faço o que sempre fiz: retorno a água para a terra. Fique à vontade.',
  },
  inga: {
    stage: 3, mode: 'visit',
    name: 'Ingá-feijão', icon: '🌳',
    needIcon: '☔', visitedIcon: '🏠',
    action: 'Me proteger sob as folhas',
    flavor: 'Minha copa é ampla por um motivo — fui plantado aqui para dar sombra e abrigo. A chuva de dezembro em São Paulo? Já vi coisas piores. Cada gota que cai no meu solo alimenta insetos, pássaros, e a própria cidade. Segura aí.',
  },
  taboa: {
    stage: 3, mode: 'visit',
    name: 'Taboa', icon: '🌾',
    needIcon: '☔', visitedIcon: '🏠',
    action: 'Conhecer a taboa',
    flavor: 'Sou uma filtradora. Minhas raízes absorvem metais pesados, fósforo, nitrogênio — tudo o que a cidade descarta nas águas. Onde outros não sobrevivem, eu prospero. Cada chuva assim é o meu momento de trabalhar.',
  },

  /* ── Estágio 4 — Reflexão: plantas felizes ──
     mode: 'reflect' — clicáveis, mas apenas trocam uma fala.
     Não alteram o contador. A jabuticaba (mesa) tem seu próprio handler. */
  s4maranta: {
    stage: 4, mode: 'reflect',
    name: 'Maranta-zebrina', icon: '🌿',
    needIcon: '🌿',
    action: 'Admirar',
    flavor: 'Lembra quando minhas folhas estavam caídas? Olha agora — cada listra em plena forma. Obrigada pela água, pelo tempo, pela atenção. As plantas nunca esquecem quem cuida.',
  },
  s4samambaia: {
    stage: 4, mode: 'reflect',
    name: 'Samambaia-asplênio', icon: '🌿',
    needIcon: '🌿',
    action: 'Admirar',
    flavor: 'Cada fronde que você borrifou voltou mais forte. Minha espécie vive há 360 milhões de anos — mas ainda depende de um pouco de carinho humano para florescer dentro de casa.',
  },
  s4palmeira: {
    stage: 4, mode: 'reflect',
    name: 'Palmeira-juçara', icon: '🌴',
    needIcon: '🌴',
    action: 'Admirar',
    flavor: 'Giro do vaso, mudança de perspectiva. Não é diferente do que você fez ao longo dessa jornada — aprendeu a ver a cidade com outros olhos, como a natureza a enxerga.',
  },
  s4bromelia: {
    stage: 4, mode: 'reflect',
    name: 'Bromélia-gusmânia', icon: '🌺',
    needIcon: '🌺',
    action: 'Admirar',
    flavor: 'Minha roseta está cheia. Dentro dela se hospeda um mundo — insetos, rãzinhas, microorganismos. Um único gesto seu — encher de água — sustenta toda essa cadeia. Nunca subestime o pequeno.',
  },
};



/* ═══════════════════════════════════════════════════════════
   2. ITENS DE INVENTÁRIO
═══════════════════════════════════════════════════════════ */
const ITEM_DATA = {
  jabuticaba: {
    icon: '🫐', name: 'Jabuticaba',
    desc: 'Um fruto fresco colhido do tronco. Carregado na memória do retorno.',
  },
};


/* ═══════════════════════════════════════════════════════════
   4. ESTADO GLOBAL
═══════════════════════════════════════════════════════════ */
const gameState = {
  currentStage: 1,
  plants: {
    maranta: 'needing', samambaia: 'needing', palmeira: 'needing', bromelia: 'needing',
    ipe: 'needing', manaca: 'needing', quaresmeira: 'needing', jabuticabeira: 'locked',
    iris: 'visiting', guaivira: 'visiting', inga: 'visiting', taboa: 'visiting',
    s4maranta: 'reflect', s4samambaia: 'reflect', s4palmeira: 'reflect', s4bromelia: 'reflect',
  },
  caredByStage: { 1: 0, 2: 0, 3: 0, 4: 0 },
  totalByStage: { 1: 4, 2: 4, 3: 4, 4: 0 },   /* E4 sem contador — livre */
  inventory: [],
  activePlantId: null,
  rainActive: false,
  rainSplashInterval: null,
  finalMessageShown: false,
};


/* ═══════════════════════════════════════════════════════════
   5. CACHE DOM
═══════════════════════════════════════════════════════════ */
const DOM = {
  hudCount:      () => document.getElementById('hud-count'),
  hudTotal:      () => document.getElementById('hud-total'),
  hudStageLabel: () => document.getElementById('hud-stage-label'),
  hudInvWrapper: () => document.getElementById('hud-inv-wrapper'),
  hudInvItems:   () => document.getElementById('hud-inv-items'),
  nextBtn:       () => document.getElementById('next-stage-btn'),
  dialogOverlay: () => document.getElementById('dialog-overlay'),
  dialogBox:     () => document.getElementById('dialog-box'),
  dlgIcon:       () => document.getElementById('dlg-plant-icon'),
  dlgTitle:      () => document.getElementById('dlg-title'),
  dlgBody:       () => document.getElementById('dlg-body'),
  dlgActionBtn:  () => document.getElementById('dlg-action-btn'),
  sceneStage1:   () => document.getElementById('scene-stage1'),
  sceneStage2:   () => document.getElementById('scene-stage2'),
  sceneStage3:   () => document.getElementById('scene-stage3'),
  sceneStage4:   () => document.getElementById('scene-stage4'),
  rainOverlay:   () => document.getElementById('rain-overlay'),
  itemPopup:     () => document.getElementById('item-acquired-popup'),
  iapIcon:       () => document.getElementById('iap-icon'),
  iapName:       () => document.getElementById('iap-name'),
  iapDesc:       () => document.getElementById('iap-desc'),
  finalActions:  () => document.getElementById('final-actions'),
};

const el = id => document.getElementById(id);


/* ═══════════════════════════════════════════════════════════
   6. INICIALIZAÇÃO
═══════════════════════════════════════════════════════════ */
function init() {
  bindPlantEvents();
  bindFruitDisplay();

  DOM.dlgActionBtn().addEventListener('click', handleCareAction);

  /* Continuar — única forma de fechar o diálogo de planta */
  const closeBtnEl = document.getElementById('dlg-close-btn');
  if (closeBtnEl) closeBtnEl.addEventListener('click', closeDialog);

  DOM.nextBtn().addEventListener('click', handleNextStageBtn);

  /* Botão final */
  el('btn-restart').addEventListener('click', reiniciarJornada);

  /* Guia de Plantas */
  _bindGuia();

  renderAll();

  /* ── Sistema de Áudio ──
     initAudio() está definido em audio.js (carregado antes deste script).
     Configura o botão de mudo e registra o desbloqueio de autoplay. */
  if (typeof initAudio === 'function') initAudio();
}

function bindPlantEvents() {
  document.querySelectorAll('.plant').forEach(plantEl => {
    const clone = plantEl.cloneNode(true);
    plantEl.parentNode.replaceChild(clone, plantEl);
    clone.addEventListener('click',   () => handlePlantClick(clone));
    clone.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handlePlantClick(clone); }
    });
  });
}

/** Vincula o clique na exibição de jabuticaba na mesa do E4 */
function bindFruitDisplay() {
  const display = el('s4-jabuticaba-display');
  if (!display) return;
  display.addEventListener('click', handleJabuticabaFinal);
  display.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleJabuticabaFinal(); }
  });
}


/* ═══════════════════════════════════════════════════════════
   7. HANDLERS DE EVENTO
═══════════════════════════════════════════════════════════ */

function handlePlantClick(plantEl) {
  const plantId = plantEl.dataset.plant;
  const state   = gameState.plants[plantId];
  const data    = PLANT_DATA[plantId];
  if (!data) return;

  if (data.mode === 'reflect') {
    openReflectDialog(plantId);
    return;
  }
  if (data.mode === 'visit') {
    if (state === 'visited') return;
    gameState.activePlantId = plantId;
    openVisitDialog(plantId);
    return;
  }
  if (state === 'cared')  return;
  if (state === 'locked') { openLockedDialog(data); return; }
  gameState.activePlantId = plantId;
  openDialog(plantId);
}

function handleCareAction() {
  const plantId = gameState.activePlantId;
  if (!plantId) return;

  const data  = PLANT_DATA[plantId];
  const stage = data.stage;

  /* ── Reflexão (E4): fecha diretamente, sem efeito de estado ── */
  if (data.mode === 'reflect') {
    closeDialog();
    return;
  }

  /* ── Visita (E3): atualiza estado e SFX, mantém diálogo aberto ── */
  if (data.mode === 'visit') {
    gameState.plants[plantId] = 'visited';
    gameState.caredByStage[3]++;

    /* SFX de visita toca enquanto o jogador lê */
    if (typeof tocarSFX === 'function' && typeof sfxParaAcao === 'function') {
      const sfx = sfxParaAcao(plantId);
      if (sfx) tocarSFX(sfx);
    }

    /* Atualiza visual da planta imediatamente (mas diálogo continua aberto) */
    renderPlantVisited(plantId);
    renderHUD();
    if (gameState.caredByStage[3] >= gameState.totalByStage[3]) unlockNextStageBtn();

    /* Trocar botão de ação por Continuar */
    _mostrarBotaoContinuar();
    return;
  }

  /* ── Cuidado (E1/E2): atualiza estado e SFX, mantém diálogo aberto ── */
  gameState.plants[plantId] = 'cared';
  gameState.caredByStage[stage]++;

  /* SFX toca enquanto o jogador ainda lê o flavor text */
  if (typeof tocarSFX === 'function' && typeof sfxParaAcao === 'function') {
    const sfx = sfxParaAcao(plantId);
    if (sfx) tocarSFX(sfx);
  }

  /* Atualiza visual da planta imediatamente (mas diálogo continua aberto) */
  renderPlant(plantId);
  renderHUD();

  if (plantId === 'jabuticabeira' && data.dropsItem) {
    addToInventory(data.dropsItem.id);
    scheduleItemPopup(data.dropsItem, 400);
  }
  if (stage === 2 && plantId !== 'jabuticabeira') {
    const allCared = ['ipe', 'manaca', 'quaresmeira'].every(id => gameState.plants[id] === 'cared');
    if (allCared && gameState.plants.jabuticabeira === 'locked') unlockJabuticabeira();
  }
  if (gameState.caredByStage[gameState.currentStage] >= gameState.totalByStage[gameState.currentStage]) {
    unlockNextStageBtn();
  }

  /* Trocar botão de ação por Continuar */
  _mostrarBotaoContinuar();
}

/**
 * _mostrarBotaoContinuar — esconde o botão de ação e destaca o Continuar.
 * Chamado depois que a ação foi executada, para guiar o jogador a fechar.
 */
function _mostrarBotaoContinuar() {
  const actionBtn   = document.getElementById('dlg-action-btn');
  const continueBtn = document.getElementById('dlg-close-btn');
  if (actionBtn)   actionBtn.style.display = 'none';
  if (continueBtn) {
    continueBtn.classList.add('dlg-close-btn--primary');
    continueBtn.focus();
  }
}

/**
 * Clique na jabuticaba sobre a mesa — abre diálogo de transição,
 * depois dispara a tela de encerramento completa.
 */
function handleJabuticabaFinal() {
  const box = DOM.dialogBox();
  box.classList.add('golden-theme');
  DOM.dlgIcon().textContent = '🫐';
  DOM.dlgTitle().textContent = 'A Jabuticabeira fala';

  const temJabuticaba = gameState.inventory.includes('jabuticaba');
  DOM.dlgBody().textContent = temJabuticaba
    ? 'Você aprendeu a cuidar das nossas espécies nativas. Do apartamento à rua, da seca à tempestade — esteve junto. Agora a natureza vive com você, onde você for.'
    : 'Você chegou até aqui. Atravessou a chuva, ouviu as plantas, voltou para casa. A natureza que você cuida é a mesma que cuida de você.';

  DOM.dlgActionBtn().textContent = '🌱 Compreendo';
  DOM.dlgActionBtn().className   = 'btn-golden';

  if (typeof tocarSFX === 'function') tocarSFX('final');

  const btn = DOM.dlgActionBtn();
  btn.removeEventListener('click', handleCareAction);

  function onceFinale() {
    closeDialog();
    btn.removeEventListener('click', onceFinale);
    btn.addEventListener('click', handleCareAction);
    /* Ocultar toda a UI do jogo e abrir a tela de encerramento */
    DOM.nextBtn().style.display = 'none';
    DOM.finalActions().classList.add('hidden');
    /* Pequeno delay para o diálogo fechar antes do overlay abrir */
    setTimeout(abrirTelaEncerramento, 400);
  }
  btn.addEventListener('click', onceFinale);

  _showDialog();
  gameState.finalMessageShown = true;
}

function handleNextStageBtn() {
  if      (gameState.currentStage === 1) mudarParaEstagio2();
  else if (gameState.currentStage === 2) irParaEstagio3();
  else if (gameState.currentStage === 3) irParaEstagioFinal();
}


/* ═══════════════════════════════════════════════════════════
   8. TRANSIÇÕES DE ESTÁGIO
═══════════════════════════════════════════════════════════ */

function mudarParaEstagio2() {
  gameState.currentStage = 2;
  const btn = DOM.nextBtn();
  btn.style.display = 'none';
  btn.textContent = '🌧 Sair para a Rua';
  btn.classList.remove('btn-storm', 'btn-golden');
  switchScene(DOM.sceneStage1(), DOM.sceneStage2());
  renderHUD();
  bindPlantEvents();
  if (typeof tocarSom === 'function') tocarSom(2);
  _scrollToTop();
}

function irParaEstagio3() {
  gameState.currentStage = 3;
  const btn = DOM.nextBtn();
  btn.style.display = 'none';
  btn.textContent = '🏠 O Retorno';
  btn.classList.add('btn-storm');
  switchScene(DOM.sceneStage2(), DOM.sceneStage3());
  setTimeout(iniciarChuva, 700);
  if (typeof tocarSom === 'function') tocarSom(3);
  DOM.hudCount().closest('#hud').classList.add('hud-storm');
  DOM.hudCount().closest('#hud').classList.remove('hud-golden');
  renderHUD();
  bindPlantEvents();
  _scrollToTop();
}

/**
 * irParaEstagioFinal — transição para o Estágio 4.
 * 1. Para a chuva
 * 2. Troca a cena com animação dourada especial
 * 3. HUD fica com tom dourado
 * 4. Botão muda para indicador da jabuticaba
 */
function irParaEstagioFinal() {
  gameState.currentStage = 4;

  pararChuva();

  const btn = DOM.nextBtn();
  btn.style.display = 'none';
  btn.classList.remove('btn-storm');
  btn.classList.add('btn-golden');

  const hud = DOM.hudCount().closest('#hud');
  hud.classList.remove('hud-storm');
  hud.classList.add('hud-golden');

  /* Transição com animação especial */
  switchScene(DOM.sceneStage3(), DOM.sceneStage4(), 's4-enter');

  renderHUD();
  if (typeof tocarSom === 'function') tocarSom(4);
  _scrollToTop();
  setTimeout(() => {
    const display = el('s4-jabuticaba-display');
    if (display) {
      display.style.filter = 'brightness(1.3)';
      setTimeout(() => { display.style.filter = ''; }, 800);
    }
  }, 1500);

  bindPlantEvents();
  bindFruitDisplay();
}


/* ═══════════════════════════════════════════════════════════
   9. UTILITÁRIO DE TROCA DE CENA
═══════════════════════════════════════════════════════════ */
function switchScene(fromEl, toEl, extraClass = '') {
  if (fromEl) { fromEl.classList.remove('active'); fromEl.classList.add('hidden'); }
  if (toEl) {
    toEl.classList.remove('hidden');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      toEl.classList.add('active');
      if (extraClass) toEl.classList.add(extraClass);
    }));
  }
}


/* ═══════════════════════════════════════════════════════════
   10. SISTEMA DE CHUVA
═══════════════════════════════════════════════════════════ */
const RAIN_DROPS = 65;
const RAIN_SIZES = ['rd-s', 'rd-m', 'rd-l'];

function iniciarChuva() {
  if (gameState.rainActive) return;
  gameState.rainActive = true;
  const overlay = DOM.rainOverlay();
  if (!overlay) return;
  for (let i = 0; i < RAIN_DROPS; i++) overlay.appendChild(criarGota());
  gameState.rainSplashInterval = setInterval(criarRespingo, 320);
}

function criarGota() {
  const drop = document.createElement('div');
  drop.className = `raindrop ${RAIN_SIZES[Math.floor(Math.random() * RAIN_SIZES.length)]}`;
  drop.style.left   = `${Math.random() * 108 - 4}%`;
  drop.style.opacity = (0.3 + Math.random() * 0.6).toFixed(2);
  const dur = 0.55 + Math.random() * 0.55;
  drop.style.animationDuration = `${dur}s`;
  drop.style.animationDelay   = `${-(Math.random() * dur).toFixed(3)}s`;
  return drop;
}

function criarRespingo() {
  const room3 = el('room3');
  if (!room3 || !gameState.rainActive) return;
  const splash = document.createElement('div');
  splash.className = 'rain-splash';
  splash.style.left = `${20 + Math.random() * 60}%`;
  room3.appendChild(splash);
  setTimeout(() => { if (splash.parentNode) splash.remove(); }, 450);
}

function pararChuva() {
  gameState.rainActive = false;
  clearInterval(gameState.rainSplashInterval);
  const overlay = DOM.rainOverlay();
  if (overlay) overlay.innerHTML = '';
}


/* ═══════════════════════════════════════════════════════════
   11. JABUTICABEIRA (E2) — desbloqueio
═══════════════════════════════════════════════════════════ */
function unlockJabuticabeira() {
  gameState.plants.jabuticabeira = 'needing';
  const plantEl = el('plant-jabuticabeira');
  const iconEl  = el('need-jabuticabeira');
  const lockEl  = el('lock-overlay-jabuticabeira');
  if (!plantEl) return;
  plantEl.classList.remove('plant--locked');
  plantEl.classList.add('unlocked');
  if (iconEl) iconEl.textContent = '💧';
  if (lockEl) lockEl.classList.add('gone');
  plantEl.setAttribute('aria-label', 'Cuidar da Jabuticabeira');
  plantEl.style.transition = 'filter 0.6s';
  plantEl.style.filter = 'brightness(1.35)';
  setTimeout(() => { plantEl.style.filter = ''; }, 700);
  if (typeof tocarSFX === 'function') tocarSFX('unlock');
}


/* ═══════════════════════════════════════════════════════════
   12. INVENTÁRIO
═══════════════════════════════════════════════════════════ */
function addToInventory(itemId) {
  if (!gameState.inventory.includes(itemId)) {
    gameState.inventory.push(itemId);
    renderInventory();
  }
}

function renderInventory() {
  const wrapper = DOM.hudInvWrapper();
  const itemsEl = DOM.hudInvItems();
  if (gameState.inventory.length === 0) { wrapper.classList.add('hidden'); return; }
  wrapper.classList.remove('hidden');
  itemsEl.textContent = gameState.inventory.map(id => ITEM_DATA[id]?.icon || id).join(' ');
}

function scheduleItemPopup(itemData, delayMs = 0) {
  setTimeout(() => {
    DOM.iapIcon().textContent = itemData.icon;
    DOM.iapName().textContent = `+ ${itemData.name}`;
    DOM.iapDesc().textContent = itemData.desc;
    DOM.itemPopup().classList.remove('hidden');
    setTimeout(() => DOM.itemPopup().classList.add('hidden'), 4000);
  }, delayMs);
}


/* ═══════════════════════════════════════════════════════════
   13. REINICIAR JORNADA
═══════════════════════════════════════════════════════════ */
function reiniciarJornada() {
  /* Restaura body antes de recarregar (iOS cleanup) */
  const overlay = document.getElementById('ending-overlay');
  if (overlay && overlay._touchMoveHandler) {
    overlay.removeEventListener('touchmove', overlay._touchMoveHandler);
  }
  document.body.style.overflow = '';
  window.location.reload();
}

/* ═══════════════════════════════════════════════════════════
   GUIA DE PLANTAS — Catálogo por categorias
═══════════════════════════════════════════════════════════ */
const PLANT_GUIDE_DATA = {
  iniciantes: {
    label: 'Para Iniciantes', desc: 'Resistentes e Adaptáveis', icon: '🌱', cor: '#5a9e3a',
    plantas: [
      { id: 'pitangueira', nome: 'Pitangueira',  sci: 'Eugenia uniflora',               img: 'img/pitangueira.png', desc: 'Arbusto nativo da Mata Atlântica, produz pitangas ricas em vitamina C. Tolera poda, sol pleno e períodos de seca após estabelecida.', dica: 'Regue abundantemente nos primeiros 6 meses. Depois, a planta se vira com a chuva.' },
      { id: 'guaimbe',     nome: 'Guaimbê',       sci: 'Thaumatophyllum bipinnatifidum', img: 'img/guaimbe.png',     desc: 'Popular como "costela-de-adão". Tolera meia-sombra e esquecimentos de rega. Suas folhas fenestradas reduzem a resistência ao vento.', dica: 'Deixe o substrato secar parcialmente entre regas. Evite sol direto forte no verão.' },
      { id: 'clusia',      nome: 'Clúsia',         sci: 'Clusia fluminensis',              img: 'img/clusia.png',      desc: 'Espécie da restinga carioca. Extremamente resistente ao vento salino, seca e solo pobre. Produz frutos ornamentais e atrai pássaros.', dica: 'Praticamente não precisa de cuidados após o primeiro ano. Ideal para jardins de baixa manutenção.' },
      { id: 'peperomia',   nome: 'Peperômia',      sci: 'Peperomia scandens',              img: 'img/peperomia.png',   desc: 'Pequena suculenta tropical que acumula água nos caules carnosos. Perfeita para iniciantes por tolerar irrigações irregulares.', dica: 'Regue apenas quando o substrato estiver completamente seco. Excesso de água é o único erro fatal.' },
    ],
  },
  internos: {
    label: 'Ambientes Internos', desc: 'Meia-sombra e Sombra', icon: '🏠', cor: '#7b5ea7',
    plantas: [
      { id: 'maranta',   nome: 'Maranta-zebrina',    sci: 'Goeppertia zebrina',  img: 'img/maranta-zebrina.png',   desc: 'As folhas listradas dobram-se à noite num fenômeno chamado nictinastia. Nativa do sudeste do Brasil, prefere ambientes úmidos e sombreados.', dica: 'Borrife as folhas 2×/semana. Nunca deixe o prato acumular água parada.' },
      { id: 'samambaia', nome: 'Samambaia-asplênio', sci: 'Asplenium nidus',     img: 'img/samambaia-asplenio.png', desc: 'Suas frondes largas e brilhantes captam luz difusa com eficiência. Não tolera sol direto — as folhas queimam com facilidade.', dica: 'Regue sempre no substrato, nunca no centro da roseta. Fertilize mensalmente com adubo foliar diluído.' },
      { id: 'palmeira',  nome: 'Palmeira-juçara',    sci: 'Euterpe edulis',      img: 'img/palmeira-jucara.png',  desc: 'Espécie criticamente ameaçada da Mata Atlântica. Cultivá-la é um ato de conservação. Cresce lentamente e aceita meia-sombra.', dica: 'Gire o vaso 90° a cada mês para crescimento simétrico. Solo bem drenado é essencial.' },
      { id: 'bromelia',  nome: 'Bromélia-gusmânia',  sci: 'Guzmania lingulata',  img: 'img/bromelia-gusmania.png',  desc: 'Epífita da Mata Atlântica que acumula água na roseta central. A bráctea colorida dura até 6 meses e atrai beija-flores.', dica: 'Mantenha a roseta com água fresca; troque a cada 15 dias. Nunca regue diretamente no solo.' },
    ],
  },
  jardim: {
    label: 'Para Jardim', desc: 'Sol Pleno e Paisagismo', icon: '☀️', cor: '#c47b1a',
    plantas: [
      { id: 'ipe',           nome: 'Ipê-amarelo',    sci: 'Handroanthus albus',  img: 'img/ipe-amarelo.png',           desc: 'Símbolo nacional do Brasil. Floresce antes das folhas (jun–ago) cobrindo calçadas de amarelo puro. Atrai beija-flores.', dica: 'Rega generosa no verão, reduzida no inverno. Adube com NPK 10-10-10 no início do verão.' },
      { id: 'manaca',        nome: 'Manacá-da-serra', sci: 'Pleroma mutabile',    img: 'img/manaca-serra.png',        desc: 'Produz flores que mudam de cor: surgem brancas, viram lilás e terminam roxas — às vezes as três cores coexistem no mesmo arbusto.', dica: 'Poda leve após a floração estimula nova brotação. Prefere solo levemente ácido.' },
      { id: 'jabuticabeira', nome: 'Jabuticabeira',   sci: 'Plinia cauliflora',   img: 'img/jabuticabeira.png', desc: 'Os frutos nascem diretamente no tronco, num fenômeno chamado caulifloria. Crescimento lento, mas altamente recompensador.', dica: 'Pode demorar 8–15 anos para frutificar. Regue ao redor do caule; fertilize anualmente.' },
      { id: 'quaresmeira',   nome: 'Quaresmeira',     sci: 'Pleroma granulosum',  img: 'img/quaresmeira.png',   desc: 'Uma das árvores mais exuberantes das calçadas paulistanas. Floresce entre fevereiro e abril, cobrindo ruas de lilás intenso.', dica: 'Adube com composto orgânico na primavera. Tolera sol pleno e períodos de seca leve.' },
    ],
  },
  chuva: {
    label: 'Jardim de Chuva', desc: 'Suportam Encharcamento', icon: '🌧', cor: '#2077b4',
    plantas: [
      { id: 'iris',    nome: 'Íris-da-praia', sci: 'Neomarica candida',         img: 'img/iris-praia.png',    desc: 'Produz flores efêmeras que duram apenas um dia, mas surgem em sucessão ao longo de semanas. Tolera solos encharcados.', dica: 'Plante em bordas de canteiros inundáveis. Replante os filhotes que surgem nas flores velhas.' },
      { id: 'guaivira', nome: 'Guaivira',     sci: 'Campomanesia guazumifolia', img: 'img/guaivira.png', desc: 'Mirtácea nativa do cerrado e da Mata Atlântica. Tolera solos temporariamente encharcados e auxilia na infiltração pluvial.', dica: 'Resistente após estabelecida. Ideal para jardins de chuva com inundação periódica de curta duração.' },
      { id: 'inga',    nome: 'Ingá-feijão',   sci: 'Inga edulis',               img: 'img/inga-feijao.png',    desc: 'Leguminosa fixadora de nitrogênio. Atrai pássaros e morcegos com seus frutos de polpa branca adocicada.', dica: 'Tolera solos temporariamente encharcados. Plante em canteiros com boa drenagem lateral.' },
      { id: 'taboa',   nome: 'Taboa',         sci: 'Typha domingensis',         img: 'img/taboa.png',   desc: 'Planta aquática essencial para jardins de chuva. Suas raízes filtram metais pesados, fósforo e nitrogênio.', dica: 'Plante em solo permanentemente úmido ou alagado. Corte as espigas secas no inverno.' },
    ],
  },
};

const PLANT_GUIDE_KEYS = ['iniciantes', 'internos', 'jardim', 'chuva'];
let _guiaCatActiva = PLANT_GUIDE_KEYS[0];

function abrirGuia() {
  const modal = document.getElementById('guia-modal');
  if (!modal) return;
  _guiaCatActiva = PLANT_GUIDE_KEYS[0];
  _buildGuiaTabs();
  mostrarCategoria(_guiaCatActiva);
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
  document.getElementById('btn-fechar-guia')?.focus();
}

function fecharGuia() {
  const modal = document.getElementById('guia-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}

function _buildGuiaTabs() {
  const nav = document.getElementById('guia-nav');
  if (!nav) return;
  nav.innerHTML = PLANT_GUIDE_KEYS.map(key => {
    const cat = PLANT_GUIDE_DATA[key];
    return `<button class="guia-nav-btn${key === _guiaCatActiva ? ' active' : ''}"
      data-cat="${key}" role="tab" aria-selected="${key === _guiaCatActiva}"
      style="--cat-cor: ${cat.cor}">
      <span class="guia-nav-icone">${cat.icon}</span>
      <span>${cat.label}</span>
    </button>`;
  }).join('');
  nav.querySelectorAll('.guia-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      _guiaCatActiva = btn.dataset.cat;
      nav.querySelectorAll('.guia-nav-btn').forEach(b => {
        const active = b.dataset.cat === _guiaCatActiva;
        b.classList.toggle('active', active);
        b.setAttribute('aria-selected', active);
      });
      mostrarCategoria(_guiaCatActiva);
    });
  });
}

function mostrarCategoria(categoria) {
  const conteudo = document.getElementById('guia-conteudo');
  if (!conteudo) return;
  const cat = PLANT_GUIDE_DATA[categoria];
  if (!cat) return;
  conteudo.innerHTML = `
    <div class="guia-cat-header" style="--cat-cor: ${cat.cor}">
      <span class="guia-cat-icone">${cat.icon}</span>
      <div>
        <strong class="guia-cat-nome">${cat.label}</strong>
        <span class="guia-cat-desc">${cat.desc}</span>
      </div>
      <span class="guia-cat-badge">${cat.plantas.length} espécies</span>
    </div>
    <div class="guia-grid">
      ${cat.plantas.map(p => _plantaCardHTML(p, cat.cor)).join('')}
    </div>`;
  conteudo.scrollTop = 0;
}

function _plantaCardHTML(p, cor) {
  return `
    <article class="guia-card" style="--cat-cor: ${cor}">
      <div class="guia-card-img-wrap">
        <img src="${p.img}" alt="${p.nome}" class="guia-card-img" loading="lazy"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="guia-card-img-fallback" style="display:none">🌿</div>
      </div>
      <div class="guia-card-body">
        <h3 class="guia-card-nome">${p.nome}</h3>
        <em class="guia-card-sci">${p.sci}</em>
        <p class="guia-card-desc">${p.desc}</p>
        <div class="guia-card-dica">
          <span class="guia-card-dica-label">💡 Dica de cuidado</span>
          <span class="guia-card-dica-texto">${p.dica}</span>
        </div>
      </div>
    </article>`;
}

function _bindGuia() {
  document.getElementById('btn-fechar-guia')
    ?.addEventListener('click', fecharGuia);
  document.getElementById('guia-modal')
    ?.addEventListener('click', e => { if (e.target.id === 'guia-modal') fecharGuia(); });
  document.addEventListener('keydown', e => {
    const modal = document.getElementById('guia-modal');
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) fecharGuia();
  });
}

/* ═══════════════════════════════════════════════════════════
   14b. TELA DE ENCERRAMENTO
   ── Orquestra todas as animações em sequência:
      1. Overlay aparece com animação CSS (ending-reveal)
      2. Folhas começam a cair (JS)
      3. Texto da linha 1 aparece via CSS delay
      4. Efeito typewriter escreve o nome "Cunan" (JS)
      5. Resto do texto aparece com classe .visible
      6. Áudio final (música do Suno) toca em volume total
═══════════════════════════════════════════════════════════ */

/* ── Configurações da tela de encerramento ──────────────── */
const ENDING_CONFIG = {
  /* Nome do protagonista — altere aqui se necessário */
  playerName: 'Cunan',

  /* Texto antes do nome (linha 1) */
  textBefore: 'você aprendeu a dar valor',

  /* Texto depois do nome (mesma linha) */
  textAfter: ' às suas origens da Mata Atlântica.',

  /* Parágrafo narrativo final */
  bodyText: 'Cada folha que você regou foi um ato de memória. Cada planta que você conheceu é um fragmento vivo do bioma que moldou este território antes de ser cidade. A floresta nunca sumiu — ela apenas esperou que alguém voltasse a olhar. A Cuna acredita que esse cuidado começa em casa, numa calçada, num vaso. Obrigada por plantar junto.',

  /* Velocidade do typewriter: ms por caractere */
  typewriterSpeed: 72,

  /* ⚠️  A URL da música final está em audio.js → ENDING_MUSIC_URL
         Altere lá para manter toda a gestão de áudio centralizada. */

  /* Quantidade de folhas caindo */
  leafCount: 28,

  /* Ícones disponíveis para as folhas */
  leafEmojis: ['🍃', '🌿', '🍂', '🌱', '☘️'],
};

/* ── Instância do áudio final ──
   A música de encerramento é gerenciada inteiramente por audio.js.
   A variável endingMusic e a lógica de fade NÃO ficam aqui.
   Use tocarMusicaFinal() (exposta por audio.js) para iniciá-la. */

/**
 * abrirTelaEncerramento — ponto de entrada público.
 * Chamada por handleJabuticabaFinal após fechar o diálogo.
 */
function abrirTelaEncerramento() {
  const overlay = document.getElementById('ending-overlay');
  if (!overlay) return;

  /* Parar a trilha ambiente atual com fade */
  if (typeof pararChuva === 'function') pararChuva();

  /* Preencher textos configuráveis */
  _preencherTextoEncerramento();

  /* Mostrar overlay (dispara animação CSS ending-reveal) */
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');

  /* iOS Safari fix: body overflow:hidden bloqueia scroll em elementos fixed.
     Ao abrir o overlay, remove o bloqueio do body e transfere o controle
     de scroll para o próprio overlay via stopPropagation no touchmove. */
  if (window.innerWidth <= 768) {
    document.body.style.overflow = 'hidden';
    overlay.style.overflowY = 'scroll';
    overlay.style.webkitOverflowScrolling = 'touch';
    overlay.scrollTop = 0;

    /* stopPropagation impede que o toque chegue ao body bloqueado */
    overlay._touchMoveHandler = function(e) { e.stopPropagation(); };
    overlay.addEventListener('touchmove', overlay._touchMoveHandler, { passive: true });
  }

  /* Iniciar folhas caindo */
  _iniciarFolhas();

  /* Orquestrar sequência de aparição do texto */
  _orquestrarSequencia();

  /* Iniciar música final */
  _iniciarMusicaFinal();

  /* Vincular botões da tela de encerramento */
  _bindBotoesEncerramento();
}

/** Preenche os textos da tela com os valores de ENDING_CONFIG */
function _preencherTextoEncerramento() {
  const line1 = document.getElementById('ending-line1');
  const name  = document.getElementById('ending-name');
  const suffix = document.getElementById('ending-suffix');
  const body  = document.getElementById('ending-body');

  if (line1)  line1.textContent  = ENDING_CONFIG.textBefore;
  if (name)   name.textContent   = '';              /* preenchido pelo typewriter */
  if (suffix) suffix.textContent = '';              /* aparece após typewriter */
  if (body)   body.textContent   = ENDING_CONFIG.bodyText;
}

/**
 * _orquestrarSequencia — controla o timing de cada elemento.
 *
 * Linha do tempo (ms após abrir o overlay):
 *   0ms    → overlay aparece (CSS animation)
 *   800ms  → flora icons surgem (CSS delay)
 *   1100ms → supertítulo surge (CSS delay)
 *   1400ms → headline surge (CSS delay) + linha 1 visível
 *   1800ms → typewriter começa a escrever o nome
 *   após typewriter → sufixo + corpo + divisor + botões + crédito
 */
function _orquestrarSequencia() {
  const typewriterDelay = 1800;

  setTimeout(() => {
    _iniciarTypewriter(ENDING_CONFIG.playerName, () => {
      /* Callback executado após o nome terminar de ser digitado */
      _revelarPosTyewriter();
    });
  }, typewriterDelay);
}

/**
 * _iniciarTypewriter — escreve o nome caractere a caractere.
 * @param {string} texto — o nome a ser digitado
 * @param {Function} onComplete — callback ao terminar
 */
function _iniciarTypewriter(texto, onComplete) {
  const nameEl   = document.getElementById('ending-name');
  const cursorEl = document.getElementById('ending-cursor');
  if (!nameEl) { if (onComplete) onComplete(); return; }

  let i = 0;
  const velocidade = ENDING_CONFIG.typewriterSpeed;

  function digitarProximo() {
    if (i < texto.length) {
      nameEl.textContent += texto[i];
      i++;
      setTimeout(digitarProximo, velocidade + (Math.random() * 30 - 15));
    } else {
      /* Typewriter concluído — cursor pisca mais 600ms depois some */
      setTimeout(() => {
        if (cursorEl) cursorEl.style.display = 'none';
        if (onComplete) onComplete();
      }, 600);
    }
  }

  digitarProximo();
}

/**
 * _revelarPosTyewriter — faz surgir os elementos que aparecem
 * depois que o nome termina de ser digitado.
 */
function _revelarPosTyewriter() {
  const suffix   = document.getElementById('ending-suffix');
  const body     = document.getElementById('ending-body');
  const divider  = document.getElementById('ending-divider');
  const actions  = document.getElementById('ending-actions');
  const credit   = document.getElementById('ending-credit');

  /* Sufixo aparece imediatamente após o nome */
  if (suffix) suffix.textContent = ENDING_CONFIG.textAfter;

  /* Os demais surgem em cascata */
  const revelar = (el, delay) => {
    setTimeout(() => { if (el) el.classList.add('visible'); }, delay);
  };

  revelar(body,    200);
  revelar(divider, 700);
  revelar(actions, 1000);
  revelar(credit,  1600);
}

/** Gera as folhas caindo e as injeta no container */
function _iniciarFolhas() {
  const container = document.getElementById('leaves-container');
  if (!container) return;
  container.innerHTML = '';

  const { leafCount, leafEmojis } = ENDING_CONFIG;

  for (let i = 0; i < leafCount; i++) {
    const leaf = document.createElement('div');
    leaf.className = 'leaf-particle';
    leaf.textContent = leafEmojis[Math.floor(Math.random() * leafEmojis.length)];

    /* Posição e tamanho aleatórios */
    const leftPct   = Math.random() * 100;
    const duration  = 4 + Math.random() * 6;     /* 4–10s */
    const delay     = Math.random() * 8;           /* 0–8s */
    const size      = 14 + Math.random() * 14;    /* 14–28px */
    const opacity   = 0.55 + Math.random() * 0.45;

    leaf.style.cssText = `
      left: ${leftPct}%;
      font-size: ${size}px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      opacity: 0;
      max-opacity: ${opacity};
    `;

    /* Re-adicionar a folha ao terminar para criar loop contínuo */
    leaf.addEventListener('animationend', () => {
      leaf.style.animationDelay = `${Math.random() * 3}s`;
      leaf.style.left = `${Math.random() * 100}%`;
      /* Reiniciar a animação */
      leaf.style.animation = 'none';
      void leaf.offsetWidth;  /* reflow trick */
      leaf.style.animation = '';
    });

    container.appendChild(leaf);
  }
}

/** Delega a música final para audio.js, que centraliza toda a gestão de áudio */
function _iniciarMusicaFinal() {
  if (typeof tocarMusicaFinal === 'function') {
    tocarMusicaFinal();
  }
}

/** Vincula os botões da tela de encerramento */
function _bindBotoesEncerramento() {
  const btnCert    = document.getElementById('btn-certificado');
  const btnGuia    = document.getElementById('btn-abrir-guia');
  const btnRestart = document.getElementById('btn-restart-ending');
  const btnFechar  = document.getElementById('btn-fechar-guia');

  if (btnCert)    btnCert.addEventListener('click', baixarCertificado);
  if (btnGuia)    btnGuia.addEventListener('click', abrirGuia);
  if (btnRestart) btnRestart.addEventListener('click', reiniciarJornada, { once: true });
  if (btnFechar)  btnFechar.addEventListener('click', fecharGuia);
}


/* ═══════════════════════════════════════════════════════════
   CERTIFICADO DE GUARDIÃO
═══════════════════════════════════════════════════════════ */
function baixarCertificado() {
  const modal = document.getElementById('nome-modal');
  if (!modal) return;
  const input = document.getElementById('nome-input');
  if (input) {
    const nome = ENDING_CONFIG.playerName;
    input.value = (nome && nome !== 'Cunan') ? nome : '';
  }
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
  setTimeout(() => input && input.focus(), 50);

  const btnConfirmar = document.getElementById('nome-modal-confirmar');
  const btnCancelar  = document.getElementById('nome-modal-cancelar');

  function onConfirmar() {
    const nome = (input?.value || '').trim() || 'Guardião';
    _fecharNomeModal(); _gerarPNGCertificado(nome); cleanup();
  }
  function onCancelar() { _fecharNomeModal(); cleanup(); }
  function onKeydown(e) {
    if (e.key === 'Enter') onConfirmar();
    if (e.key === 'Escape') onCancelar();
  }
  function cleanup() {
    btnConfirmar?.removeEventListener('click', onConfirmar);
    btnCancelar?.removeEventListener('click', onCancelar);
    input?.removeEventListener('keydown', onKeydown);
  }
  btnConfirmar?.addEventListener('click', onConfirmar);
  btnCancelar?.addEventListener('click', onCancelar);
  input?.addEventListener('keydown', onKeydown);
}

function _fecharNomeModal() {
  const modal = document.getElementById('nome-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}

function _gerarPNGCertificado(nome) {
  const nomeEl = document.getElementById('cert-nome');
  const dataEl = document.getElementById('cert-data');
  const hoje   = new Date();
  const dataFormatada = hoje.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  if (nomeEl) nomeEl.textContent = nome;
  if (dataEl) dataEl.textContent = dataFormatada;

  const cert    = document.getElementById('certificado');
  if (!cert) return;
  const btnOrig = document.getElementById('btn-certificado');
  if (btnOrig) { btnOrig.textContent = '⏳ Gerando…'; btnOrig.disabled = true; }

  html2canvas(cert, { scale: 1, useCORS: true, backgroundColor: null, width: 1080, height: 756, logging: false })
    .then(canvas => {
      /* 1. Download do PNG para o usuário */
      const link = document.createElement('a');
      const nomeSanitizado = nome.replace(/[^a-zA-Z0-9À-ÿ\s-]/g, '').trim().replace(/\s+/g, '-');
      link.download = `certificado-guardiao-${nomeSanitizado}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      /* 2. Envia para a Galeria de Guardiões (não bloqueia o download) */
      _enviarParaGaleria({
        nome:        nome,
        data:        hoje.toISOString(),
        nivel:       'Guardião Expert',
        thumbBase64: canvas.toDataURL('image/jpeg', 0.5),  /* thumbnail comprimido */
      });

      if (btnOrig) {
        btnOrig.innerHTML = '<span class="btn-icon">🏅</span> Gerar Certificado de Guardião';
        btnOrig.disabled  = false;
      }
    })
    .catch(() => {
      if (btnOrig) {
        btnOrig.innerHTML = '<span class="btn-icon">🏅</span> Gerar Certificado de Guardião';
        btnOrig.disabled  = false;
      }
    });
}

/**
 * _enviarParaGaleria — POST para a API da Cuna.
 * Falha silenciosa: não interrompe a experiência do jogador.
 *
 * Endpoint esperado: POST https://api.cuna.com.br/v1/guardioes
 * Body: { nome, data, nivel, thumbBase64 }
 */
async function _enviarParaGaleria(dados) {
  try {
    if (typeof salvarGuardiao === 'function') {
      await salvarGuardiao(dados);
      console.info('[Galeria] Guardião salvo:', dados.nome);
    } else {
      console.warn('[Galeria] salvarGuardiao não encontrado — galeria.js carregado?');
    }
  } catch (err) {
    console.warn('[Galeria] Erro ao salvar:', err.message);
  }
}


/* ═══════════════════════════════════════════════════════════
   15. DIÁLOGOS
═══════════════════════════════════════════════════════════ */
function openDialog(plantId) {
  const data = PLANT_DATA[plantId];
  DOM.dialogBox().classList.remove('storm-theme', 'golden-theme');
  DOM.dlgIcon().textContent      = data.icon;
  DOM.dlgTitle().textContent     = data.name;
  DOM.dlgBody().textContent      = data.flavor;
  DOM.dlgActionBtn().textContent = data.action;
  DOM.dlgActionBtn().className   = '';
  _showDialog();
}

function openVisitDialog(plantId) {
  const data = PLANT_DATA[plantId];
  DOM.dialogBox().classList.add('storm-theme');
  DOM.dialogBox().classList.remove('golden-theme');
  DOM.dlgIcon().textContent      = data.icon;
  DOM.dlgTitle().textContent     = data.name;
  DOM.dlgBody().textContent      = data.flavor;
  DOM.dlgActionBtn().textContent = data.action;
  DOM.dlgActionBtn().className   = 'btn-rain';
  _showDialog();
}

/**
 * openReflectDialog — fala das plantas felizes no E4.
 * Ao fechar, marca como 'visited' e verifica se as 4 foram lidas.
 * Quando todas 4 são lidas, revela a jabuticabeira com fade-in.
 */
function openReflectDialog(plantId) {
  const data = PLANT_DATA[plantId];
  DOM.dialogBox().classList.add('golden-theme');
  DOM.dialogBox().classList.remove('storm-theme');
  DOM.dlgIcon().textContent      = data.icon;
  DOM.dlgTitle().textContent     = data.name;
  DOM.dlgBody().textContent      = data.flavor;
  DOM.dlgActionBtn().textContent = '🌿 Que bom';
  DOM.dlgActionBtn().className   = 'btn-golden';

  const btn = DOM.dlgActionBtn();
  btn.removeEventListener('click', handleCareAction);
  function onceClose() {
    /* Marca como visitada */
    gameState.plants[plantId] = 'visited';
    closeDialog();
    btn.removeEventListener('click', onceClose);
    btn.addEventListener('click', handleCareAction);
    /* Verifica se as 4 plantas do E4 foram lidas */
    _verificarPlantasE4();
  }
  btn.addEventListener('click', onceClose);

  gameState.activePlantId = plantId;
  _showDialog();
}

/**
 * _verificarPlantasE4 — conta quantas plantas do E4 foram lidas.
 * Quando todas 4 estiverem 'visited', revela a jabuticabeira
 * com fade-in suave para que o jogador possa encerrar a jornada.
 */
function _verificarPlantasE4() {
  const E4 = ['s4maranta', 's4samambaia', 's4palmeira', 's4bromelia'];
  const lidas = E4.filter(id => gameState.plants[id] === 'visited').length;

  if (lidas < E4.length) return; /* ainda faltam plantas */

  /* Todas lidas — revela a jabuticabeira com fade-in */
  const display = document.getElementById('s4-jabuticaba-display');
  if (display && display.classList.contains('hidden-until-ready')) {
    display.classList.remove('hidden-until-ready');
    display.classList.add('reveal-fade');
  }
}

function openLockedDialog(data) {
  DOM.dialogBox().classList.remove('storm-theme', 'golden-theme');
  DOM.dlgIcon().textContent      = '🔒';
  DOM.dlgTitle().textContent     = data.name;
  DOM.dlgBody().textContent      = data.lockedMsg || 'Esta planta ainda não pode ser cuidada.';
  DOM.dlgActionBtn().textContent = 'Entendido';
  DOM.dlgActionBtn().className   = '';

  const btn = DOM.dlgActionBtn();
  btn.removeEventListener('click', handleCareAction);
  function onceClose() {
    closeDialog();
    btn.removeEventListener('click', onceClose);
    btn.addEventListener('click', handleCareAction);
  }
  btn.addEventListener('click', onceClose);
  _showDialog();
}

function _showDialog() {
  DOM.dialogOverlay().classList.add('open');
  DOM.dialogOverlay().removeAttribute('aria-hidden');
  DOM.dlgActionBtn().focus();
}

function closeDialog() {
  DOM.dialogOverlay().classList.remove('open');
  DOM.dialogOverlay().setAttribute('aria-hidden', 'true');

  /* Restaurar handler e visibilidade do botão de ação */
  const actionBtn = DOM.dlgActionBtn();
  actionBtn.removeEventListener('click', handleCareAction);
  actionBtn.addEventListener('click', handleCareAction);
  actionBtn.className   = '';
  actionBtn.style.display = '';

  /* Remover estilo primário do Continuar */
  const continueBtn = document.getElementById('dlg-close-btn');
  if (continueBtn) continueBtn.classList.remove('dlg-close-btn--primary');

  DOM.dialogBox().classList.remove('storm-theme', 'golden-theme');

  /* Parar SFX de ação que ainda esteja tocando */
  if (typeof pararSFX === 'function') pararSFX();

  /* No Estágio 3, cancelar trovão pendente */
  if (gameState.currentStage === 3 && typeof pararTrovoes === 'function') {
    pararTrovoes();
  }

  gameState.activePlantId = null;
}


/* ═══════════════════════════════════════════════════════════
   16. BOTÃO DE AVANÇAR
═══════════════════════════════════════════════════════════ */
function unlockNextStageBtn() {
  const btn = DOM.nextBtn();
  btn.style.display = 'block';
  btn.setAttribute('aria-hidden', 'false');
  btn.focus();
}


/* ═══════════════════════════════════════════════════════════
   17. RENDERIZAÇÃO
═══════════════════════════════════════════════════════════ */
function renderAll() {
  Object.keys(gameState.plants).forEach(id => {
    const data = PLANT_DATA[id];
    if (!data) return;
    if (data.mode === 'visit')    renderPlantVisited(id, false);
    else if (data.mode === 'reflect') { /* E4 plants always show happy icon */ }
    else                          renderPlant(id);
  });
  renderHUD();
  renderInventory();
  /* Registrar E1 como estágio de áudio atual (toca ao desbloquear autoplay) */
  if (typeof tocarSom === 'function') tocarSom(1);
}

function renderPlant(plantId) {
  const state   = gameState.plants[plantId];
  const data    = PLANT_DATA[plantId];
  const plantEl = el(`plant-${plantId}`);
  const iconEl  = el(`need-${plantId}`);
  if (!plantEl || !iconEl || !data) return;

  switch (state) {
    case 'cared':
      plantEl.classList.add('cared'); plantEl.classList.remove('plant--locked');
      iconEl.textContent = data.caredIcon;
      plantEl.setAttribute('aria-label', `${data.name} — cuidada`);
      plantEl.style.cursor = 'default';
      break;
    case 'locked':
      plantEl.classList.add('plant--locked');
      iconEl.textContent = '🔒';
      break;
    default:
      plantEl.classList.remove('cared', 'plant--locked');
      iconEl.textContent = data.needIcon;
      plantEl.setAttribute('aria-label', `Cuidar da ${data.name}`);
      plantEl.style.cursor = 'pointer';
  }
}

function renderPlantVisited(plantId, animate = true) {
  const state   = gameState.plants[plantId];
  const data    = PLANT_DATA[plantId];
  const plantEl = el(`plant-${plantId}`);
  const iconEl  = el(`need-${plantId}`);
  if (!plantEl || !iconEl || !data) return;

  if (state === 'visited') {
    if (animate) plantEl.classList.add('visited');
    iconEl.textContent = data.visitedIcon;
    plantEl.setAttribute('aria-label', `${data.name} — visitada`);
    plantEl.style.cursor = 'default';
  } else {
    iconEl.textContent = data.needIcon;
    plantEl.setAttribute('aria-label', `Conversar com a ${data.name}`);
    plantEl.style.cursor = 'pointer';
  }
}

function renderHUD() {
  const stage = gameState.currentStage;
  const cared = gameState.caredByStage[stage];
  const total = gameState.totalByStage[stage];

  const stageLabels = {
    1: 'Estágio 1 · Apartamento',
    2: 'Estágio 2 · Jardim',
    3: 'Estágio 3 · A Rua',
    4: 'Estágio 4 · O Retorno',
  };

  DOM.hudCount().textContent      = stage === 4 ? '🏡' : cared;
  DOM.hudTotal().textContent      = stage === 4 ? '' : ` / ${total}`;
  DOM.hudStageLabel().textContent = stageLabels[stage] || `Estágio ${stage}`;
}


/* ═══════════════════════════════════════════════════════════
   18. ARRANQUE
═══════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════
   ESCALA RESPONSIVA — encaixa o jogo na tela sem scroll
   O jogo tem 900px de largura e ~680px de altura total
   (HUD + quarto + botão). transform:scale encaixa tudo.
═══════════════════════════════════════════════════════════ */
const GAME_W = 900;   /* largura interna do jogo */
const GAME_H = 680;   /* altura total: hud + room + botão */

function _scrollToTop() {
  /* 1. Scroll suave nativo — cobre a maioria dos browsers */
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

  /* 2. Fallback para Safari/iOS e WebViews que ignoram o behavior */
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  /* 3. scrollIntoView no topo do game-scaler — garante mobile */
  const scaler = document.getElementById('game-scaler');
  if (scaler) {
    scaler.style.top = '0';
    scaler.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* 4. HUD como âncora visual — sobe até ele aparecer */
  const hud = document.getElementById('hud');
  if (hud) hud.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function _scaleGame() {
  const scaler = document.getElementById('game-scaler');
  if (!scaler) return;

  /* Usa a viewport real — funciona tanto normal quanto fullscreen */
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  /* Escala "contain": cabe inteiro na tela sem cortar nada */
  const scale = Math.min(vw / GAME_W, vh / GAME_H);

  /* Tamanho real do jogo após escala */
  const scaledW = GAME_W * scale;
  const scaledH = GAME_H * scale;

  /* Centraliza horizontal e verticalmente */
  const offsetX = (vw - scaledW) / 2;
  const offsetY = (vh - scaledH) / 2;

  scaler.style.transform       = `scale(${scale})`;
  scaler.style.transformOrigin = 'top left';
  scaler.style.width           = GAME_W + 'px';
  scaler.style.position        = 'fixed';   /* fixed = ignora scroll, funciona em fullscreen */
  scaler.style.top             = offsetY + 'px';
  scaler.style.left            = offsetX + 'px';

  /* Body sem scroll */
  document.body.style.overflow = 'hidden';
  document.body.style.background = '#000';
  document.documentElement.style.overflow = 'hidden';
  document.documentElement.style.height   = '100%';
}

function _setupOrientationGuard() {
  const overlay = document.getElementById('orientation-overlay');
  if (!overlay) return;

  function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
           (navigator.maxTouchPoints > 1 && window.innerWidth < 1024);
  }

  function check() {
    const portrait = window.innerHeight > window.innerWidth;
    if (isMobile() && portrait) {
      overlay.style.display = 'flex';
    } else {
      overlay.style.display = 'none';
      _scaleGame();
    }
  }

  check();
  window.addEventListener('resize', check);
  window.addEventListener('orientationchange', () => setTimeout(check, 200));
}

/* ═══════════════════════════════════════════════════════════
   TELA CHEIA — Fullscreen API com prefixos cross-browser
═══════════════════════════════════════════════════════════ */
function _setupFullscreen() {
  const btn  = document.getElementById('fullscreen-btn');
  const icon = document.getElementById('fullscreen-icon');
  if (!btn) return;

  /* Verifica suporte */
  const canFS = document.documentElement.requestFullscreen
    || document.documentElement.webkitRequestFullscreen
    || document.documentElement.mozRequestFullScreen
    || document.documentElement.msRequestFullscreen;

  if (!canFS) { btn.style.display = 'none'; return; }

  function isFullscreen() {
    return !!(document.fullscreenElement
      || document.webkitFullscreenElement
      || document.mozFullScreenElement
      || document.msFullscreenElement);
  }

  function enterFS() {
    const el = document.documentElement;
    if      (el.requestFullscreen)       el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.mozRequestFullScreen)    el.mozRequestFullScreen();
    else if (el.msRequestFullscreen)     el.msRequestFullscreen();
  }

  function exitFS() {
    if      (document.exitFullscreen)       document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.mozCancelFullScreen)  document.mozCancelFullScreen();
    else if (document.msExitFullscreen)     document.msExitFullscreen();
  }

  function updateBtn() {
    const active = isFullscreen();
    btn.setAttribute('aria-pressed', active);
    btn.setAttribute('aria-label', active ? 'Sair da tela cheia' : 'Tela cheia');
    btn.setAttribute('title',      active ? 'Sair da tela cheia' : 'Tela cheia');
    /* ⛶ = expandir  |  ⛶ rotacionado = comprimir (usa unicode direto) */
    icon.textContent = active ? '✕' : '⛶';
    /* Re-escala após entrar/sair do fullscreen */
    setTimeout(_scaleGame, 100);
  }

  btn.addEventListener('click', () => {
    isFullscreen() ? exitFS() : enterFS();
  });

  /* Escuta mudanças de estado fullscreen */
  ['fullscreenchange', 'webkitfullscreenchange',
   'mozfullscreenchange', 'MSFullscreenChange'].forEach(ev => {
    document.addEventListener(ev, updateBtn);
  });
}

/* ═══════════════════════════════════════════════════════════
   TELA DE PRÉVIA — introdução narrativa, sem coleta de nome
═══════════════════════════════════════════════════════════ */
function _setupStartScreen() {
  const screen     = document.getElementById('start-screen');
  const btnEntrar  = document.getElementById('btn-conhecer');
  if (!screen || !btnEntrar) return;

  btnEntrar.addEventListener('click', () => {
    /* Libera áudio (requer gesto do usuário no mobile) */
    if (typeof initAudio === 'function') initAudio();
    if (typeof tocarSom  === 'function') tocarSom(1);

    screen.classList.add('fade-out');
    screen.addEventListener('animationend', () => {
      screen.style.display = 'none';
    }, { once: true });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  _setupOrientationGuard();
  _setupFullscreen();
  _scaleGame();
  window.addEventListener('resize', _scaleGame);
  _setupStartScreen();
  init();
});
