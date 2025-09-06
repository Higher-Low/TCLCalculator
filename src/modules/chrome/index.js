/**
 * Point d'entrée principal de l'extension TCL Calculator
 */

import { UIController } from './ui.js'

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 TCL Calculator Extension - Initialisation...')

  try {
    // Créer et initialiser le contrôleur d'interface utilisateur
    const uiController = new UIController()

    // Exposer le contrôleur globalement pour le debugging
    window.tclCalculator = uiController

    console.log('✅ TCL Calculator Extension - Prêt!')
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation:", error)

    // Afficher un message d'erreur à l'utilisateur
    document.body.innerHTML = `
      <div style="padding: 2rem; text-align: center; color: #ef4444;">
        <h2>❌ Erreur d'initialisation</h2>
        <p>Une erreur s'est produite lors du chargement de l'extension.</p>
        <p style="font-size: 0.875rem; color: #64748b;">${error.message}</p>
        <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer;">
          🔄 Recharger
        </button>
      </div>
    `
  }
})

// Gestion des erreurs globales
window.addEventListener('error', event => {
  console.error('Erreur globale:', event.error)
})

window.addEventListener('unhandledrejection', event => {
  console.error('Promesse rejetée non gérée:', event.reason)
})
