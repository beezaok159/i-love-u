/**
 * Romantic Love Letter & Heart Burst Experience
 * Crafted with love for a special person ❤️
 */

document.addEventListener('DOMContentLoaded', () => {
  // Set current Thai date
  const dateEl = document.getElementById('currentDateText');
  if (dateEl) {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = today.toLocaleDateString('th-TH', options);
  }

  // Canvas & Heart Particle Engine
  initHeartCanvas();

  // Envelope Open Interaction
  initEnvelopeLogic();

  // Sound & Music Synthesizer (Web Audio API - No external mp3 files required!)
  initRomanticSoundSystem();

  // Interactive Buttons & Modals
  initInteractions();

  // Photo Lightbox
  initLightbox();
});

/* ==========================================================================
   CANVAS HEART PARTICLE ENGINE
   ========================================================================== */
let canvas, ctx;
let hearts = [];
let ambientHearts = [];
let isEnvelopeOpened = false;

function initHeartCanvas() {
  canvas = document.getElementById('heartCanvas');
  ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Spawn gentle ambient floating hearts
  setInterval(() => {
    if (ambientHearts.length < 25) {
      ambientHearts.push(createAmbientHeart());
    }
  }, 350);

  // Animation Loop
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render & update ambient floating hearts
    for (let i = ambientHearts.length - 1; i >= 0; i--) {
      const h = ambientHearts[i];
      h.y -= h.speedY;
      h.x += Math.sin(h.wobble) * h.wobbleSpeed;
      h.wobble += 0.03;
      h.rotation += h.rotationSpeed;

      drawHeart(h.x, h.y, h.size, h.color, h.opacity, h.rotation);

      if (h.y < -50 || h.opacity <= 0) {
        ambientHearts.splice(i, 1);
      }
    }

    // Render & update burst hearts (fireworks/pops)
    for (let i = hearts.length - 1; i >= 0; i--) {
      const p = hearts[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.friction;
      p.vy *= p.friction;
      p.rotation += p.rotationSpeed;
      p.opacity -= p.fade;
      p.size = Math.max(0, p.size - p.shrink);

      drawHeart(p.x, p.y, p.size, p.color, p.opacity, p.rotation);

      if (p.opacity <= 0 || p.size <= 0) {
        hearts.splice(i, 1);
      }
    }

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // Romantic touch/click effect anywhere on page
  document.addEventListener('pointerdown', (e) => {
    // Avoid interfering if clicked directly on certain controls
    if (e.target.closest('#lightboxModal') || e.target.closest('#promiseModal')) return;
    spawnHeartBurst(e.clientX, e.clientY, 8);
  });
}

function createAmbientHeart() {
  const colors = [
    '#ff4d79', '#ff7597', '#ffa3b8', '#ffd3dd', '#f4c07b', '#ff2e63'
  ];
  return {
    x: Math.random() * (canvas ? canvas.width : window.innerWidth),
    y: (canvas ? canvas.height : window.innerHeight) + 20,
    size: Math.random() * 14 + 10,
    color: colors[Math.floor(Math.random() * colors.length)],
    opacity: Math.random() * 0.6 + 0.2,
    speedY: Math.random() * 1.5 + 0.8,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: Math.random() * 1.2 + 0.5,
    rotation: Math.random() * Math.PI,
    rotationSpeed: (Math.random() - 0.5) * 0.02
  };
}

function spawnHeartBurst(x, y, count = 25) {
  const colors = [
    '#ff0844', '#ff4d79', '#ff7597', '#ffb199', '#f4c07b', '#ffffff', '#e62e5c'
  ];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 9 + 3;
    hearts.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      gravity: 0.18,
      friction: 0.96,
      size: Math.random() * 18 + 12,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1,
      fade: Math.random() * 0.015 + 0.01,
      shrink: 0.05,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.15
    });
  }
}

