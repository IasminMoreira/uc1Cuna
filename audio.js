/**
 * ═══════════════════════════════════════════════════════════
 * JARDIM URBANO — audio.js
 *
 * Motor de áudio do jogo. Responsabilidades:
 *   - Gerenciar a trilha ambiente de cada estágio (loop)
 *   - Tocar efeitos sonoros pontuais (SFX)
 *   - Controlar mudo/som via botão de UI
 *   - Lidar com a restrição de autoplay dos navegadores
 *
 * ── COMO SUBSTITUIR OS ÁUDIOS ──────────────────────────────
 * Todas as URLs estão nas constantes AMBIENT_URLS e SFX_URLS
 * abaixo. Substitua cada string pelo caminho do seu arquivo:
 *
 *   Exemplos:
 *     './audio/apartamento.mp3'      (arquivo local)
 *     'https://cdn.exemplo.com/chuva.ogg'  (CDN)
 *
 * Formatos suportados: .mp3, .ogg, .wav, .webm
 * Recomendado: .mp3 (compatibilidade universal)
 * ═══════════════════════════════════════════════════════════
 */


/* ════════════════════════════════════════════════════════════
   A. MAPA DE URLs — SUBSTITUA AQUI
   ════════════════════════════════════════════════════════════
   Cada valor é a URL do arquivo de áudio correspondente.
   Use null para silêncio em um estágio específico.
   Os áudios ambiente tocam em loop infinito.
   Os SFX tocam uma única vez por ação.
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* ── Sugestão de fontes gratuitas (Freesound.org, Zapsplat) ──
   E1: "interior ambience" / "indoor wind"   → ~30–60s loop
   E2: "garden birds" / "outdoor ambience"   → ~30–60s loop
   E3: "heavy rain" + "distant thunder"      → ~60s loop
   E4: "birds morning" / "tropical birds"    → ~30–60s loop
   SFX watering: "water pour gentle"         → ~1–2s
   SFX care:     "leaf rustle" / "click"     → ~0.5–1s
   SFX bloom:    "chime soft" / "sparkle"    → ~1s
   SFX thunder:  "thunder distant"           → ~3s (E3 periódico)
*/

const AMBIENT_URLS = {
  1: 'audio/ambient-apartment.mp3',  /* Estágio 1 · Apartamento */
  2: 'audio/ambient-garden.mp3',     /* Estágio 2 · Jardim      */
  3: 'audio/ambient-rain.mp3',       /* Estágio 3 · Rua / Chuva */
  4: 'audio/ambient-return.mp3',     /* Estágio 4 · Retorno     */
};

/* ── Música final (gerada no Suno) ──
   Toca em volume total na tela de encerramento, sem loop. */
const ENDING_MUSIC_URL    = 'audio/musica-final.mp3';
const ENDING_MUSIC_VOLUME = 0.85;

const SFX_URLS = {
  water:   'audio/sfx-water.mp3',
  spray:   'audio/sfx-spray.mp3',
  care:    'audio/sfx-care.mp3',
  prune:   'audio/sfx-poda.mp3',
  soil:    'audio/sfx-soil.mp3',
  bloom:   'audio/sfx-bloom.mp3',
  shelter: 'audio/sfx-safe.mp3',
  thunder: 'audio/sfx-thunder.mp3',
  unlock:  'audio/sfx-unlock.mp3',
  final:   'audio/sfx-final.mp3',
};


/* ════════════════════════════════════════════════════════════
   B. CONFIGURAÇÕES
   ════════════════════════════════════════════════════════════ */
const AUDIO_CONFIG = {
  /* Volume da trilha ambiente (0.0 → 1.0) */
  ambientVolume: 0.40,

  /* Volume dos efeitos sonoros (0.0 → 1.0) */
  sfxVolume: 0.70,

  /* Duração do fade entre trilhas (ms) */
  fadeDuration: 1200,

  /* Intervalo entre trovões no E3 (ms) — aleatório entre min e max */
  thunderIntervalMin: 18000,
  thunderIntervalMax: 45000,
};


/* ════════════════════════════════════════════════════════════
   C. ESTADO INTERNO DO ÁUDIO
   ════════════════════════════════════════════════════════════ */
const audioState = {
  muted:           false,
  unlocked:        false,   /* true após primeira interação do usuário */
  currentAmbient:  null,    /* objeto Audio da trilha atual */
  currentStage:    null,    /* número do estágio atual */
  thunderTimeout:  null,    /* referência ao setTimeout de trovão */
  fadeInterval:    null,    /* referência ao setInterval de fade */
};


