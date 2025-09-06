/**
 * Service Worker pour l'extension TCL Calculator
 */

// Gestionnaire pour l'ouverture du panneau latéral
chrome.action?.onClicked.addListener(async tab => {
  try {
    if (tab && tab.windowId !== undefined) {
      await chrome.sidePanel.open({ windowId: tab.windowId })
      console.log('📊 TCL Calculator - Panneau latéral ouvert')
    }
  } catch (error) {
    console.error("❌ Erreur lors de l'ouverture du panneau latéral:", error)
  }
})

// Gestionnaire pour l'installation de l'extension
chrome.runtime.onInstalled.addListener(details => {
  console.log('🚀 TCL Calculator Extension - Installation:', details.reason)

  if (details.reason === 'install') {
    // Première installation
    console.log('✅ TCL Calculator Extension - Première installation réussie')
  } else if (details.reason === 'update') {
    // Mise à jour
    console.log('🔄 TCL Calculator Extension - Mise à jour effectuée')
  }
})

// Gestionnaire pour les messages de l'extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('📨 Message reçu:', message)

  switch (message.type) {
    case 'GET_STORAGE_DATA':
      // Récupérer les données stockées
      chrome.storage.local.get(['tclCalculatorData'], result => {
        sendResponse({ success: true, data: result.tclCalculatorData })
      })
      return true // Indique que la réponse sera asynchrone

    case 'SAVE_STORAGE_DATA':
      // Sauvegarder les données
      chrome.storage.local.set({ tclCalculatorData: message.data }, () => {
        sendResponse({ success: true })
      })
      return true

    default:
      sendResponse({ success: false, error: 'Type de message non reconnu' })
  }
})

// Gestionnaire pour les erreurs
chrome.runtime.onStartup.addListener(() => {
  console.log('🔄 TCL Calculator Extension - Démarrage du navigateur')
})

// Gestionnaire pour la suspension/réactivation
chrome.runtime.onSuspend.addListener(() => {
  console.log('⏸️ TCL Calculator Extension - Suspension')
})

console.log('✅ TCL Calculator Extension - Service Worker initialisé')
