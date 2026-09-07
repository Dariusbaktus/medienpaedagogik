/**
 * TikTok-Detektiv: Main Application Controller
 * Handles UI interactions, video switching, audio synthesis, modal views & game loop
 */

window.App = {
  currentCase: null,
  currentVideoIndex: 0,
  activeScreen: 'feed', // 'feed' | 'profile'
  currentInspectedClue: null,
  audioCtx: null,

  init() {
    this.populateCaseDropdown();
    this.setupNavigation();
    this.setupCommentsModal();
    this.setupInspectorModal();
    this.setupVerdictModal();
    this.setupAudio();
    this.setupKeyboardControls();

    if (window.CaseEditor) window.CaseEditor.init();

    // Load initial case
    if (window.TIKTOK_CASES && window.TIKTOK_CASES.length > 0) {
      this.loadCase(window.TIKTOK_CASES[0].id);
    }
  },

  setupAudio() {
    const initAudio = () => {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
      }
    };
    window.addEventListener('click', initAudio, { once: true });
    window.addEventListener('keydown', initAudio, { once: true });
  },

  playSound(type) {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    switch (type) {
      case 'click': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
        break;
      }

      case 'pin': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
        break;
      }

      case 'subway': {
        // Berlin BVG subway chime: F4 -> C5
        [349.23, 523.25].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.3);
          gain.gain.setValueAtTime(0, now + i * 0.3);
          gain.gain.linearRampToValueAtTime(0.3, now + i * 0.3 + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.3 + 0.7);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.3);
          osc.stop(now + i * 0.3 + 0.7);
        });
        break;
      }

      case 'siren': {
        // German Martinshorn dual-tone: A4 (440Hz) -> D5 (587Hz)
        [440, 587.33, 440, 587.33].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + i * 0.35);
          gain.gain.setValueAtTime(0.15, now + i * 0.35);
          gain.gain.linearRampToValueAtTime(0.02, now + i * 0.35 + 0.33);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.35);
          osc.stop(now + i * 0.35 + 0.34);
        });
        break;
      }

      case 'telemetry': {
        // Drone telemetry GPS beep sequence
        [800, 1200, 1600, 2000].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, now + i * 0.1);
          gain.gain.setValueAtTime(0.08, now + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.1);
          osc.stop(now + i * 0.1 + 0.08);
        });
        break;
      }

      case 'success': {
        // Major fanfare C - E - G - C
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.12);
          gain.gain.setValueAtTime(0.25, now + i * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.12);
          osc.stop(now + i * 0.12 + 0.6);
        });
        break;
      }
    }
  },

  populateCaseDropdown() {
    const dropdown = document.getElementById('case-select');
    if (!dropdown) return;

    dropdown.innerHTML = '';
    window.TIKTOK_CASES.forEach((c) => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = `${c.title} (${c.difficulty})`;
      dropdown.appendChild(opt);
    });

    dropdown.addEventListener('change', (e) => {
      this.loadCase(e.target.value);
    });
  },

  loadCase(caseId) {
    const foundCase = window.TIKTOK_CASES.find(c => c.id === caseId);
    if (!foundCase) return;

    this.currentCase = foundCase;
    this.currentVideoIndex = 0;

    const dropdown = document.getElementById('case-select');
    if (dropdown) dropdown.value = caseId;

    if (window.DetectiveBoard) {
      window.DetectiveBoard.init(this.currentCase);
    }

    this.renderCurrentVideo();
    this.renderProfile();
    this.switchScreen('feed');
  },

  switchScreen(screenName) {
    this.activeScreen = screenName;
    document.querySelectorAll('.tt-screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tt-nav-item').forEach(n => n.classList.remove('active'));

    const targetScreen = document.getElementById(`tt-screen-${screenName}`);
    if (targetScreen) targetScreen.classList.add('active');

    const navBtn = document.getElementById(`nav-${screenName}`);
    if (navBtn) navBtn.classList.add('active');
  },

  nextVideo() {
    if (!this.currentCase || !this.currentCase.videos) return;
    if (this.currentVideoIndex < this.currentCase.videos.length - 1) {
      this.currentVideoIndex++;
      this.playSound('click');
      this.renderCurrentVideo();
    }
  },

  prevVideo() {
    if (!this.currentCase || !this.currentCase.videos) return;
    if (this.currentVideoIndex > 0) {
      this.currentVideoIndex--;
      this.playSound('click');
      this.renderCurrentVideo();
    }
  },

  setupKeyboardControls() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        if (this.activeScreen === 'feed') this.nextVideo();
      } else if (e.key === 'ArrowUp') {
        if (this.activeScreen === 'feed') this.prevVideo();
      } else if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));
        const comments = document.getElementById('comments-modal');
        if (comments) comments.classList.remove('open');
      }
    });
  },

  setupNavigation() {
    const navFeed = document.getElementById('nav-feed');
    const navProfile = document.getElementById('nav-profile');
    const avatarBtn = document.getElementById('feed-avatar-btn');
    const creatorTag = document.getElementById('feed-creator-tag');
    const btnNextVid = document.getElementById('feed-next-btn');
    const btnPrevVid = document.getElementById('feed-prev-btn');

    if (btnNextVid) btnNextVid.addEventListener('click', () => this.nextVideo());
    if (btnPrevVid) btnPrevVid.addEventListener('click', () => this.prevVideo());

    if (navFeed) navFeed.addEventListener('click', () => {
      this.playSound('click');
      this.switchScreen('feed');
    });

    if (navProfile) navProfile.addEventListener('click', () => {
      this.playSound('click');
      this.switchScreen('profile');
    });

    if (avatarBtn) avatarBtn.addEventListener('click', () => {
      this.playSound('click');
      this.switchScreen('profile');
    });

    if (creatorTag) creatorTag.addEventListener('click', () => {
      this.playSound('click');
      this.switchScreen('profile');
    });

    // Like button heart animation
    const likeBtn = document.getElementById('feed-like-btn');
    if (likeBtn) {
      likeBtn.addEventListener('click', () => {
        this.playSound('click');
        const icon = likeBtn.querySelector('.tt-action-icon');
        if (icon) {
          icon.style.color = icon.style.color === 'rgb(254, 44, 85)' ? 'white' : '#fe2c55';
          icon.style.transform = 'scale(1.3)';
          setTimeout(() => icon.style.transform = 'scale(1)', 150);
        }
      });
    }

    // Audio Disc button in feed
    const discBtn = document.getElementById('feed-disc-btn');
    const audioPill = document.getElementById('feed-audio-pill');
    const playCurrentAudio = () => {
      const video = this.currentCase.videos[this.currentVideoIndex];
      if (video && video.audioTrack) {
        this.playSound(video.audioTrack.type);
        this.openInspectorModal({
          id: `audio-${video.id}`,
          label: video.audioTrack.label || "Audio-Spur & Umgebungsgeräusch",
          description: video.audioTrack.text,
          category: "Audio & Geräusch-Analyse",
          relevance: "Akustischer Beweis zur Umgebung",
          audioType: video.audioTrack.type
        });
      }
    };

    if (discBtn) discBtn.addEventListener('click', playCurrentAudio);
    if (audioPill) audioPill.addEventListener('click', playCurrentAudio);
  },

  renderCurrentVideo() {
    if (!this.currentCase || !this.currentCase.videos || this.currentCase.videos.length === 0) return;

    const video = this.currentCase.videos[this.currentVideoIndex];
    const suspect = this.currentCase.suspect;

    // Set Avatar & Handle
    const avatarEl = document.getElementById('feed-avatar-emoji');
    if (avatarEl) avatarEl.textContent = suspect.avatar || '👤';

    const creatorEl = document.getElementById('feed-creator-tag');
    if (creatorEl) creatorEl.innerHTML = `${suspect.handle} ${suspect.verified ? '✔️' : ''}`;

    const captionEl = document.getElementById('feed-caption-text');
    if (captionEl) captionEl.innerHTML = `${video.caption} <br><small style="color: #8b949e;">🕒 Gepostet: ${video.postedAt}</small>`;

    const audioText = document.getElementById('feed-audio-text');
    if (audioText) audioText.textContent = video.music || 'Originalton';

    const likesCount = document.getElementById('feed-likes-count');
    if (likesCount) likesCount.textContent = video.likes;

    const commentsCount = document.getElementById('feed-comments-count');
    if (commentsCount) commentsCount.textContent = video.commentsCount || (video.comments ? video.comments.length : '0');

    const sharesCount = document.getElementById('feed-shares-count');
    if (sharesCount) sharesCount.textContent = video.shares || '5';

    // Update Video Counter Indicator
    const counterEl = document.getElementById('feed-video-counter');
    if (counterEl) {
      counterEl.textContent = `Video ${this.currentVideoIndex + 1} / ${this.currentCase.videos.length}`;
    }

    // Up/Down Navigation Buttons State
    const btnPrev = document.getElementById('feed-prev-btn');
    const btnNext = document.getElementById('feed-next-btn');
    if (btnPrev) btnPrev.style.opacity = this.currentVideoIndex > 0 ? '1' : '0.3';
    if (btnNext) btnNext.style.opacity = this.currentVideoIndex < this.currentCase.videos.length - 1 ? '1' : '0.3';

    // Render Scene Visuals
    const canvasContainer = document.getElementById('video-canvas-container');
    if (canvasContainer && window.VideoRenderer) {
      window.VideoRenderer.renderScene(video, canvasContainer, (hotspot) => {
        this.playSound('click');
        this.openInspectorModal(hotspot);
      });
    }

    // Mark inspected hotspots
    if (window.DetectiveBoard) {
      video.hotspots?.forEach(h => {
        if (window.DetectiveBoard.discoveredClues.has(h.id)) {
          const el = document.querySelector(`[data-clue-id="${h.id}"]`);
          if (el) el.classList.add('inspected');
        }
      });
    }
  },

  renderProfile() {
    if (!this.currentCase) return;

    const suspect = this.currentCase.suspect;

    const avatarEl = document.getElementById('profile-avatar-emoji');
    if (avatarEl) avatarEl.textContent = suspect.avatar || '👤';

    const nameEl = document.getElementById('profile-name-text');
    if (nameEl) nameEl.innerHTML = `${suspect.name} ${suspect.verified ? '✔️' : ''}`;

    const handleEl = document.getElementById('profile-handle-text');
    if (handleEl) handleEl.textContent = suspect.handle;

    const followingEl = document.getElementById('profile-following-val');
    if (followingEl) followingEl.textContent = suspect.following;

    const followersEl = document.getElementById('profile-followers-val');
    if (followersEl) followersEl.textContent = suspect.followers;

    const likesEl = document.getElementById('profile-likes-val');
    if (likesEl) likesEl.textContent = suspect.likes;

    const bioEl = document.getElementById('profile-bio-text');
    if (bioEl) bioEl.textContent = suspect.bio;

    // Render Video Grid
    const gridContainer = document.getElementById('profile-video-grid');
    if (gridContainer) {
      gridContainer.innerHTML = '';
      this.currentCase.videos.forEach((vid, idx) => {
        const item = document.createElement('div');
        item.className = 'tt-grid-item';
        item.innerHTML = `
          ${idx === 0 ? '<div class="tt-grid-item-badge">📌 Pinned</div>' : ''}
          <div style="flex: 1; display: flex; align-items: center; justify-content: center; font-size: 28px;">
            ${idx === 0 ? '☕️' : idx === 1 ? '📱' : '🛹'}
          </div>
          <div class="tt-grid-item-views">▶ ${vid.views}</div>
        `;
        item.addEventListener('click', () => {
          this.playSound('click');
          this.currentVideoIndex = idx;
          this.renderCurrentVideo();
          this.switchScreen('feed');
        });
        gridContainer.appendChild(item);
      });
    }
  },

  setupCommentsModal() {
    const btn = document.getElementById('feed-comments-btn');
    const modal = document.getElementById('comments-modal');
    const closeBtn = document.getElementById('comments-close-btn');

    if (btn && modal) {
      btn.addEventListener('click', () => {
        this.playSound('click');
        this.renderCommentsList();
        modal.classList.add('open');
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        this.playSound('click');
        modal.classList.remove('open');
      });
    }
  },

  renderCommentsList() {
    const list = document.getElementById('comments-list');
    if (!list || !this.currentCase) return;

    const video = this.currentCase.videos[this.currentVideoIndex];
    list.innerHTML = '';

    if (!video.comments || video.comments.length === 0) {
      list.innerHTML = '<div style="color: #8b949e; text-align: center; padding: 20px;">Keine Kommentare vorhanden.</div>';
      return;
    }

    video.comments.forEach(c => {
      const item = document.createElement('div');
      item.className = 'tt-comment-item';
      item.innerHTML = `
        <div class="tt-comment-avatar">${c.isAuthor ? (this.currentCase.suspect.avatar || '👤') : '💬'}</div>
        <div class="tt-comment-body">
          <div class="tt-comment-user">
            <b>@${c.user}</b>
            ${c.isAuthor ? '<span class="tt-badge-author">Autor</span>' : ''}
          </div>
          <div class="tt-comment-text ${c.isSus ? 'tt-comment-sus-highlight' : ''}">
            ${c.text}
          </div>
          <div class="tt-comment-footer">
            <span>${c.time}</span>
            <span>Antworten</span>
            ${c.isSus ? '<span style="color: #ffe600; font-weight: bold; cursor: pointer;" class="inspect-comment-clue">🔍 Als Zeugenaussage untersuchen</span>' : ''}
          </div>
        </div>
      `;

      if (c.isSus) {
        const clueBtn = item.querySelector('.inspect-comment-clue');
        if (clueBtn) {
          clueBtn.addEventListener('click', () => {
            this.playSound('click');
            // Close comments drawer so inspector is clean
            const commentsDrawer = document.getElementById('comments-modal');
            if (commentsDrawer) commentsDrawer.classList.remove('open');

            this.openInspectorModal({
              id: `comment-${c.user}`,
              label: `Kommentar von @${c.user}`,
              description: `💬 Zeugenaussage im Kommentar: „${c.text}“ (${c.time}). Ein wichtiger Zeugenhinweis!`,
              category: "Zeugenaussage & Kommentare",
              relevance: "Widerspricht der offiziellen Story des Verdächtigen"
            });
          });
        }
      }

      list.appendChild(item);
    });
  },

  setupInspectorModal() {
    const modal = document.getElementById('inspector-modal');
    const closeBtn = document.getElementById('inspector-close-btn');
    const soundBtn = document.getElementById('inspector-play-sound-btn');

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        this.playSound('click');
        modal.classList.remove('open');
      });
    }

    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        if (this.currentInspectedClue && this.currentInspectedClue.audioType) {
          this.playSound(this.currentInspectedClue.audioType);
        }
      });
    }
  },

  openInspectorModal(clue) {
    this.currentInspectedClue = clue;
    if (window.DetectiveBoard) window.DetectiveBoard.discoverClue(clue);

    const modal = document.getElementById('inspector-modal');
    const titleEl = document.getElementById('inspector-title');
    const catEl = document.getElementById('inspector-category');
    const descEl = document.getElementById('inspector-desc');
    const relevanceEl = document.getElementById('inspector-relevance');
    const audioBox = document.getElementById('inspector-audio-box');
    const buttonsContainer = document.getElementById('inspector-pin-buttons');

    if (titleEl) titleEl.textContent = clue.label || 'Beweisstück';
    if (catEl) catEl.textContent = clue.category || 'Indiz';
    if (descEl) descEl.textContent = clue.description || '';
    if (relevanceEl) relevanceEl.textContent = clue.relevance || '';

    if (audioBox) {
      audioBox.style.display = clue.audioType ? 'flex' : 'none';
    }

    // Dynamically generate pin buttons for each statement
    if (buttonsContainer && this.currentCase && this.currentCase.statements) {
      buttonsContainer.innerHTML = '';
      this.currentCase.statements.forEach((stmt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'btn-pin-clue';
        btn.innerHTML = `📌 An Aussage ${idx + 1} anheften`;
        btn.title = stmt.claim;
        btn.addEventListener('click', () => {
          if (window.DetectiveBoard) {
            const added = window.DetectiveBoard.pinClueToStatement(stmt.id, clue);
            this.playSound('pin');
            modal.classList.remove('open');
            alert(added ? `Beweis erfolgreich an Aussage ${idx + 1} angeheftet!` : `Dieser Beweis ist bereits an Aussage ${idx + 1} angeheftet.`);
          }
        });
        buttonsContainer.appendChild(btn);
      });
    }

    if (modal) modal.classList.add('open');
  },

  setupVerdictModal() {
    const btnSubmit = document.getElementById('btn-submit-verdict');
    const modal = document.getElementById('verdict-modal');
    const closeBtn = document.getElementById('verdict-close-btn');

    if (btnSubmit) {
      btnSubmit.addEventListener('click', () => {
        if (!window.DetectiveBoard) return;
        const evaluation = window.DetectiveBoard.evaluateVerdict();
        if (!evaluation) return;

        this.playSound('success');
        this.renderVerdictResults(evaluation);
        if (modal) modal.classList.add('open');
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        this.playSound('click');
        modal.classList.remove('open');
      });
    }
  },

  renderVerdictResults(res) {
    const badgeEl = document.getElementById('verdict-badge-icon');
    const rankEl = document.getElementById('verdict-rank-title');
    const starsEl = document.getElementById('verdict-stars');
    const scoreEl = document.getElementById('verdict-score-text');
    const feedbackList = document.getElementById('verdict-feedback-list');
    const takeawaysList = document.getElementById('verdict-takeaways-list');

    if (badgeEl) badgeEl.textContent = res.badgeIcon;
    if (rankEl) rankEl.textContent = res.rank;
    if (starsEl) starsEl.textContent = res.stars;
    if (scoreEl) scoreEl.textContent = res.score;

    if (feedbackList) {
      feedbackList.innerHTML = '';
      res.feedbackItems.forEach(item => {
        const li = document.createElement('li');
        li.style.marginBottom = '12px';
        li.style.padding = '8px 12px';
        li.style.background = item.isCorrect ? 'rgba(46, 160, 67, 0.1)' : 'rgba(254, 44, 85, 0.1)';
        li.style.borderRadius = '8px';
        li.style.borderLeft = item.isCorrect ? '3px solid #2ea043' : '3px solid #fe2c55';
        li.innerHTML = `
          <b>Aussage ${item.statementNumber}:</b> <i>„${item.claim}“</i><br>
          Deine Bewertung: <b>${item.userDecision}</b> | Tatsächlich: <b>${item.expected}</b> 
          ${item.isCorrect ? '✅ (Richtig)' : '❌ (Falsch)'}<br>
          <small style="color: #79c0ff; display: block; margin-top: 4px;">🔍 <b>Ermittlungs-Erkenntnis:</b> ${item.explanation}</small>
        `;
        feedbackList.appendChild(li);
      });
    }

    if (takeawaysList) {
      takeawaysList.innerHTML = '';
      res.takeaways.forEach(t => {
        const li = document.createElement('li');
        li.innerHTML = t;
        takeawaysList.appendChild(li);
      });
    }
  }
};

window.addEventListener('DOMContentLoaded', () => {
  window.App.init();
});
