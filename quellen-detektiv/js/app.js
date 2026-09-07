/**
 * Main Application Logic & User Interaction
 */

document.addEventListener("DOMContentLoaded", () => {
  const detector = new DetectorEngine();
  const editor = new ScenarioEditor();

  // State
  let currentScenario = null;
  let activeSource = null;
  let pendingSelection = null;

  // DOM Elements - Views
  const views = {
    home: document.getElementById("view-home"),
    linktree: document.getElementById("view-linktree"),
    report: document.getElementById("view-report"),
    editor: document.getElementById("view-editor")
  };

  // TTS Speech Controller
  class SpeechHandler {
    constructor() {
      this.synth = window.speechSynthesis;
      this.currentUtterance = null;
      this.currentActiveBtn = null;
    }

    speak(text, btnElement) {
      if (!this.synth) {
        alert("Text-to-Speech wird von deinem Browser leider nicht unterstützt.");
        return;
      }

      // If already speaking with this button, stop
      if (this.synth.speaking && this.currentActiveBtn === btnElement) {
        this.stop();
        return;
      }

      // Stop any existing playback
      this.stop();

      const cleanText = text.replace(/<[^>]*>/g, "").trim();
      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "de-DE";
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Select German voice if available
      const voices = this.synth.getVoices();
      const deVoice = voices.find(v => v.lang.startsWith("de") || v.lang === "de_DE");
      if (deVoice) {
        utterance.voice = deVoice;
      }

      this.currentUtterance = utterance;
      this.currentActiveBtn = btnElement;

      if (btnElement) {
        btnElement.classList.add("speaking");
        btnElement.innerHTML = "⏹️ Stopp";
      }

      utterance.onend = () => {
        this.resetButton(btnElement);
        this.currentActiveBtn = null;
        this.currentUtterance = null;
      };

      utterance.onerror = () => {
        this.resetButton(btnElement);
        this.currentActiveBtn = null;
        this.currentUtterance = null;
      };

      this.synth.speak(utterance);
    }

    stop() {
      if (this.synth) {
        this.synth.cancel();
      }
      if (this.currentActiveBtn) {
        this.resetButton(this.currentActiveBtn);
        this.currentActiveBtn = null;
      }
      this.currentUtterance = null;
    }

    resetButton(btn) {
      if (!btn) return;
      btn.classList.remove("speaking");
      btn.innerHTML = "🔊 Vorlesen";
    }
  }

  const speech = new SpeechHandler();

  // Nav buttons
  const navBrand = document.getElementById("nav-brand");
  const btnNavHome = document.getElementById("btn-nav-home");
  const btnNavEditor = document.getElementById("btn-nav-editor");
  const btnNavReport = document.getElementById("btn-nav-report");
  const navFindingsCount = document.getElementById("nav-findings-count");

  // Home elements
  const scenarioList = document.getElementById("scenario-list");

  // Linktree elements
  const scenarioAvatar = document.getElementById("scenario-avatar");
  const scenarioCategoryBadge = document.getElementById("scenario-category-badge");
  const scenarioTitle = document.getElementById("scenario-title");
  const scenarioSubtitle = document.getElementById("scenario-subtitle");
  const scenarioDesc = document.getElementById("scenario-desc");
  const linktreeTotalFindings = document.getElementById("linktree-total-findings");
  const sourceTreeContainer = document.getElementById("source-tree-container");
  const btnFinishChallenge = document.getElementById("btn-finish-challenge");

  // Inspector Modal elements
  const inspectorModal = document.getElementById("inspector-modal");
  const modalBadge = document.getElementById("modal-badge");
  const modalSourceTitle = document.getElementById("modal-source-title");
  const modalExternalLink = document.getElementById("modal-external-link");
  const modalOriginalText = document.getElementById("modal-original-text");
  const modalAiText = document.getElementById("modal-ai-text");
  const modalFindingBadge = document.getElementById("modal-finding-badge");
  const modalFindingsList = document.getElementById("modal-findings-list");
  const btnCloseInspector = document.getElementById("btn-close-inspector");
  const selectionBubble = document.getElementById("selection-bubble");
  const btnTtsOriginal = document.getElementById("btn-tts-original");
  const btnTtsAi = document.getElementById("btn-tts-ai");

  // Finding Popover Modal
  const findingFormModal = document.getElementById("finding-form-modal");
  const findingForm = document.getElementById("finding-form");
  const popoverQuote = document.getElementById("popover-quote");
  const popoverType = document.getElementById("popover-type");
  const popoverNote = document.getElementById("popover-note");
  const btnCancelFinding = document.getElementById("btn-cancel-finding");

  // Report elements
  const reportTitle = document.getElementById("report-title");
  const reportSubtitle = document.getElementById("report-subtitle");
  const reportSummaryText = document.getElementById("report-summary-text");
  const reportFindingsList = document.getElementById("report-findings-list");
  const btnToggleReveal = document.getElementById("btn-toggle-reveal");
  const revealContent = document.getElementById("reveal-content");
  const revealSourcesList = document.getElementById("reveal-sources-list");
  const btnBackToTree = document.getElementById("btn-back-to-tree");

  // Editor elements
  const editorForm = document.getElementById("editor-form");
  const edSourcesContainer = document.getElementById("ed-sources-container");
  const btnAddSourceField = document.getElementById("btn-add-source-field");
  const btnExportJson = document.getElementById("btn-export-json");
  const btnImportJson = document.getElementById("btn-import-json");

  // ==========================================
  // VIEW ROUTER
  // ==========================================
  function switchView(viewName) {
    Object.keys(views).forEach(k => {
      views[k].classList.remove("active");
    });
    if (views[viewName]) {
      views[viewName].classList.add("active");
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Update Nav bar status
    updateNavCounters();
  }

  function updateNavCounters() {
    if (!currentScenario) {
      btnNavReport.style.display = "none";
      return;
    }
    const allFindings = detector.getAllScenarioFindings(currentScenario.id);
    navFindingsCount.textContent = allFindings.length;
    btnNavReport.style.display = "inline-flex";
  }

  // ==========================================
  // INITIALIZE / RENDER SCENARIO GRID (HOME)
  // ==========================================
  function renderScenarioGrid() {
    scenarioList.innerHTML = "";
    const allScenarios = editor.getAllScenarios();

    allScenarios.forEach(sc => {
      const card = document.createElement("div");
      card.className = "scenario-card";
      
      const findings = detector.getAllScenarioFindings(sc.id);
      const isCustom = sc.id.startsWith("custom_");

      card.innerHTML = `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span class="badge badge-purple">${sc.category || "Medien"}</span>
            <span style="font-size: 0.78rem; color: var(--text-dim);">🎯 ${sc.targetAge || "13-15 Jahre"}</span>
          </div>
          <h3 style="font-size: 1.2rem; font-weight: 700; color: #fff; margin-bottom: 6px;">${sc.title}</h3>
          <p style="font-size: 0.9rem; color: var(--accent-cyan); font-weight: 600; margin-bottom: 8px;">${sc.subtitle}</p>
          <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5;">${sc.description}</p>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-color);">
          <span style="font-size: 0.82rem; color: ${findings.length > 0 ? "var(--accent-amber)" : "var(--text-dim)"};">
            ${findings.length > 0 ? `🚨 ${findings.length} Funde protokolliert` : `📚 ${sc.sources.length} Quellen zu prüfen`}
          </span>
          <button class="btn btn-primary btn-sm">Starten 🚀</button>
        </div>
      `;

      card.addEventListener("click", () => {
        selectScenario(sc);
      });

      scenarioList.appendChild(card);
    });
  }

  // ==========================================
  // SELECT & LOAD SCENARIO (LINKTREE)
  // ==========================================
  function selectScenario(scenario) {
    currentScenario = scenario;
    detector.setScenario(scenario);

    // Populate header
    scenarioAvatar.textContent = scenario.title.slice(0, 2) || "🕵️";
    scenarioCategoryBadge.textContent = scenario.category || "Medienkompetenz";
    scenarioTitle.textContent = scenario.title;
    scenarioSubtitle.textContent = scenario.subtitle;
    scenarioDesc.textContent = scenario.description;

    renderLinktreeSources();
    switchView("linktree");
  }

  function renderLinktreeSources() {
    if (!currentScenario) return;
    sourceTreeContainer.innerHTML = "";

    const allFindings = detector.getAllScenarioFindings(currentScenario.id);
    linktreeTotalFindings.textContent = allFindings.length;
    updateNavCounters();

    currentScenario.sources.forEach((src, idx) => {
      const srcFindings = detector.getSourceFindings(src.id);
      const item = document.createElement("div");
      item.className = "source-item";

      const hasFindings = srcFindings.length > 0;
      const statusBadge = hasFindings
        ? `<span class="badge badge-amber">📝 ${srcFindings.length} Notiz(en)</span>`
        : `<span class="badge badge-cyan">👀 Nicht geöffnet</span>`;

      item.innerHTML = `
        <div class="source-header">
          <div>
            <div class="source-meta" style="margin-bottom: 4px;">
              <span class="badge badge-purple">${src.badge || "Quelle " + (idx + 1)}</span>
              ${statusBadge}
            </div>
            <h3 class="source-title">${src.title}</h3>
            <p class="source-author">${src.author || "Unbekannter Autor"} (${src.year || "o.D."})</p>
          </div>
        </div>

        <div style="background: rgba(0,0,0,0.25); border-radius: var(--radius-sm); padding: 12px; border-left: 3px solid var(--accent-purple);">
          <div style="font-size: 0.75rem; color: var(--accent-cyan); font-weight: 700; margin-bottom: 2px;">KI-ZUSAMMENFASSUNG:</div>
          <p style="font-size: 0.88rem; color: #d1d5db; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${src.aiSummary}
          </p>
        </div>

        <div class="source-actions">
          <button class="btn btn-primary btn-sm btn-open-check" data-source-id="${src.id}">
            📄 Original lesen & mit KI abgleichen
          </button>
          <a href="${src.originalUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" onclick="event.stopPropagation();">
            🌐 Zur Website
          </a>
        </div>
      `;

      item.querySelector(".btn-open-check").addEventListener("click", () => {
        openInspector(src);
      });

      sourceTreeContainer.appendChild(item);
    });
  }

  // ==========================================
  // INSPECTOR MODAL (SIDE-BY-SIDE CHECK)
  // ==========================================
  function openInspector(source) {
    speech.stop();
    activeSource = source;
    detector.setSource(source.id);

    modalBadge.textContent = source.badge || "Quelle";
    modalSourceTitle.textContent = source.title;
    modalExternalLink.href = source.originalUrl;
    modalOriginalText.textContent = source.originalText;

    renderAiTextAndFindings();

    inspectorModal.classList.add("active");
  }

  function closeInspector() {
    speech.stop();
    inspectorModal.classList.remove("active");
    selectionBubble.style.display = "none";
    renderLinktreeSources();
  }

  // TTS Vorlese-Buttons
  btnTtsOriginal.addEventListener("click", () => {
    if (!activeSource) return;
    speech.speak(activeSource.originalText, btnTtsOriginal);
  });

  btnTtsAi.addEventListener("click", () => {
    if (!activeSource) return;
    speech.speak(activeSource.aiSummary, btnTtsAi);
  });

  function renderAiTextAndFindings() {
    if (!activeSource) return;

    // Render highlighted text
    modalAiText.innerHTML = detector.renderHighlightedText(activeSource.aiSummary, activeSource.id);

    // Render findings list inside inspector
    const findings = detector.getSourceFindings(activeSource.id);
    modalFindingBadge.textContent = `${findings.length} Funde`;

    modalFindingsList.innerHTML = "";
    if (findings.length === 0) {
      modalFindingsList.innerHTML = `<p style="font-size: 0.82rem; color: var(--text-dim); font-style: italic;">Noch keine Fehler markiert. Markiere eine Textstelle oben, um einen Fund zu speichern.</p>`;
    } else {
      findings.forEach(f => {
        const card = document.createElement("div");
        card.className = "finding-card";
        card.innerHTML = `
          <div class="finding-card-content">
            <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 2px;">
              <span class="badge badge-amber" style="font-size: 0.65rem;">${f.type}</span>
            </div>
            <div class="finding-card-quote">„${detector.escapeHtml(f.quote)}“</div>
            <div class="finding-card-note"><strong>Notiz:</strong> ${detector.escapeHtml(f.note)}</div>
          </div>
          <button class="btn btn-danger btn-sm" title="Fund löschen" data-id="${f.id}" style="padding: 4px 8px; font-size: 0.75rem;">✕</button>
        `;

        card.querySelector("button").addEventListener("click", () => {
          detector.removeFinding(activeSource.id, f.id);
          renderAiTextAndFindings();
        });

        modalFindingsList.appendChild(card);
      });
    }

    // Attach click listeners to highlights in the text
    modalAiText.querySelectorAll(".ai-highlight").forEach(el => {
      el.addEventListener("click", () => {
        const fId = el.getAttribute("data-finding-id");
        const found = findings.find(f => f.id === fId);
        if (found) {
          alert(`🔎 Fund: ${found.type}\n\nMarkiert: „${found.quote}“\n\nDeine Begründung: ${found.note}`);
        }
      });
    });
  }

  // ==========================================
  // TEXT SELECTION & ERROR POPUP
  // ==========================================
  modalAiText.addEventListener("mouseup", handleTextSelection);
  modalAiText.addEventListener("touchend", handleTextSelection);

  function handleTextSelection() {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (text.length > 2) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const containerRect = modalAiText.getBoundingClientRect();

      pendingSelection = text;
      selectionBubble.style.top = `${rect.top - containerRect.top - 38}px`;
      selectionBubble.style.left = `${Math.max(10, rect.left - containerRect.left + (rect.width / 2) - 60)}px`;
      selectionBubble.style.display = "inline-flex";
    } else {
      selectionBubble.style.display = "none";
      pendingSelection = null;
    }
  }

  selectionBubble.addEventListener("click", () => {
    if (!pendingSelection) return;
    selectionBubble.style.display = "none";

    popoverQuote.textContent = `„${pendingSelection}“`;
    popoverNote.value = "";
    findingFormModal.classList.add("active");
  });

  btnCancelFinding.addEventListener("click", () => {
    findingFormModal.classList.remove("active");
    pendingSelection = null;
  });

  findingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!activeSource || !pendingSelection) return;

    detector.addFinding(
      activeSource.id,
      pendingSelection,
      popoverType.value,
      popoverNote.value
    );

    findingFormModal.classList.remove("active");
    pendingSelection = null;
    window.getSelection().removeAllRanges();
    renderAiTextAndFindings();
  });

  btnCloseInspector.addEventListener("click", closeInspector);

  // Close modal when clicking background
  inspectorModal.addEventListener("click", (e) => {
    if (e.target === inspectorModal) closeInspector();
  });

  // ==========================================
  // REPORT VIEW & REVEAL
  // ==========================================
  function showReportView() {
    if (!currentScenario) return;

    reportTitle.textContent = `Detektiv-Bericht: ${currentScenario.title}`;
    reportSubtitle.textContent = `Auswertung deines KI-Quellenchecks`;

    const allFindings = detector.getAllScenarioFindings(currentScenario.id);
    reportSummaryText.innerHTML = `Du hast insgesamt <strong>${allFindings.length} Unstimmigkeiten</strong> protokolliert.`;

    reportFindingsList.innerHTML = "";
    if (allFindings.length === 0) {
      reportFindingsList.innerHTML = `<p style="font-size: 0.9rem; color: var(--text-dim); font-style: italic;">Du hast keine Fehler markiert. Hast du alle Quellen genau gelesen?</p>`;
    } else {
      allFindings.forEach(f => {
        const src = currentScenario.sources.find(s => s.id === f.sourceId);
        const card = document.createElement("div");
        card.className = "finding-card";
        card.innerHTML = `
          <div class="finding-card-content">
            <div style="font-size: 0.75rem; color: var(--accent-cyan); font-weight: 700; margin-bottom: 2px;">
              ${src ? src.title : "Quelle"}
            </div>
            <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 4px;">
              <span class="badge badge-amber" style="font-size: 0.68rem;">${f.type}</span>
            </div>
            <div class="finding-card-quote">„${detector.escapeHtml(f.quote)}“</div>
            <div class="finding-card-note"><strong>Deine Begründung:</strong> ${detector.escapeHtml(f.note)}</div>
          </div>
        `;
        reportFindingsList.appendChild(card);
      });
    }

    // Prepare reveal section
    revealContent.style.display = "none";
    btnToggleReveal.textContent = "👁️ Auflösung aufdecken";
    renderRevealSources();

    switchView("report");
  }

  function renderRevealSources() {
    revealSourcesList.innerHTML = "";
    currentScenario.sources.forEach((src, idx) => {
      const box = document.createElement("div");
      box.style.marginBottom = "20px";

      let errorsHtml = "";
      if (src.knownErrors && src.knownErrors.length > 0) {
        errorsHtml = src.knownErrors.map(err => `
          <div class="reveal-error-item">
            <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 4px;">
              <span class="badge badge-amber" style="font-size: 0.7rem;">${err.type}</span>
              <strong style="font-size: 0.88rem; color: #fde68a;">„${err.quote}“</strong>
            </div>
            <p style="font-size: 0.85rem; color: #e5e7eb;">💡 <strong>Korrektur / Realität:</strong> ${err.explanation}</p>
          </div>
        `).join("");
      } else {
        errorsHtml = `<p style="font-size: 0.85rem; color: var(--text-dim); font-style: italic;">Für diese Quelle wurden keine automatischen Musterfehler hinterlegt.</p>`;
      }

      box.innerHTML = `
        <h4 style="font-size: 1rem; color: var(--accent-cyan); margin-bottom: 6px;">
          Quelle ${idx + 1}: ${src.title}
        </h4>
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">
          Eingebaute KI-Halluzinationen & Fehler (${src.knownErrors ? src.knownErrors.length : 0} Stück):
        </div>
        ${errorsHtml}
      `;

      revealSourcesList.appendChild(box);
    });
  }

  btnToggleReveal.addEventListener("click", () => {
    if (revealContent.style.display === "none") {
      revealContent.style.display = "block";
      btnToggleReveal.textContent = "🙈 Auflösung verbergen";
    } else {
      revealContent.style.display = "none";
      btnToggleReveal.textContent = "👁️ Auflösung aufdecken";
    }
  });

  btnFinishChallenge.addEventListener("click", showReportView);
  btnNavReport.addEventListener("click", showReportView);
  btnBackToTree.addEventListener("click", () => switchView("linktree"));

  // ==========================================
  // NAVIGATION
  // ==========================================
  btnNavHome.addEventListener("click", () => {
    renderScenarioGrid();
    switchView("home");
  });
  navBrand.addEventListener("click", () => {
    renderScenarioGrid();
    switchView("home");
  });
  btnNavEditor.addEventListener("click", () => {
    initEditorView();
    switchView("editor");
  });

  // ==========================================
  // TEACHER EDITOR LOGIC
  // ==========================================
  function initEditorView() {
    edSourcesContainer.innerHTML = "";
    addEditorSourceField();
  }

  function addEditorSourceField(sourceData = null) {
    const idx = edSourcesContainer.children.length + 1;
    const card = document.createElement("div");
    card.className = "source-item ed-source-card";
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h4 style="font-size: 0.95rem; color: var(--accent-cyan);">Quelle ${idx}</h4>
        <button type="button" class="btn btn-danger btn-sm btn-remove-ed-src" style="padding: 2px 8px;">Entfernen</button>
      </div>

      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 10px;">
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label">Titel der Quelle</label>
          <input type="text" class="form-control ed-src-title" placeholder="z.B. Studie zu Smartphone-Nutzung" value="${sourceData ? sourceData.title : ""}" required>
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label">Kategorie / Badge</label>
          <input type="text" class="form-control ed-src-badge" placeholder="z.B. Uni-Studie" value="${sourceData ? sourceData.badge : "Fachartikel"}">
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 10px;">
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label">Autor / Institution</label>
          <input type="text" class="form-control ed-src-author" placeholder="z.B. Prof. Dr. Schmidt" value="${sourceData ? sourceData.author : ""}">
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label">Erscheinungsjahr</label>
          <input type="text" class="form-control ed-src-year" placeholder="z.B. 2024" value="${sourceData ? sourceData.year : "2024"}">
        </div>
      </div>

      <div class="form-group" style="margin-bottom: 0;">
        <label class="form-label">Original-Link (URL)</label>
        <input type="url" class="form-control ed-src-url" placeholder="https://..." value="${sourceData ? sourceData.originalUrl : "https://example.com"}">
      </div>

      <div class="form-group" style="margin-bottom: 0;">
        <label class="form-label">Originaltext (Volltext oder Auszug für den Abgleich)</label>
        <textarea class="form-control ed-src-original" placeholder="Echter Text aus dem Originalartikel..." required>${sourceData ? sourceData.originalText : ""}</textarea>
      </div>

      <div class="form-group" style="margin-bottom: 0;">
        <label class="form-label">KI-Zusammenfassung (mit Fehlern / Halluzinationen zum Suchen)</label>
        <textarea class="form-control ed-src-ai" placeholder="Zusammenfassung mit absichtlichen oder echten KI-Fehlern..." required>${sourceData ? sourceData.aiSummary : ""}</textarea>
      </div>
    `;

    card.querySelector(".btn-remove-ed-src").addEventListener("click", () => {
      if (edSourcesContainer.children.length > 1) {
        card.remove();
      } else {
        alert("Mindestens eine Quelle muss vorhanden sein.");
      }
    });

    edSourcesContainer.appendChild(card);
  }

  btnAddSourceField.addEventListener("click", () => addEditorSourceField());

  editorForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("ed-title").value.trim();
    const subtitle = document.getElementById("ed-subtitle").value.trim();
    const category = document.getElementById("ed-category").value.trim();
    const desc = document.getElementById("ed-desc").value.trim();

    const sources = [];
    const sourceCards = edSourcesContainer.querySelectorAll(".ed-source-card");

    sourceCards.forEach((card, idx) => {
      sources.push({
        id: "src_" + Date.now() + "_" + idx,
        title: card.querySelector(".ed-src-title").value.trim(),
        badge: card.querySelector(".ed-src-badge").value.trim() || "Quelle",
        author: card.querySelector(".ed-src-author").value.trim() || "Autor",
        year: card.querySelector(".ed-src-year").value.trim() || "2024",
        originalUrl: card.querySelector(".ed-src-url").value.trim() || "https://example.com",
        originalText: card.querySelector(".ed-src-original").value.trim(),
        aiSummary: card.querySelector(".ed-src-ai").value.trim(),
        knownErrors: []
      });
    });

    const newScenario = {
      id: "custom_" + Date.now().toString(36),
      title: title,
      subtitle: subtitle,
      category: category,
      description: desc,
      targetAge: "13-15 Jahre",
      sources: sources
    };

    editor.saveScenario(newScenario);
    alert("🎉 Thema erfolgreich gespeichert!");
    renderScenarioGrid();
    selectScenario(newScenario);
  });

  btnExportJson.addEventListener("click", () => {
    if (!currentScenario) {
      alert("Wähle zuerst ein Thema aus oder speichere ein neues Szenario.");
      return;
    }
    const jsonStr = editor.exportAsJson(currentScenario.id);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `szenario_${currentScenario.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  btnImportJson.addEventListener("click", () => {
    const jsonInput = prompt("Füge hier das JSON eines Szenarios ein:");
    if (!jsonInput) return;
    try {
      const imported = editor.importFromJson(jsonInput);
      alert("✅ Szenario erfolgreich importiert: " + imported.title);
      renderScenarioGrid();
      selectScenario(imported);
    } catch (err) {
      alert("❌ Fehler beim Import: " + err.message);
    }
  });

  // ==========================================
  // INITIAL RUN
  // ==========================================
  renderScenarioGrid();
});
