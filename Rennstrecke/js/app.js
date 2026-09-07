/**
 * Rennstrecke - Main Application
 * Coordinates 3D Scene, Audio FX, Game Modes, Missions, and Pedagogical Dialogs.
 */

class RennstreckeApp {
  constructor() {
    this.canvas = document.getElementById('webgl-canvas');
    this.level = 2; // Default to Level 2 to showcase the core pedagogical dilemma
    this.mode = 'plan'; // 'plan' (cards) or 'live' (real-time driving)
    this.cameraMode = 'chase'; // 'chase' or 'top'
    
    this.sequenceCards = [];
    this.currentMissionTarget = null;
    this.trackData = null;
    this.isLiveChoosing = false;
    this.liveDecisionQueue = [];

    this._initAudio();
    this._initThree();
    this._bindEvents();

    this.trackGen = new TrackGenerator(this.scene);
    this.kart = new KartVehicle(this.scene);

    this.loadLevel(this.level);
    
    this.clock = new THREE.Clock();
    this._animate = this._animate.bind(this);
    requestAnimationFrame(this._animate);
  }

  /* ------------------- AUDIO SYNTHESIZER ------------------- */
  _initAudio() {
    this.audioCtx = null;
  }

  _getAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  playSound(type) {
    const ctx = this._getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'turn') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'go') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(587, now + 0.3);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'win') {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.type = 'square';
          o.frequency.setValueAtTime(freq, now + idx * 0.12);
          g.gain.setValueAtTime(0.2, now + idx * 0.12);
          g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.28);
          o.start(now + idx * 0.12);
          o.stop(now + idx * 0.12 + 0.3);
        });
      } else if (type === 'fail') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(120, now + 0.35);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      }
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  /* ------------------- THREE.JS SETUP ------------------- */
  _initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x8ecae6);

    const w = window.innerWidth || 1024;
    const h = window.innerHeight || 768;
    const aspect = w / h;

    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.5, 600);
    this.camera.position.set(0, 10, -18);
    this.camera.lookAt(0, 2, 15);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setClearColor(0x8ecae6, 1);

    // Warm, colorful lighting
    const hemiLight = new THREE.HemisphereLight(0xfffaed, 0x556b2f, 0.75);
    hemiLight.position.set(0, 50, 0);
    this.scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff3b0, 0.9);
    sunLight.position.set(30, 50, -20);
    this.scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0xdfe8f7, 0.4);
    rimLight.position.set(-20, 30, 40);
    this.scene.add(rimLight);

    window.addEventListener('resize', () => {
      const newW = window.innerWidth;
      const newH = window.innerHeight;
      if (newW > 0 && newH > 0) {
        this.camera.aspect = newW / newH;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(newW, newH);
      }
    });
  }

  /* ------------------- GAMEPLAY & LEVELS ------------------- */
  loadLevel(lvl) {
    this.level = lvl;
    this.sequenceCards = [];
    this.renderSequenceBar();
    this.kart.reset();

    const depth = Math.min(lvl, 3);
    this.trackData = this.trackGen.buildTrack(depth);

    const targets = this.trackData.targets;
    const randomIndex = Math.floor(Math.random() * targets.length);
    this.currentMissionTarget = targets[randomIndex];

    this._updateMissionUI();
    this._updateEducationalNote();
    this._updateLevelButtons();
  }

  _updateLevelButtons() {
    document.querySelectorAll('.level-btn').forEach(btn => {
      const lvl = parseInt(btn.dataset.level, 10);
      btn.classList.toggle('active', lvl === this.level);
    });
  }

  _updateMissionUI() {
    const banner = document.getElementById('mission-banner');
    if (!banner || !this.currentMissionTarget) return;

    banner.innerHTML = `
      <div class="mission-icon">${this.currentMissionTarget.icon}</div>
      <div class="mission-text">
        <span class="mission-label">Ziel-Aufgabe:</span>
        <strong>${this.currentMissionTarget.name}</strong>
      </div>
      <div class="mission-code-hint">Pfad: <code>${this.currentMissionTarget.path || '?'}</code></div>
    `;
  }

  _updateEducationalNote() {
    const noteBox = document.getElementById('pedagogical-note');
    if (!noteBox) return;

    let content = '';
    if (this.level === 1) {
      content = `
        <div class="note-title">💡 Stufe 1: Einfache Entscheidung (1 Bit)</div>
        <p>An einer Gabelung reicht ein einfaches <strong>Links</strong> oder <strong>Rechts</strong>, um das Ziel eindeutig zu erreichen.</p>
      `;
    } else if (this.level === 2) {
      content = `
        <div class="note-title">🧠 Stufe 2: Das "Welches Links?"-Rätsel</div>
        <p>Die Straße gabelt sich zweimal! Zwei Wege führen nach links (<code>L-L</code> und <code>L-R</code>). Ein einfaches "Fahr links" ist <strong>mehrdeutig</strong>. Wir brauchen eine <strong>genaue 2er-Kette</strong>!</p>
      `;
    } else {
      content = `
        <div class="note-title">🌲 Stufe 3: Der Binärbaum (3er-Ketten)</div>
        <p>8 verschiedene Ziele! Wie bei Computer-Adressen braucht das Kart jetzt genau 3 Richtungsentscheidungen (z.B. <code>L-R-L</code>).</p>
      `;
    }

    noteBox.innerHTML = `
      ${content}
      <button class="note-close-btn" title="Ausblenden">&times;</button>
    `;

    noteBox.querySelector('.note-close-btn')?.addEventListener('click', () => {
      noteBox.classList.add('hidden');
    });
  }

  /* ------------------- CARD SEQUENCE LOGIC ------------------- */
  addCard(direction) {
    if (this.kart.isDriving) return;
    this.playSound('click');

    if (this.sequenceCards.length >= this.level) {
      this.sequenceCards = [];
    }
    this.sequenceCards.push(direction);
    this.renderSequenceBar();
  }

  removeCard(index) {
    if (this.kart.isDriving) return;
    this.playSound('click');
    this.sequenceCards.splice(index, 1);
    this.renderSequenceBar();
  }

  clearCards() {
    if (this.kart.isDriving) return;
    this.playSound('click');
    this.sequenceCards = [];
    this.renderSequenceBar();
  }

  renderSequenceBar() {
    const list = document.getElementById('cards-list');
    if (!list) return;
    list.innerHTML = '';

    for (let i = 0; i < this.level; i++) {
      const dir = this.sequenceCards[i];
      const slot = document.createElement('div');
      
      if (dir) {
        slot.className = `seq-card ${dir === 'L' ? 'card-left' : 'card-right'}`;
        slot.innerHTML = `
          <span class="step-num">${i + 1}. Gabelung:</span>
          <span class="step-icon">${dir === 'L' ? '⬅️ Links' : 'Rechts ➡️'}</span>
          <button class="remove-btn" title="Entfernen">&times;</button>
        `;
        slot.querySelector('.remove-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          this.removeCard(i);
        });
      } else {
        slot.className = 'seq-card seq-slot-empty';
        slot.innerHTML = `
          <span class="step-num">${i + 1}. Gabelung:</span>
          <span class="step-empty-text">? (Richtung wählen)</span>
        `;
      }
      list.appendChild(slot);
    }
  }

  /* ------------------- DRIVING EXECUTION ------------------- */
  startRace() {
    if (this.kart.isDriving) return;
    this.playSound('go');

    if (this.sequenceCards.length === 0) {
      alert('Bitte wähle zuerst mindestens eine Richtungskarte aus!');
      return;
    }

    const chosenPath = this.sequenceCards.join('');
    const waypoints = this._buildFullWaypoints(chosenPath);

    this.kart.setWaypoints(waypoints, () => {
      this._handleDriveFinished(chosenPath);
    });
  }

  _buildFullWaypoints(pathStr) {
    const waypoints = [];
    
    // 1. Root straight segment
    if (this.trackData.paths['root']) {
      waypoints.push(...this.trackData.paths['root']);
    }

    // 2. Step through each chosen branch: e.g. "L", "LL", "LLR"
    let currentPrefix = '';
    for (let i = 0; i < pathStr.length; i++) {
      currentPrefix += pathStr[i];
      const branchPoints = this.trackData.paths[currentPrefix];
      if (branchPoints) {
        waypoints.push(...branchPoints);
      }
    }

    return waypoints;
  }

  _handleDriveFinished(pathStr) {
    const target = this.currentMissionTarget;
    const isSuccess = (pathStr === target.path);

    const modal = document.getElementById('feedback-modal');
    const title = document.getElementById('modal-title');
    const msg = document.getElementById('modal-msg');

    if (isSuccess) {
      this.playSound('win');
      title.textContent = '🎉 Super gemacht!';
      title.style.color = '#38b000';
      msg.innerHTML = `
        <p>Du hast den perfekten Pfad <code>${pathStr}</code> gewählt und <strong>${target.name} ${target.icon}</strong> erreicht!</p>
        <p class="pedagogy-feedback">Genau so funktioniert Adressierung im Binärbaum: Jede Abzweigung fügt der Adresse ein Bit (L oder R) hinzu.</p>
      `;
    } else {
      this.playSound('fail');
      title.textContent = '🤔 Noch nicht ganz am Ziel!';
      title.style.color = '#e63946';
      
      let hint = '';
      if (pathStr.length < target.path.length) {
        hint = `Deine Anweisung war zu kurz (${pathStr.length} statt ${target.path.length} Schritte). Dadurch weiß das Kart an den späteren Gabelungen nicht, wohin es soll!`;
      } else {
        hint = `Du bist bei <code>${pathStr}</code> gelandet, das gesuchte Ziel war aber bei <code>${target.path}</code>!`;
      }

      msg.innerHTML = `
        <p>${hint}</p>
        <p class="pedagogy-feedback">💡 <em>Tipp:</em> Schau dir die Pfeilschilder an den Gabelungen genau an!</p>
      `;
    }

    if (modal) modal.classList.add('visible');
  }

  closeModal() {
    const modal = document.getElementById('feedback-modal');
    if (modal) modal.classList.remove('visible');
    this.kart.reset();
  }

  nextMission() {
    this.closeModal();
    this.loadLevel(this.level);
  }

  /* ------------------- CONTROLS & EVENT BINDINGS ------------------- */
  _bindEvents() {
    // Level Buttons
    document.querySelectorAll('.level-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const lvl = parseInt(e.target.dataset.level, 10);
        this.loadLevel(lvl);
      });
    });

    // Card Input Buttons
    document.getElementById('btn-add-left')?.addEventListener('click', () => this.addCard('L'));
    document.getElementById('btn-add-right')?.addEventListener('click', () => this.addCard('R'));
    document.getElementById('btn-clear-cards')?.addEventListener('click', () => this.clearCards());
    document.getElementById('btn-start-race')?.addEventListener('click', () => this.startRace());

    // Camera Switcher
    document.getElementById('btn-toggle-camera')?.addEventListener('click', () => {
      this.cameraMode = (this.cameraMode === 'chase') ? 'top' : 'chase';
      const label = document.getElementById('camera-mode-label');
      if (label) label.textContent = (this.cameraMode === 'chase') ? '3D Sicht' : 'Vogelperspektive';
    });

    // Info Toggle Button
    document.getElementById('btn-toggle-info')?.addEventListener('click', () => {
      const note = document.getElementById('pedagogical-note');
      if (note) note.classList.toggle('hidden');
    });

    // Modal Buttons
    document.getElementById('modal-close-btn')?.addEventListener('click', () => this.closeModal());
    document.getElementById('modal-next-btn')?.addEventListener('click', () => this.nextMission());

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.addCard('L');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.addCard('R');
      } else if (e.key === ' ' || e.key === 'Enter') {
        this.startRace();
      }
    });
  }

  /* ------------------- RENDER LOOP ------------------- */
  _animate() {
    requestAnimationFrame(this._animate);
    const delta = Math.min(this.clock.getDelta(), 0.1);

    // Update kart physics & movement
    if (this.kart) {
      this.kart.update(delta);
    }

    // Rotate spinning target items
    if (this.trackGen && this.trackGen.trackGroup) {
      this.trackGen.trackGroup.traverse((child) => {
        if (child.userData && child.userData.isTargetItem) {
          child.rotation.y += child.userData.spinSpeed || 0.02;
          child.position.y = 2.5 + Math.sin((this.kart ? this.kart.time : 0) * 3 + (child.userData.floatOffset || 0)) * 0.3;
        }
      });
    }

    // Camera Follow logic
    if (this.kart && this.kart.group) {
      if (this.cameraMode === 'chase') {
        const carPos = this.kart.group.position;
        const carRot = this.kart.group.rotation.y;

        if (this.kart.isDriving) {
          // Dynamic Action Chase Camera while kart is driving
          const offsetDist = -16;
          const offsetHeight = 7.5;
          const targetCamX = carPos.x + Math.sin(carRot) * offsetDist;
          const targetCamZ = carPos.z + Math.cos(carRot) * offsetDist;
          const targetCamY = carPos.y + offsetHeight;

          this.camera.position.lerp(new THREE.Vector3(targetCamX, targetCamY, targetCamZ), 0.12);
          
          const lookAheadX = carPos.x + Math.sin(carRot) * 8;
          const lookAheadZ = carPos.z + Math.cos(carRot) * 8;
          const lookAheadY = carPos.y + 2.0;
          this.camera.lookAt(lookAheadX, lookAheadY, lookAheadZ);
        } else {
          // Elevated 3D Planning Camera (shows kart + ALL forks and goals ahead)
          const planHeight = 14 + this.level * 8;
          const planDist = -18 - this.level * 8;
          const trackCenterZ = 20 + this.level * 18;

          this.camera.position.lerp(new THREE.Vector3(0, planHeight, planDist), 0.08);
          this.camera.lookAt(0, 1.5, trackCenterZ);
        }
      } else {
        // Vogelperspektive (Bird's Eye Overview) - Full tree visible
        const overviewHeight = 35 + this.level * 25;
        const overviewZ = -16 - this.level * 6;
        const trackCenterZ = 20 + this.level * 18;

        this.camera.position.lerp(new THREE.Vector3(0, overviewHeight, overviewZ), 0.08);
        this.camera.lookAt(0, 0, trackCenterZ);
      }
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

// Instantiate on load
window.addEventListener('DOMContentLoaded', () => {
  window.app = new RennstreckeApp();
});