// Function to draw crisp vector heart
function drawHeart(x, y, size, color, opacity, rotation = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = Math.max(0, Math.min(1, opacity));
  ctx.fillStyle = color;

  ctx.beginPath();
  const topCurveHeight = size * 0.3;
  ctx.moveTo(0, topCurveHeight);
  // Top left curve
  ctx.bezierCurveTo(
    -size / 2, -topCurveHeight,
    -size, size / 3,
    0, size
  );
  // Top right curve
  ctx.bezierCurveTo(
    size, size / 3,
    size / 2, -topCurveHeight,
    0, topCurveHeight
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/* ==========================================================================
   ENVELOPE OPENING LOGIC
   ========================================================================== */
function initEnvelopeLogic() {
  const envelope = document.getElementById('envelope');
  const waxSeal = document.getElementById('waxSeal');
  const envelopeSection = document.getElementById('envelopeSection');
  const letterContentSection = document.getElementById('letterContentSection');
  const envelopeContainer = document.getElementById('envelopeContainer');

  function openEnvelope() {
    if (isEnvelopeOpened) return;
    isEnvelopeOpened = true;

    // Trigger sweet chime audio & heart explosions
    playChimeSound();
    startMusic();

    const rect = waxSeal.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Burst 1: At seal
    spawnHeartBurst(centerX, centerY, 35);

    // Envelope open class for 3D flap flip & letter peek
    envelope.classList.add('open');

    // Burst 2: After flap opens
    setTimeout(() => {
      spawnHeartBurst(centerX, centerY - 80, 50);
      playSparkleSound();
    }, 400);

    // Transition smoothly to full letter view
    setTimeout(() => {
      envelopeSection.classList.add('hide-envelope');

      letterContentSection.classList.remove('hidden');
      // Trigger reflow
      void letterContentSection.offsetWidth;
      letterContentSection.classList.add('show');

      // Scroll smoothly to top of letter
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

      // Celebration burst from both sides of the screen
      spawnHeartBurst(window.innerWidth * 0.2, window.innerHeight * 0.4, 40);
      spawnHeartBurst(window.innerWidth * 0.8, window.innerHeight * 0.4, 40);
    }, 1100);
  }

  waxSeal.addEventListener('click', (e) => {
    e.stopPropagation();
    openEnvelope();
  });

  envelopeContainer.addEventListener('click', () => {
    openEnvelope();
  });
}

/* ==========================================================================
   WEB AUDIO API ROMANTIC SYNTHESIZER
   (Plays beautiful gentle melodies and sound effects without needing files)
   ========================================================================== */
let audioCtx = null;
let isMusicPlaying = false;
let musicInterval = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Play pleasant magical harp chime when envelope opens
function playChimeSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playTone(freq, 0.6, 'sine', 0.15);
    }, idx * 90);
  });
}

function playSparkleSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [880, 1046.5, 1174.66, 1318.51, 1567.98];
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playTone(freq, 0.4, 'triangle', 0.1);
    }, idx * 70);
  });
}

function playTone(freq, duration, type = 'sine', volume = 0.15) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (err) {
    // Audio might be muted or blocked by browser policy until interaction
  }
}

// Gentle ambient music loop (Music box chords inspired by romantic lofi)
function startMusic() {
  if (isMusicPlaying) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  isMusicPlaying = true;
  updateMusicUI();

  // Romantic Chord Progression: Cmaj7 - Am7 - Fmaj7 - G
  const chords = [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7 (C4, E4, G4, B4)
    [220.00, 261.63, 329.63, 392.00], // Am7 (A3, C4, E4, G4)
    [174.61, 261.63, 329.63, 349.23], // Fmaj7 (F3, C4, E4, F4)
    [196.00, 246.94, 293.66, 392.00]  // G (G3, B3, D4, G4)
  ];

  let chordIndex = 0;
  function playNextChord() {
    if (!isMusicPlaying) return;
    const currentChord = chords[chordIndex];
    currentChord.forEach((freq, i) => {
      setTimeout(() => {
        if (isMusicPlaying) {
          playTone(freq, 1.4, 'sine', 0.06);
        }
      }, i * 140);
    });
    chordIndex = (chordIndex + 1) % chords.length;
  }

  playNextChord();
  musicInterval = setInterval(playNextChord, 2200);
}

function stopMusic() {
  isMusicPlaying = false;
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
  updateMusicUI();
}

function updateMusicUI() {
  const eq = document.getElementById('equalizer');
  const icon = document.getElementById('musicIcon');
  if (eq && icon) {
    if (isMusicPlaying) {
      eq.classList.add('playing');
      icon.textContent = '🎶';
    } else {
      eq.classList.remove('playing');
      icon.textContent = '🎵';
    }
  }
}

