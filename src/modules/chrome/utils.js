/**
 * Utilitaires pour l'extension TCL Calculator
 */

/**
 * Normalise un nombre selon l'algorithme spécifique
 * @param {number} value - Valeur à normaliser
 * @returns {number} - Valeur normalisée
 */
const normalizeNumber = value => {
  // Étape 1 : Multiplier par 100000 (décalage décimal)
  let result = value * 100000
  result = Math.round(result)
  // Étape 2 : Diviser par 10 (pour obtenir la première troncature)
  result = result / 10
  // Étape 3 : Arrondir à l'entier le plus proche
  result = Math.round(result)
  // Étape 4 : Diviser par 10 (nouvelle troncature)
  result = result / 10
  // Étape 5 : Arrondir à l'entier le plus proche
  result = Math.round(result)
  // Étape 6 : Diviser par 10 (encore une troncature)
  result = result / 10
  // Étape 7 : Arrondir à l'entier le plus proche
  result = Math.round(result)

  result = result / 100
  return result
}

/**
 * Copie du texte dans le presse-papiers
 * @param {string} text - Texte à copier
 * @returns {Promise<boolean>} - Succès de l'opération
 */
const copyToClipboard = async text => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Erreur lors de la copie:', err)
    return false
  }
}

/**
 * Formate un nombre avec un nombre spécifique de décimales
 * @param {number} value - Valeur à formater
 * @param {number} decimals - Nombre de décimales (défaut: 2)
 * @returns {string} - Valeur formatée
 */
const formatNumber = (value, decimals = 2) => {
  return parseFloat(value).toFixed(decimals)
}

/**
 * Valide les données d'entrée
 * @param {Object} data - Données à valider
 * @returns {Object} - Résultat de la validation
 */
const validateInputs = data => {
  const errors = []

  if (!data.accountSize || data.accountSize <= 0) {
    errors.push('La taille du compte doit être positive')
  }

  if (!data.risk || data.risk <= 0 || data.risk > 100) {
    errors.push('Le risque doit être entre 0 et 100%')
  }

  if (!data.leverage || data.leverage <= 0) {
    errors.push('Le levier doit être positif')
  }

  if (!data.high || data.high <= 0) {
    errors.push('Le prix haut doit être positif')
  }

  if (!data.low || data.low <= 0) {
    errors.push('Le prix bas doit être positif')
  }

  if (data.high <= data.low) {
    errors.push('Le prix haut doit être supérieur au prix bas')
  }

  if (!data.manage1 || data.manage1 <= 0) {
    errors.push('Manage 1 doit être positif')
  }

  if (!data.manage2 || data.manage2 <= 0) {
    errors.push('Manage 2 doit être positif')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Sauvegarde les données dans le stockage local
 * @param {Object} data - Données à sauvegarder
 */
const saveToStorage = async data => {
  try {
    await chrome.storage.local.set({ tclCalculatorData: data })
  } catch (err) {
    console.error('Erreur lors de la sauvegarde:', err)
  }
}

/**
 * Charge les données depuis le stockage local
 * @returns {Object|null} - Données chargées ou null
 */
const loadFromStorage = async () => {
  try {
    const result = await chrome.storage.local.get(['tclCalculatorData'])
    return result.tclCalculatorData || null
  } catch (err) {
    console.error('Erreur lors du chargement:', err)
    return null
  }
}

export {
  copyToClipboard,
  formatNumber,
  loadFromStorage,
  normalizeNumber,
  saveToStorage,
  validateInputs,
}
