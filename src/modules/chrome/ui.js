/**
 * Module d'interface utilisateur pour TCL Calculator
 */

import { calculateAll } from './calculator.js'
import { copyToClipboard, loadFromStorage, saveToStorage, validateInputs } from './utils.js'

/**
 * Gestionnaire de l'interface utilisateur
 */
class UIController {
  constructor() {
    this.formData = {
      direction: 'long',
      accountSize: 1000,
      risk: 50,
      leverage: 50,
      high: 203.93,
      low: 200.45,
      manage1: 4,
      manage2: 7.3,
    }
    this.calculations = {}
    this.init()
  }

  /**
   * Initialise l'interface utilisateur
   */
  async init() {
    await this.loadSavedData()
    this.createForm()
    this.createResultsTable()
    this.bindEvents()
    this.calculate()
  }

  /**
   * Charge les données sauvegardées
   */
  async loadSavedData() {
    const savedData = await loadFromStorage()
    if (savedData) {
      this.formData = { ...this.formData, ...savedData }
    }
  }

  /**
   * Crée le formulaire d'entrée
   */
  createForm() {
    const container = document.getElementById('form-container')
    container.innerHTML = `
      <div class="form-section">
        <h3>📊 Configuration du Compte</h3>
        <div class="form-group">
          <label for="accountSize">Taille du Compte</label>
          <input type="number" id="accountSize" value="${this.formData.accountSize}" placeholder="1000">
        </div>
        <div class="form-group">
          <label>Direction</label>
          <div class="radio-group">
            <label class="radio-label">
              <input type="radio" name="direction" value="long" ${this.formData.direction === 'long' ? 'checked' : ''}>
              <span>📈 Long</span>
            </label>
            <label class="radio-label">
              <input type="radio" name="direction" value="short" ${this.formData.direction === 'short' ? 'checked' : ''}>
              <span>📉 Short</span>
            </label>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3>📈 Prix High/Low</h3>
        <div class="form-group">
          <label for="high">Prix Haut</label>
          <input type="number" id="high" step="0.01" value="${this.formData.high}" placeholder="203.93">
        </div>
        <div class="form-group">
          <label for="low">Prix Bas</label>
          <input type="number" id="low" step="0.01" value="${this.formData.low}" placeholder="200.45">
        </div>
      </div>

      <div class="form-section">
        <h3>⚖️ Gestion des Risques</h3>
        <div class="form-group">
          <label for="risk">Risque (%)</label>
          <input type="number" id="risk" value="${this.formData.risk}" placeholder="50">
        </div>
        <div class="form-group">
          <label for="leverage">Levier</label>
          <input type="number" id="leverage" value="${this.formData.leverage}" placeholder="50">
        </div>
      </div>

      <div class="form-section">
        <h3>🎯 Gestion des Positions</h3>
        <div class="form-group">
          <label for="manage1">Manage 1</label>
          <input type="number" id="manage1" value="${this.formData.manage1}" placeholder="4">
        </div>
        <div class="form-group">
          <label for="manage2">Manage 2</label>
          <input type="number" id="manage2" value="${this.formData.manage2}" placeholder="7.3">
        </div>
      </div>

      <div class="form-actions">
        <button type="button" id="calculate-btn" class="btn btn-primary">
          ⚡ Calculer
        </button>
        <button type="button" id="save-btn" class="btn btn-secondary">
          💾 Sauvegarder
        </button>
        <button type="button" id="reset-btn" class="btn btn-danger">
          🔄 Réinitialiser
        </button>
      </div>
    `
  }

  /**
   * Crée le tableau des résultats
   */
  createResultsTable() {
    const container = document.getElementById('results-container')
    container.innerHTML = `
      <div class="results-section">
        <h3>📊 Positions Calculées</h3>
        <div class="positions-grid" id="positions-grid">
          <!-- Le contenu sera généré dynamiquement -->
        </div>
      </div>

      <div class="results-section">
        <h3>📈 Résumé des Calculs</h3>
        <div class="summary-grid" id="summary-grid">
          <!-- Le contenu sera généré dynamiquement -->
        </div>
      </div>

      <div class="results-section">
        <h3>🔍 Détails Techniques</h3>
        <div class="debug-grid" id="debug-grid">
          <!-- Le contenu sera généré dynamiquement -->
        </div>
      </div>
    `
  }

