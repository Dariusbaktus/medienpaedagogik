/**
 * TikTok-Detektiv: Detective Board & Evidence Engine
 * Handles evidence tracking, statement debunking, scoring and verdict analysis
 */

window.DetectiveBoard = {
  activeCase: null,
  discoveredClues: new Set(),
  pinnedClues: {}, // { [statementId]: [clueObject, ...] }
  userDecisions: {}, // { [statementId]: 'lie' | 'truth' | null }

  init(caseData) {
    this.activeCase = caseData;
    this.discoveredClues = new Set();
    this.pinnedClues = {};
    this.userDecisions = {};

    if (caseData && caseData.statements) {
      caseData.statements.forEach(stmt => {
        this.pinnedClues[stmt.id] = [];
        this.userDecisions[stmt.id] = null;
      });
    }

    this.renderBoard();
  },

  discoverClue(clue) {
    this.discoveredClues.add(clue.id);
    this.updateClueCountDisplay();
  },

  pinClueToStatement(statementId, clue) {
    if (!this.pinnedClues[statementId]) {
      this.pinnedClues[statementId] = [];
    }

    // Check if already pinned
    if (!this.pinnedClues[statementId].some(c => c.id === clue.id)) {
      this.pinnedClues[statementId].push(clue);
      this.renderBoard();
      return true;
    }
    return false;
  },

  removeClueFromStatement(statementId, clueId) {
    if (this.pinnedClues[statementId]) {
      this.pinnedClues[statementId] = this.pinnedClues[statementId].filter(c => c.id !== clueId);
      this.renderBoard();
    }
  },

  setUserDecision(statementId, decision) {
    this.userDecisions[statementId] = decision;
    this.renderBoard();
  },

  getTotalCluesInCase() {
    if (!this.activeCase || !this.activeCase.videos) return 0;
    let total = 0;
    this.activeCase.videos.forEach(v => {
      if (v.hotspots) total += v.hotspots.length;
      if (v.audioTrack) total += 1;
      if (v.comments) {
        v.comments.forEach(c => {
          if (c.isSus) total += 1;
        });
      }
    });
    return total;
  },

  updateClueCountDisplay() {
    const badge = document.getElementById('discovered-clues-badge');
    if (badge) {
      const total = this.getTotalCluesInCase();
      badge.innerHTML = `🔍 ${this.discoveredClues.size} / ${total} Indizien entdeckt`;
    }
  },

  renderBoard() {
    if (!this.activeCase) return;

    // Render Case Briefing Card
    const catBadge = document.getElementById('case-category-badge');
    if (catBadge) catBadge.textContent = this.activeCase.category;

    const diffEl = document.getElementById('case-difficulty-text');
    if (diffEl) diffEl.textContent = `Schwierigkeit: ${this.activeCase.difficulty}`;

    const titleEl = document.getElementById('case-title-text');
    if (titleEl) titleEl.textContent = this.activeCase.title;

    const sumEl = document.getElementById('case-summary-text');
    if (sumEl) sumEl.textContent = this.activeCase.summary;

    const suspEl = document.getElementById('case-suspect-val');
    if (suspEl) suspEl.textContent = `${this.activeCase.suspect.name} (${this.activeCase.suspect.handle})`;

    const timeEl = document.getElementById('case-time-val');
    if (timeEl) timeEl.textContent = this.activeCase.incidentTime;

    const locEl = document.getElementById('case-loc-val');
    if (locEl) locEl.textContent = this.activeCase.incidentLocation;

    // Render Statements
    const container = document.getElementById('statements-container');
    if (!container) return;

    container.innerHTML = '';

    this.activeCase.statements.forEach((stmt, idx) => {
      const card = document.createElement('div');
      const decision = this.userDecisions[stmt.id];
      card.className = `statement-card ${decision === 'lie' ? 'disproved' : decision === 'truth' ? 'verified' : ''}`;

      let statusBadge = '<span class="statement-status-tag status-open">❓ Offen / Ungeprüft</span>';
      if (decision === 'lie') {
        statusBadge = '<span class="statement-status-tag status-debunked">❌ Als Lüge markiert</span>';
      } else if (decision === 'truth') {
        statusBadge = '<span class="statement-status-tag status-confirmed">✅ Als Wahrheit markiert</span>';
      }

      const pinned = this.pinnedClues[stmt.id] || [];
      let pinnedHtml = '';
      if (pinned.length === 0) {
        pinnedHtml = '<div class="empty-clues-placeholder">📌 Noch keine Beweise angeheftet. Klicke auf Lupen oder Audio im Video, um Indizien hier anzupinnen!</div>';
      } else {
        pinned.forEach(clue => {
          pinnedHtml += `
            <div class="pinned-clue-pill">
              <span>🔎 <b>${clue.label}:</b> ${clue.category || 'Beweis'}</span>
              <span class="remove-clue" data-stmt-id="${stmt.id}" data-clue-id="${clue.id}" title="Entfernen">✕</span>
            </div>
          `;
        });
      }

      card.innerHTML = `
        <div class="statement-top">
          <div class="statement-text"><b>Aussage ${idx + 1}:</b> ${stmt.claim}</div>
          ${statusBadge}
        </div>
        <div>
          <div style="font-size: 11px; color: #8b949e; margin-bottom: 4px; font-weight: 600;">📎 Angeheftete Beweise:</div>
          <div class="pinned-clues-container" id="pinned-container-${stmt.id}">
            ${pinnedHtml}
          </div>
        </div>
        <div class="statement-actions">
          <button class="btn-decision ${decision === 'lie' ? 'active-lie' : ''}" data-stmt-id="${stmt.id}" data-decision="lie">
            ❌ Aussage ist gelogen / unplausibel
          </button>
          <button class="btn-decision ${decision === 'truth' ? 'active-truth' : ''}" data-stmt-id="${stmt.id}" data-decision="truth">
            ✅ Aussage stimmt / ist plausibel
          </button>
        </div>
      `;

      container.appendChild(card);
    });

    // Attach Event Listeners
    container.querySelectorAll('.btn-decision').forEach(btn => {
      btn.addEventListener('click', () => {
        const stmtId = btn.dataset.stmtId;
        const decision = btn.dataset.decision;
        this.setUserDecision(stmtId, decision);
        if (window.App && window.App.playSound) window.App.playSound('click');
      });
    });

    container.querySelectorAll('.remove-clue').forEach(btn => {
      btn.addEventListener('click', () => {
        const stmtId = btn.dataset.stmtId;
        const clueId = btn.dataset.clueId;
        this.removeClueFromStatement(stmtId, clueId);
      });
    });

    this.updateClueCountDisplay();
  },

  evaluateVerdict() {
    if (!this.activeCase) return null;

    let correctDecisions = 0;
    let totalStatements = this.activeCase.statements.length;
    let feedbackItems = [];

    this.activeCase.statements.forEach((stmt, idx) => {
      const decision = this.userDecisions[stmt.id];
      const isExpectedLie = stmt.isLie;
      const userSaidLie = (decision === 'lie');
      const pinned = this.pinnedClues[stmt.id] || [];

      let isCorrect = (decision !== null && ((isExpectedLie && userSaidLie) || (!isExpectedLie && !userSaidLie)));
      if (isCorrect) correctDecisions++;

      feedbackItems.push({
        statementNumber: idx + 1,
        claim: stmt.claim,
        isCorrect: isCorrect,
        userDecision: decision === 'lie' ? 'Gelogen' : decision === 'truth' ? 'Wahr' : 'Nicht bewertet',
        expected: isExpectedLie ? 'Gelogen' : 'Wahr',
        explanation: stmt.contradictionReason,
        pinnedCount: pinned.length
      });
    });

    const accuracy = correctDecisions / totalStatements;
    let stars = 1;
    let rank = "🥉 Junior-Ermittler";
    let badgeIcon = "🔍";

    if (accuracy === 1 && this.discoveredClues.size >= 2) {
      stars = 3;
      rank = `🏆 Meister-OSINT-Analyst (${this.activeCase.badge || 'Detektiv'})`;
      badgeIcon = "🌟";
    } else if (accuracy >= 0.5) {
      stars = 2;
      rank = "🥈 Aufmerksamer Ermittler";
      badgeIcon = "🕵️‍♂️";
    }

    return {
      caseTitle: this.activeCase.title,
      score: `${correctDecisions} / ${totalStatements} Aussagen korrekt bewertet`,
      stars: '⭐'.repeat(stars),
      starCount: stars,
      rank: rank,
      badgeIcon: badgeIcon,
      feedbackItems: feedbackItems,
      takeaways: this.activeCase.educationalTakeaways || []
    };
  }
};