function initRomanticSoundSystem() {
  const toggleBtn = document.getElementById('musicToggleBtn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isMusicPlaying) {
        stopMusic();
      } else {
        startMusic();
      }
    });
  }
}

/**
 * Romantic Configuration (ตั้งค่าการแจ้งเตือนและบันทึกข้อมูล)
 */
const LOVE_CONFIG = {
  // Discord Webhook URL สำหรับแจ้งเตือนเข้ามือถือของคุณทันทีที่แฟนกดตกลง
  discordWebhookUrl: 'https://discord.com/api/webhooks/1545072485861564477/VTrfR1MZU1EyBz848uyxNStFCKGTncHMvWNSdTLs9pYw63o_0gmB3Usm6HZg-ONtZAIA',
  googleSheetUrl: ''
};

/* ==========================================================================
   INTERACTIVE BUTTONS & MODALS (รวมถึงลูกเล่นปุ่มเลื่อนหนี & บันทึกข้อมูล)
   ========================================================================== */
function initInteractions() {
  // 1. Mini Heart Counter Button (ในกล่องสัญญาใจ)
  const heartBtn = document.getElementById('sendHeartBtn');
  const counterEl = document.getElementById('heartCounter');
  let count = 0;

  if (heartBtn) {
    heartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      count++;
      if (counterEl) counterEl.textContent = count;

      playSparkleSound();

      const rect = heartBtn.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      spawnHeartBurst(x, y - 15, 20);

      heartBtn.style.transform = 'scale(0.92)';
      setTimeout(() => {
        heartBtn.style.transform = '';
      }, 150);
    });
  }

  // 2. Love Game: รักไหม vs ไม่รัก (ปุ่มเลื่อนหนี)
  const btnYes = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');
  const btnNoText = document.getElementById('btnNoText');
  const promiseModal = document.getElementById('promiseModal');
  const closeModalBtn = document.getElementById('closeModalBtn');

  // Controls สำหรับบันทึกข้อมูลความในใจ
  const replyInput = document.getElementById('replyMessageInput');
  const btnSaveReply = document.getElementById('btnSaveReply');
  const saveSuccessBadge = document.getElementById('saveSuccessBadge');
  const savedMemoryCard = document.getElementById('savedMemoryCard');
  const savedMemoryText = document.getElementById('savedMemoryText');
  const savedMemoryTime = document.getElementById('savedMemoryTime');

  let dodgeCount = 0;
  let yesScale = 1.0;

  const funnyTexts = [
    'ไม่รัก 😜',
    'กดไม่ได้หรอก แบร่ 😝',
    'แน่ะ ยังจะตามมากดอีก 🤣',
    'ไม่ให้กดเด็ดขาด! 🙈',
    'ปุ่มนี้ล็อกไว้ ห้ามกด! 🔒',
    'ยอมรับเถอะว่ารักผม 🥰',
    'หนีไปอีกฝั่งแล้ว 💨',
    'กดฝั่งซ้ายเถอะน้าา 🥺💖',
    'ยังไม่ยอมแพ้อีก 😆',
    'รักเด็กคนนี้เถอะนะ ❤️'
  ];

  // โหลดข้อมูลความทรงจำเดิมที่เคยบันทึกไว้ในเครื่อง (ถ้ามี)
  function loadSavedMemory() {
    try {
      const saved = localStorage.getItem('love_confession_data');
      if (saved) {
        const data = JSON.parse(saved);
        if (savedMemoryCard && savedMemoryText && savedMemoryTime) {
          savedMemoryCard.classList.remove('hidden');
          savedMemoryText.textContent = data.message ? `"${data.message}"` : `ตอบตกลง: ${data.answer}`;
          savedMemoryTime.textContent = `บันทึกเมื่อ: ${data.timestamp}`;
        }
      }
    } catch (err) {
      console.log('LocalStorage load skipped');
    }
  }
  loadSavedMemory();

  // ฟังก์ชันบันทึกข้อมูล (Save to LocalStorage + Cloud/Discord)
  function saveLoveData(answer, customMessage = '') {
    const now = new Date();
    const timeString = now.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const record = {
      answer: answer,
      message: customMessage || 'รักไหม? รักสิ ❤️',
      timestamp: timeString,
      savedAt: now.toISOString()
    };

    // 1. บันทึกลง LocalStorage ของเครื่อง
    try {
      localStorage.setItem('love_confession_data', JSON.stringify(record));
    } catch (e) {}

    // แสดงในกล่องความทรงจำใต้เกม
    if (savedMemoryCard && savedMemoryText && savedMemoryTime) {
      savedMemoryCard.classList.remove('hidden');
      savedMemoryText.textContent = customMessage ? `"${customMessage}"` : `ตอบตกลง: ${record.answer}`;
      savedMemoryTime.textContent = `บันทึกเมื่อ: ${timeString}`;
    }

    // 2. ส่งเข้า Discord Webhook ถ้าตั้งค่าไว้
    if (LOVE_CONFIG.discordWebhookUrl && LOVE_CONFIG.discordWebhookUrl.startsWith('http')) {
      try {
        fetch(LOVE_CONFIG.discordWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'จดหมายบอกรัก 💌',
            embeds: [{
              title: '💖 แฟนตอบรับคำบอกรักแล้ว! 💖',
              color: 0xff4d79,
              fields: [
                { name: 'คำตอบ', value: record.answer, inline: true },
                { name: 'เวลา', value: record.timestamp, inline: true },
                { name: 'ข้อความฝากถึงผม', value: record.message || 'รักสิ ❤️' }
              ],
              footer: { text: 'ความในใจจากแฟน • Always & Forever' }
            }]
          })
        }).catch(() => {});
      } catch (err) {}
    }

    // 3. ส่งเข้า Google Sheet API ถ้าตั้งค่าไว้
    if (LOVE_CONFIG.googleSheetUrl && LOVE_CONFIG.googleSheetUrl.startsWith('http')) {
      try {
        fetch(LOVE_CONFIG.googleSheetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record)
        }).catch(() => {});
      } catch (err) {}
    }
  }

  // ฟังก์ชันสุ่มตำแหน่งเลื่อนหนีของปุ่ม "ไม่รัก"
  function dodgeBtn(e) {
    if (e && e.cancelable) {
      e.preventDefault();
      e.stopPropagation();
    }

    dodgeCount++;
    btnNo.classList.add('dodging');

    // ละอองประกายวิบวับตรงจุดที่ปุ่มเคยอยู่
    const currentRect = btnNo.getBoundingClientRect();
    spawnHeartBurst(currentRect.left + currentRect.width / 2, currentRect.top + currentRect.height / 2, 8);
    playSparkleSound();

    // เปลี่ยนข้อความแกล้งแบบน่ารักๆ
    const textIdx = dodgeCount % funnyTexts.length;
    if (btnNoText) {
      btnNoText.textContent = funnyTexts[textIdx];
    }

    // คำนวณพิกัดใหม่ให้อยู่ในหน้าจอเสมอ
    const btnWidth = btnNo.offsetWidth || 130;
    const btnHeight = btnNo.offsetHeight || 50;
    const padding = 20;

    const minX = padding;
    const maxX = Math.max(minX, window.innerWidth - btnWidth - padding);
    const minY = 70;
    const maxY = Math.max(minY, window.innerHeight - btnHeight - 70);

    let newX = Math.random() * (maxX - minX) + minX;
    let newY = Math.random() * (maxY - minY) + minY;

    // ตรวจสอบตำแหน่งเมาส์/นิ้ว เพื่อดีดหนีไปไกลๆ
    let clientX = window.innerWidth / 2;
    let clientY = window.innerHeight / 2;
    if (e) {
      if (e.clientX !== undefined) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else if (e.touches && e.touches[0]) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
    }

    if (Math.abs(newX - clientX) < 160) {
      newX = newX > clientX ? Math.min(maxX, clientX + 200) : Math.max(minX, clientX - 200);
    }
    if (Math.abs(newY - clientY) < 120) {
      newY = newY > clientY ? Math.min(maxY, clientY + 160) : Math.max(minY, clientY - 160);
    }

    btnNo.style.left = `${Math.round(newX)}px`;
    btnNo.style.top = `${Math.round(newY)}px`;

    // ขยายปุ่ม "รักไหม / รักสิ" ให้ใหญ่และเด่นขึ้นเรื่อยๆ
    if (yesScale < 1.4) {
      yesScale += 0.06;
      btnYes.style.transform = `scale(${yesScale})`;
    }
  }

  // คืนค่าปุ่มฝั่งขวา "ไม่รัก" ให้กลับมาอยู่ที่เดิมอย่างสวยงาม
  function resetBtnNo() {
    if (!btnNo) return;
    btnNo.classList.remove('dodging');
    btnNo.style.position = '';
    btnNo.style.left = '';
    btnNo.style.top = '';
    btnNo.style.opacity = '1';
    btnNo.style.pointerEvents = 'auto';
    btnNo.style.transition = '';
    if (btnNoText) btnNoText.textContent = 'ไม่รัก';
    yesScale = 1.0;
    if (btnYes) btnYes.style.transform = '';
  }

  // ดักจับเมื่อเมาส์หรือนิ้วเข้าใกล้ตัวปุ่ม "ไม่รัก" โดยตรง ให้กระโดดหนีทันที
  if (btnNo) {
    btnNo.addEventListener('mouseenter', dodgeBtn);
    btnNo.addEventListener('pointerenter', dodgeBtn);
    btnNo.addEventListener('pointerdown', dodgeBtn);
    btnNo.addEventListener('touchstart', dodgeBtn, { passive: false });
    btnNo.addEventListener('click', dodgeBtn);
  }

  // เมื่อกดปุ่ม "รักไหม? รักสิ ❤️"
  if (btnYes) {
    btnYes.addEventListener('click', (e) => {
      e.stopPropagation();

      // บันทึกคำตอบลงดาต้า และส่งเข้า Discord อัตโนมัติทันที
      saveLoveData('รักไหม? รักสิ ❤️', '');

      // พลุหัวใจระเบิดฉลองเต็มหน้าจอ
      spawnHeartBurst(window.innerWidth / 2, window.innerHeight / 2, 55);
      spawnHeartBurst(window.innerWidth * 0.25, window.innerHeight * 0.4, 40);
      spawnHeartBurst(window.innerWidth * 0.75, window.innerHeight * 0.4, 40);

      // เสียงดนตรีแห่งความสุข
      playChimeSound();

      // แสดงหน้าต่างสัญญาใจ
      if (promiseModal) {
        promiseModal.classList.remove('hidden');
      }
    });
  }

  // เมื่อพิมพ์ข้อความและกด "บันทึกความในใจ & ส่งคำตอบ ❤️"
  if (btnSaveReply) {
    btnSaveReply.addEventListener('click', (e) => {
      e.stopPropagation();
      const customMsg = replyInput ? replyInput.value.trim() : '';
      saveLoveData('รักไหม? รักสิ ❤️', customMsg);

      if (saveSuccessBadge) {
        saveSuccessBadge.classList.remove('hidden');
      }

      spawnHeartBurst(window.innerWidth / 2, window.innerHeight * 0.4, 30);
      playSparkleSound();
    });
  }

  // ปิดหน้าต่างโมดอล & คืนค่าปุ่มฝั่งขวาให้กลับมาอยู่ที่เดิม
  if (closeModalBtn && promiseModal) {
    closeModalBtn.addEventListener('click', () => {
      promiseModal.classList.add('hidden');
      resetBtnNo();
      spawnHeartBurst(window.innerWidth / 2, window.innerHeight * 0.45, 30);
    });

    promiseModal.addEventListener('click', (e) => {
      if (e.target === promiseModal) {
        promiseModal.classList.add('hidden');
        resetBtnNo();
      }
    });
  }
}

/* ==========================================================================
   POLAROID LIGHTBOX VIEWER
   ========================================================================== */
function initLightbox() {
  const cards = document.querySelectorAll('.polaroid-card');
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  const caption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');

  if (!modal || !img || !caption) return;

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      const cardImg = card.querySelector('img');
      const cardCaption = card.querySelector('.caption');

      if (cardImg) {
        img.src = cardImg.src;
        caption.textContent = cardCaption ? cardCaption.textContent : '';
        modal.classList.remove('hidden');
        spawnHeartBurst(e.clientX, e.clientY, 15);
      }
    });
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });
}