  /**
   * Lie les événements
   */
  bindEvents() {
    // Événements des inputs
    const inputs = document.querySelectorAll('input[type="number"], input[type="radio"]')
    inputs.forEach(input => {
      input.addEventListener('input', () => this.handleInputChange())
      input.addEventListener('change', () => this.handleInputChange())
    })

    // Événements des boutons
    document.getElementById('calculate-btn').addEventListener('click', () => this.calculate())
    document.getElementById('save-btn').addEventListener('click', () => this.saveData())
    document.getElementById('reset-btn').addEventListener('click', () => this.resetForm())
  }

  /**
   * Gère les changements d'input
   */
  handleInputChange() {
    this.updateFormData()
    this.calculate()
  }

  /**
   * Met à jour les données du formulaire
   */
  updateFormData() {
    this.formData = {
      direction: document.querySelector('input[name="direction"]:checked').value,
      accountSize: parseFloat(document.getElementById('accountSize').value) || 0,
      risk: parseFloat(document.getElementById('risk').value) || 0,
      leverage: parseFloat(document.getElementById('leverage').value) || 0,
      high: parseFloat(document.getElementById('high').value) || 0,
      low: parseFloat(document.getElementById('low').value) || 0,
      manage1: parseFloat(document.getElementById('manage1').value) || 0,
      manage2: parseFloat(document.getElementById('manage2').value) || 0,
    }
  }

  /**
   * Effectue les calculs
   */
  calculate() {
    this.updateFormData()

    // Validation
    const validation = validateInputs(this.formData)
    if (!validation.isValid) {
      this.showError(validation.errors.join(', '))
      return
    }

    try {
      this.calculations = calculateAll(this.formData)
      this.displayResults()
      this.hideError()
    } catch (error) {
      this.showError('Erreur lors du calcul: ' + error.message)
    }
  }

  /**
   * Affiche les résultats
   */
  displayResults() {
    this.displayPositions()
    this.displaySummary()
    this.displayDebug()
  }

  /**
   * Affiche le tableau des positions
   */
  displayPositions() {
    const grid = document.getElementById('positions-grid')
    grid.innerHTML = `
      <div class="grid-header">
        <div>Position</div>
        <div>Prix</div>
        <div>Quantité</div>
        <div>TP</div>
        <div>Profit</div>
        <div>Profit %</div>
      </div>
      
      <div class="grid-row">
        <div class="position-label">Entry</div>
        <div class="copyable" data-value="${this.calculations.autoEntry}">
          ${this.calculations.autoEntry}
        </div>
        <div class="copyable" data-value="${this.calculations.autoQty}">
          ${this.calculations.autoQty}
        </div>
        <div class="copyable" data-value="${this.calculations.autoTp}">
          ${this.calculations.autoTp}
        </div>
        <div>${this.calculations.entryProfit}</div>
        <div>${this.calculations.entryProfitPercentage}%</div>
      </div>
      
      <div class="grid-row">
        <div class="position-label">L1</div>
        <div class="copyable" data-value="${this.calculations.autoL1Entry}">
          ${this.calculations.autoL1Entry}
        </div>
        <div class="copyable" data-value="${this.calculations.autoL1Qty}">
          ${this.calculations.autoL1Qty}
        </div>
        <div class="copyable" data-value="${this.calculations.autoL1Tp}">
          ${this.calculations.autoL1Tp}
        </div>
        <div>${this.calculations.L1Profit}</div>
        <div>${this.calculations.L1ProfitPercentage}%</div>
      </div>
      
      <div class="grid-row">
        <div class="position-label">L2</div>
        <div class="copyable" data-value="${this.calculations.autoL2Entry}">
          ${this.calculations.autoL2Entry}
        </div>
        <div class="copyable" data-value="${this.calculations.autoL2Qty}">
          ${this.calculations.autoL2Qty}
        </div>
        <div class="copyable" data-value="${this.calculations.autoL2Tp}">
          ${this.calculations.autoL2Tp}
        </div>
        <div>${this.calculations.L2Profit}</div>
        <div>${this.calculations.L2ProfitPercentage}%</div>
      </div>
      
      <div class="grid-row">
        <div class="position-label">SL</div>
        <div class="copyable" data-value="${this.calculations.autoSl}">
          ${this.calculations.autoSl}
        </div>
        <div>${this.calculations.D8}</div>
        <div></div>
        <div>-${this.calculations.riskReward}</div>
        <div>-${this.formData.risk}%</div>
      </div>
    `

    // Ajouter les événements de copie
    this.bindCopyEvents()
  }

