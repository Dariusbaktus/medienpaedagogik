/**
 * Detector Engine: Text Highlighting, Finding Creation & State Management
 */

class DetectorEngine {
  constructor() {
    this.currentScenario = null;
    this.currentSourceId = null;
    // Map: sourceId -> Array of findings: { id, quote, type, note, timestamp }
    this.findings = {};
    this.activeSelection = null;
    this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem("quellen_detektiv_findings");
      if (saved) {
        this.findings = JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not load state from localStorage", e);
    }
  }

  saveState() {
    try {
      localStorage.setItem("quellen_detektiv_findings", JSON.stringify(this.findings));
    } catch (e) {
      console.warn("Could not save state to localStorage", e);
    }
  }

  clearAllFindings() {
    this.findings = {};
    this.saveState();
  }

  setScenario(scenario) {
    this.currentScenario = scenario;
    if (!this.findings[scenario.id]) {
      this.findings[scenario.id] = {};
    }
  }

  setSource(sourceId) {
    this.currentSourceId = sourceId;
    if (this.currentScenario && !this.findings[this.currentScenario.id][sourceId]) {
      this.findings[this.currentScenario.id][sourceId] = [];
    }
  }

  getSourceFindings(sourceId = this.currentSourceId) {
    if (!this.currentScenario || !this.findings[this.currentScenario.id]) return [];
    return this.findings[this.currentScenario.id][sourceId] || [];
  }

  getAllScenarioFindings(scenarioId = (this.currentScenario ? this.currentScenario.id : null)) {
    if (!scenarioId || !this.findings[scenarioId]) return [];
    const all = [];
    Object.keys(this.findings[scenarioId]).forEach(srcId => {
      const list = this.findings[scenarioId][srcId] || [];
      list.forEach(f => all.push({ ...f, sourceId: srcId }));
    });
    return all;
  }

  addFinding(sourceId, quote, type, note) {
    if (!this.currentScenario) return null;
    if (!this.findings[this.currentScenario.id]) {
      this.findings[this.currentScenario.id] = {};
    }
    if (!this.findings[this.currentScenario.id][sourceId]) {
      this.findings[this.currentScenario.id][sourceId] = [];
    }

    const finding = {
      id: "f_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
      quote: quote.trim(),
      type: type || "Sonstiger Fehler",
      note: note.trim(),
      timestamp: new Date().toISOString()
    };

    this.findings[this.currentScenario.id][sourceId].push(finding);
    this.saveState();
    return finding;
  }

  removeFinding(sourceId, findingId) {
    if (!this.currentScenario || !this.findings[this.currentScenario.id] || !this.findings[this.currentScenario.id][sourceId]) {
      return;
    }
    this.findings[this.currentScenario.id][sourceId] = this.findings[this.currentScenario.id][sourceId].filter(
      f => f.id !== findingId
    );
    this.saveState();
  }

  /**
   * Generiert den mit Markern versehenen HTML-Text der KI-Zusammenfassung
   */
  renderHighlightedText(text, sourceId) {
    const list = this.getSourceFindings(sourceId);
    if (!list || list.length === 0) {
      return this.escapeHtml(text).replace(/\n/g, "<br>");
    }

    // Sort findings by length of quote descending to prevent nested replacements breaking
    let html = this.escapeHtml(text);

    list.forEach(finding => {
      const escQuote = this.escapeHtml(finding.quote);
      if (html.includes(escQuote)) {
        const badge = `<mark class="ai-highlight" data-finding-id="${finding.id}" title="${this.escapeHtml(finding.type)}: ${this.escapeHtml(finding.note)}">${escQuote}<span class="mark-tag">${this.escapeHtml(finding.type)}</span></mark>`;
        html = html.replace(escQuote, badge);
      }
    });

    return html.replace(/\n/g, "<br>");
  }

  escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

if (typeof module !== "undefined") {
  module.exports = { DetectorEngine };
}
