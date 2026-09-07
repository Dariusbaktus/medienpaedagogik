/**
 * TikTok-Detektiv: Case Editor & JSON Manager
 * Allows teachers to create custom detective scenarios, export and import them
 */

window.CaseEditor = {
  init() {
    this.setupEventListeners();
  },

  setupEventListeners() {
    const btnExport = document.getElementById('btn-export-json');
    const btnImport = document.getElementById('btn-import-json');
    const fileInput = document.getElementById('json-file-input');

    if (btnExport) {
      btnExport.addEventListener('click', () => this.exportCurrentCase());
    }

    if (btnImport && fileInput) {
      btnImport.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => this.handleFileImport(e));
    }
  },

  exportCurrentCase() {
    const currentCase = window.DetectiveBoard ? window.DetectiveBoard.activeCase : null;
    if (!currentCase) {
      alert("Kein aktiver Fall ausgewählt zum Exportieren.");
      return;
    }

    const jsonStr = JSON.stringify(currentCase, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentCase.id || 'tiktok-case'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedCase = JSON.parse(e.target.result);
        if (!importedCase.id || !importedCase.statements || !importedCase.videos) {
          throw new Error("Ungültiges Fall-Format: Erforderliche Felder fehlen.");
        }

        // Add to global cases or replace
        const existingIdx = window.TIKTOK_CASES.findIndex(c => c.id === importedCase.id);
        if (existingIdx >= 0) {
          window.TIKTOK_CASES[existingIdx] = importedCase;
        } else {
          window.TIKTOK_CASES.push(importedCase);
        }

        // Re-populate dropdown and switch to imported case
        if (window.App && window.App.populateCaseDropdown) {
          window.App.populateCaseDropdown();
          window.App.loadCase(importedCase.id);
        }

        alert(`Fall „${importedCase.title}“ erfolgreich importiert!`);
      } catch (err) {
        alert(`Fehler beim Laden der Datei: ${err.message}`);
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // reset
  }
};