  /**
   * Affiche le résumé
   */
  displaySummary() {
    const grid = document.getElementById('summary-grid')
    grid.innerHTML = `
      <div class="summary-item">
        <span class="label">Direction:</span>
        <span class="value">${this.formData.direction.toUpperCase()}</span>
      </div>
      <div class="summary-item">
        <span class="label">Compte:</span>
        <span class="value">${this.formData.accountSize}</span>
      </div>
      <div class="summary-item">
        <span class="label">Levier:</span>
        <span class="value">${this.formData.leverage}</span>
      </div>
      <div class="summary-item">
        <span class="label">Marge:</span>
        <span class="value">${this.calculations.margin}%</span>
      </div>
    `
  }

  /**
   * Affiche les détails techniques
   */
  displayDebug() {
    const grid = document.getElementById('debug-grid')
    grid.innerHTML = `
      <div class="debug-item">
        <span class="label">A11:</span>
        <span class="value">${this.calculations.A11}</span>
      </div>
      <div class="debug-item">
        <span class="label">A12:</span>
        <span class="value">${this.calculations.A12}</span>
      </div>
      <div class="debug-item">
        <span class="label">D8:</span>
        <span class="value">${this.calculations.D8}</span>
      </div>
      <div class="debug-item">
        <span class="label">E8:</span>
        <span class="value">${this.calculations.E8}</span>
      </div>
      <div class="debug-item">
        <span class="label">I11:</span>
        <span class="value">${this.calculations.I11}</span>
      </div>
      <div class="debug-item">
        <span class="label">I12:</span>
        <span class="value">${this.calculations.I12}</span>
      </div>
    `
  }

  /**
   * Lie les événements de copie
   */
  bindCopyEvents() {
    const copyableElements = document.querySelectorAll('.copyable')
    copyableElements.forEach(element => {
      element.addEventListener('click', async () => {
        const value = element.dataset.value
        const success = await copyToClipboard(value)
        if (success) {
          this.showCopyFeedback(element)
        }
      })
    })
  }

  /**
   * Affiche un feedback de copie
   */
  showCopyFeedback(element) {
    const originalText = element.textContent
    element.textContent = '✓ Copié!'
    element.classList.add('copied')

    setTimeout(() => {
      element.textContent = originalText
      element.classList.remove('copied')
    }, 1000)
  }

  /**
   * Sauvegarde les données
   */
  async saveData() {
    await saveToStorage(this.formData)
    this.showSuccess('Données sauvegardées!')
  }

  /**
   * Réinitialise le formulaire
   */
  resetForm() {
    this.formData = {
      direction: 'long',
      accountSize: 1000,
      risk: 50,
      leverage: 50,
      high: 0,
      low: 0,
      manage1: 4,
      manage2: 6,
    }
    this.createForm()
    this.bindEvents()
    this.calculate()
  }

  /**
   * Affiche une erreur
   */
  showError(message) {
    let errorDiv = document.getElementById('error-message')
    if (!errorDiv) {
      errorDiv = document.createElement('div')
      errorDiv.id = 'error-message'
      errorDiv.className = 'error-message'
      document.body.insertBefore(errorDiv, document.body.firstChild)
    }
    errorDiv.textContent = message
    errorDiv.style.display = 'block'
  }

  /**
   * Cache l'erreur
   */
  hideError() {
    const errorDiv = document.getElementById('error-message')
    if (errorDiv) {
      errorDiv.style.display = 'none'
    }
  }

  /**
   * Affiche un message de succès
   */
  showSuccess(message) {
    const successDiv = document.createElement('div')
    successDiv.className = 'success-message'
    successDiv.textContent = message
    document.body.appendChild(successDiv)

    setTimeout(() => {
      successDiv.remove()
    }, 2000)
  }
}

export { UIController }