/* ════════════════════════════════════════════════════════════
   D. FÁBRICA DE OBJETOS AUDIO
   ════════════════════════════════════════════════════════════ */

/**
 * criarAudio — cria um HTMLAudioElement com configuração padrão.
 * Retorna null se a URL for null/undefined/vazia.
 */
function criarAudio(url, loop = false) {
  if (!url) return null;
  try {
    const audio = new Audio(url);
    audio.loop          = loop;
    audio.preload       = 'auto';
    audio.volume        = 0;
    return audio;
  } catch (e) {
    console.warn('[Audio] Falha ao criar áudio:', url, e.message);
    return null;
  }
}

/**
 * criarSFX — cria um SFX pronto para reprodução imediata.
 * Clona o nó antes de tocar para permitir sobreposição.
 */
function criarSFX(url) {
  return criarAudio(url, false);
}


/* ════════════════════════════════════════════════════════════
   E. PRÉ-CARREGAMENTO
   ════════════════════════════════════════════════════════════ */

/* Instâncias das trilhas ambiente (criadas uma vez, reutilizadas) */
const ambientTracks = {
  1: criarAudio(AMBIENT_URLS[1], true),
  2: criarAudio(AMBIENT_URLS[2], true),
  3: criarAudio(AMBIENT_URLS[3], true),
  4: criarAudio(AMBIENT_URLS[4], true),
};

/* Instâncias dos SFX — cada chave deve corresponder a uma entrada em SFX_URLS */
const sfxTracks = {
  water:   criarSFX(SFX_URLS.water),
  spray:   criarSFX(SFX_URLS.spray),
  care:    criarSFX(SFX_URLS.care),
  prune:   criarSFX(SFX_URLS.prune),
  soil:    criarSFX(SFX_URLS.soil),
  bloom:   criarSFX(SFX_URLS.bloom),
  shelter: criarSFX(SFX_URLS.shelter),
  thunder: criarSFX(SFX_URLS.thunder),
  unlock:  criarSFX(SFX_URLS.unlock),
  final:   criarSFX(SFX_URLS.final),
};

/* Música final — sem loop, volume total, criada uma única vez */
const endingMusicTrack = criarAudio(ENDING_MUSIC_URL, false);


/* ════════════════════════════════════════════════════════════
   F. API PÚBLICA — tocarSom, tocarSFX, controle de mudo
   ════════════════════════════════════════════════════════════ */

/**
 * tocarSom(cenario) — troca a trilha ambiente com fade cruzado.
 * Chamada em cada transição de estágio.
 * @param {number} cenario — número do estágio (1–4)
 */
function tocarSom(cenario) {
  if (audioState.currentStage === cenario) return;

  const novaFaixa = ambientTracks[cenario];
  const faixaAnterior = audioState.currentAmbient;

  audioState.currentStage = cenario;

  /* Para trovões do E3 ao sair */
  pararTrovoes();

  /* Fade out da faixa anterior */
  if (faixaAnterior) {
    _fadeOut(faixaAnterior, AUDIO_CONFIG.fadeDuration, () => {
      faixaAnterior.pause();
      faixaAnterior.currentTime = 0;
    });
  }

  /* Fade in da nova faixa */
  if (novaFaixa && !audioState.muted) {
    novaFaixa.currentTime = 0;
    _tentarPlay(novaFaixa).then(() => {
      _fadeIn(novaFaixa, AUDIO_CONFIG.fadeDuration, AUDIO_CONFIG.ambientVolume);
    });
  }

  audioState.currentAmbient = novaFaixa;

  /* Iniciar trovões periódicos no E3 */
  if (cenario === 3) agendarProximoTrovao();
}

let _sfxAtivoClone = null;

function tocarSFX(nome) {
  if (!nome) return;
  if (audioState.muted) return;
  const sfx = sfxTracks[nome];
  if (!sfx) return;

  if (_sfxAtivoClone) {
    _sfxAtivoClone.pause();
    _sfxAtivoClone.currentTime = 0;
    _sfxAtivoClone = null;
  }

  try {
    const clone    = sfx.cloneNode();
    clone.volume   = AUDIO_CONFIG.sfxVolume;
    _sfxAtivoClone = clone;
    _tentarPlay(clone).catch(() => {});
    clone.addEventListener('ended', () => {
      if (_sfxAtivoClone === clone) _sfxAtivoClone = null;
      clone.remove();
    }, { once: true });
  } catch (e) {
    console.warn('[Audio] SFX falhou:', nome, e.message);
  }
}

