/**
 * Editor & Custom Scenario Management for Teachers
 */

class ScenarioEditor {
  constructor() {
    this.customScenariosKey = "quellen_detektiv_custom_scenarios";
    this.customScenarios = this.loadCustomScenarios();
  }

  loadCustomScenarios() {
    try {
      const saved = localStorage.getItem(this.customScenariosKey);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn("Could not load custom scenarios", e);
      return [];
    }
  }

  saveCustomScenarios() {
    try {
      localStorage.setItem(this.customScenariosKey, JSON.stringify(this.customScenarios));
    } catch (e) {
      console.warn("Could not save custom scenarios", e);
    }
  }

  getAllScenarios() {
    return [...PRESET_SCENARIOS, ...this.customScenarios];
  }

  getScenarioById(id) {
    return this.getAllScenarios().find(s => s.id === id) || null;
  }

  saveScenario(scenarioData) {
    const existingIndex = this.customScenarios.findIndex(s => s.id === scenarioData.id);
    if (existingIndex >= 0) {
      this.customScenarios[existingIndex] = scenarioData;
    } else {
      this.customScenarios.push(scenarioData);
    }
    this.saveCustomScenarios();
    return scenarioData;
  }

  deleteCustomScenario(id) {
    this.customScenarios = this.customScenarios.filter(s => s.id !== id);
    this.saveCustomScenarios();
  }

  exportAsJson(scenarioId) {
    const scenario = this.getScenarioById(scenarioId);
    if (!scenario) return null;
    return JSON.stringify(scenario, null, 2);
  }

  importFromJson(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.id || !parsed.title || !Array.isArray(parsed.sources)) {
        throw new Error("Ungültiges Szenario-Format");
      }
      // Ensure unique ID if imported
      parsed.id = "custom_" + (parsed.id.replace(/^custom_/, '')) + "_" + Date.now().toString(36);
      this.customScenarios.push(parsed);
      this.saveCustomScenarios();
      return parsed;
    } catch (e) {
      throw new Error("Import fehlgeschlagen: " + e.message);
    }
  }
}

if (typeof module !== "undefined") {
  module.exports = { ScenarioEditor };
}