function pararSFX() {
  if (_sfxAtivoClone) {
    _sfxAtivoClone.pause();
    _sfxAtivoClone.currentTime = 0;
    _sfxAtivoClone = null;
  }
}

/**
 * alternarMudo() — toggle mudo/som. Chamado pelo botão de UI.
 */
function alternarMudo() {
  audioState.muted = !audioState.muted;
  _aplicarEstadoMudo();
  _atualizarBotaoMudo();
}

/**
 * tocarMusicaFinal() — para todas as trilhas ambiente e toca a
 * música de encerramento em volume total com fade-in de 2s.
 * Exposta globalmente para ser chamada por script.js via
 * _iniciarMusicaFinal() na tela de encerramento.
 */
function tocarMusicaFinal() {
  /* Parar ambiente atual com fade rápido */
  pararTrovoes();
  const faixaAtual = audioState.currentAmbient;
  if (faixaAtual) {
    _fadeOut(faixaAtual, 800, () => {
      faixaAtual.pause();
      faixaAtual.currentTime = 0;
    });
  }
  audioState.currentAmbient = null;

  if (!endingMusicTrack || audioState.muted) return;

  endingMusicTrack.currentTime = 0;
  _tentarPlay(endingMusicTrack).then(() => {
    _fadeIn(endingMusicTrack, 2000, ENDING_MUSIC_VOLUME);
  }).catch(() => {
    /* Autoplay bloqueado — tenta novamente na próxima interação */
    const retry = () => {
      _tentarPlay(endingMusicTrack).then(() => {
        _fadeIn(endingMusicTrack, 2000, ENDING_MUSIC_VOLUME);
      });
      document.removeEventListener('click', retry);
    };
    document.addEventListener('click', retry, { once: true });
  });
}

/**
 * desbloquearAudio() — chamado na primeira interação do usuário.
 * Necessário por causa da política de autoplay dos navegadores.
 * Deve ser chamado dentro de um handler de evento (click, keydown).
 */
function desbloquearAudio() {
  if (audioState.unlocked) return;
  audioState.unlocked = true;

  setTimeout(() => {
    const stage = audioState.currentStage;
    if (stage && ambientTracks[stage] && !audioState.muted) {
      const faixa = ambientTracks[stage];
      faixa.currentTime = 0;
      _tentarPlay(faixa).then(() => {
        _fadeIn(faixa, AUDIO_CONFIG.fadeDuration, AUDIO_CONFIG.ambientVolume);
      });
      audioState.currentAmbient = faixa;
    }
  }, 0);

  console.log('[Audio] Desbloqueado pela interação do usuário.');
}


/* ════════════════════════════════════════════════════════════
   G. TROVÕES PERIÓDICOS (E3)
   ════════════════════════════════════════════════════════════ */

function agendarProximoTrovao() {
  pararTrovoes();
  const { thunderIntervalMin, thunderIntervalMax } = AUDIO_CONFIG;
  const delay = thunderIntervalMin + Math.random() * (thunderIntervalMax - thunderIntervalMin);
  audioState.thunderTimeout = setTimeout(() => {
    tocarSFX('thunder');
    if (audioState.currentStage === 3) agendarProximoTrovao();
  }, delay);
}

function pararTrovoes() {
  clearTimeout(audioState.thunderTimeout);
  audioState.thunderTimeout = null;
}


/* ════════════════════════════════════════════════════════════
   H. UTILITÁRIOS INTERNOS
   ════════════════════════════════════════════════════════════ */

/**
 * _tentarPlay — tenta reproduzir um áudio com tratamento de erro.
 * Navegadores modernos rejeitam play() sem interação do usuário.
 */
function _tentarPlay(audio) {
  if (!audio) return Promise.resolve();
  return audio.play().catch(e => {
    /* NotAllowedError = autoplay bloqueado. Silencioso — o botão de mudo resolve. */
    if (e.name !== 'NotAllowedError') {
      console.warn('[Audio] Erro ao reproduzir:', e.message);
    }
  });
}

/**
 * _fadeIn — aumenta o volume gradualmente de 0 até targetVolume.
 */
function _fadeIn(audio, durationMs, targetVolume) {
  if (!audio) return;
  audio.volume = 0;
  const steps    = 30;
  const stepTime = durationMs / steps;
  const stepVol  = targetVolume / steps;
  let step = 0;

  const interval = setInterval(() => {
    step++;
    audio.volume = Math.min(targetVolume, audio.volume + stepVol);
    if (step >= steps) clearInterval(interval);
  }, stepTime);
}

/**
 * _fadeOut — reduz o volume gradualmente até 0, então chama callback.
 */
function _fadeOut(audio, durationMs, callback) {
  if (!audio) { if (callback) callback(); return; }
  const currentVol = audio.volume;
  const steps      = 30;
  const stepTime   = durationMs / steps;
  const stepVol    = currentVol / steps;
  let step = 0;

  const interval = setInterval(() => {
    step++;
    audio.volume = Math.max(0, audio.volume - stepVol);
    if (step >= steps) {
      clearInterval(interval);
      audio.volume = 0;
      if (callback) callback();
    }
  }, stepTime);
}

/**
 * _aplicarEstadoMudo — pausa ou retoma a trilha atual conforme audioState.muted.
 */
function _aplicarEstadoMudo() {
  const faixa = audioState.currentAmbient;
  if (!faixa) return;

  if (audioState.muted) {
    faixa.pause();
    pararTrovoes();
  } else {
    _tentarPlay(faixa).then(() => {
      _fadeIn(faixa, 600, AUDIO_CONFIG.ambientVolume);
    });
    /* Retomar trovões se estiver no E3 */
    if (audioState.currentStage === 3) agendarProximoTrovao();
  }
}

/**
 * _atualizarBotaoMudo — sincroniza o ícone e atributo aria do botão.
 */
function _atualizarBotaoMudo() {
  const btn   = document.getElementById('mute-btn');
  const icon  = document.getElementById('mute-icon');
  const label = document.getElementById('mute-label');
  if (!btn) return;

  const muted = audioState.muted;
  btn.setAttribute('aria-pressed', String(muted));
  btn.title = muted ? 'Ativar som' : 'Silenciar';
  if (icon)  icon.textContent  = muted ? '🔇' : '🔊';
  if (label) label.textContent = muted ? 'Som' : 'Mudo';
}


/* ════════════════════════════════════════════════════════════
   I. SFX MAPEADOS POR AÇÃO DE PLANTA
   ════════════════════════════════════════════════════════════
   sfxParaAcao(plantId) retorna o nome do SFX correspondente.
   Chamado por handleCareAction() e pelo branch de visita no script.js.
   ════════════════════════════════════════════════════════════ */
const SFX_MAP = {
  /* ── Estágio 1 ── */
  maranta:       'water',    /* Regar com regador      */
  samambaia:     'spray',    /* Borrifar               */
  palmeira:      'care',     /* Girar o vaso           */
  bromelia:      'water',    /* Encher a roseta        */

  /* ── Estágio 2 ── */
  ipe:           'water',    /* Regar a base           */
  manaca:        'prune',    /* Podar os galhos secos  */
  quaresmeira:   'soil',     /* Adubar o solo          */
  jabuticabeira: 'water',    /* Regar o caule          */

  /* ── Estágio 3 — visitas com som de se abrigar ── */
  iris:          'shelter',
  guaivira:      'shelter',
  inga:          'shelter',
  taboa:         'shelter',

  /* ── Estágio 4 — reflexão silenciosa ── */
  s4maranta:     null,
  s4samambaia:   null,
  s4palmeira:    null,
  s4bromelia:    null,
};

/**
 * sfxParaAcao(plantId) — retorna o SFX correto para a planta.
 * Chamado por handleCareAction() no script.js.
 */
function sfxParaAcao(plantId) {
  return SFX_MAP[plantId] || 'care';
}


/* ════════════════════════════════════════════════════════════
   J. INICIALIZAÇÃO DO MÓDULO DE ÁUDIO
   ════════════════════════════════════════════════════════════ */

/**
 * initAudio() — deve ser chamado dentro de init() no script.js.
 * Configura o botão de mudo e registra o desbloqueio de autoplay.
 */
function initAudio() {
  const btn = document.getElementById('mute-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      desbloquearAudio();
      alternarMudo();
    });
  }

  /* Desbloquear áudio na primeira interação com qualquer elemento */
  const desbloquearUmaVez = () => {
    desbloquearAudio();
    document.removeEventListener('click',   desbloquearUmaVez);
    document.removeEventListener('keydown', desbloquearUmaVez);
  };
  document.addEventListener('click',   desbloquearUmaVez, { once: true });
  document.addEventListener('keydown', desbloquearUmaVez, { once: true });

  /* Estado inicial do botão */
  _atualizarBotaoMudo();

  /* Preparar o estágio 1 (sem tocar ainda — aguarda interação) */
  audioState.currentStage = 1;

  console.log('[Audio] Módulo inicializado. Aguardando interação do usuário.');
}
