/**
 * Module de calculs pour TCL Calculator
 */

import { formatNumber, normalizeNumber } from './utils.js'

/**
 * Calcule les points d'entrée automatiques
 * @param {number} high - Prix haut
 * @param {number} low - Prix bas
 * @returns {Object} - Points d'entrée calculés
 */
const calculateEntryPoints = (high, low) => {
  const range = high - low

  return {
    autoEntry: range * 0.618 + low,
    autoL1Entry: range * 0.382 + low,
    autoL2Entry: range * 0.17 + low,
    range,
  }
}

/**
 * Calcule les niveaux de take profit et stop loss
 * @param {number} high - Prix haut
 * @param {number} low - Prix bas
 * @param {string} direction - Direction du trade (long/short)
 * @returns {Object} - Niveaux calculés
 */
const calculateTpSl = (high, low, direction) => {
  const range = high - low

  return {
    autoTp: range * 1.272 + low,
    autoSl: range * -0.05 + low,
  }
}

/**
 * Calcule les moyennes pondérées
 * @param {Object} entryPoints - Points d'entrée
 * @returns {Object} - Moyennes pondérées
 */
const calculateWeightedAverages = entryPoints => {
  const { autoEntry, autoL1Entry, autoL2Entry } = entryPoints

  return {
    A11: (autoEntry + autoL1Entry * 3) / 4,
    A12: (autoEntry + autoL1Entry * 3 + autoL2Entry * 5) / 9,
  }
}

/**
 * Calcule les quantités de position
 * @param {Object} params - Paramètres de calcul
 * @returns {Object} - Quantités calculées
 */
const calculateQuantities = params => {
  const { riskReward, A12, autoSl, direction, autoEntry, autoTp, manage1, manage2 } = params

  const A12LessAutoSlCalc = Math.round((A12 - autoSl) * 100) / 100
  const D8 =
    direction === 'long' ? riskReward / normalizeNumber(A12 - autoSl) : riskReward / (autoSl - A12)

  const E8 = direction === 'long' ? autoTp - autoEntry : autoEntry - autoTp

  const autoQty = D8 / 9
  const autoQtyPercentage = normalizeNumber((E8 / autoEntry) * 100)
  const autoL1Qty = autoQty * 3
  const autoL2Qty = autoQty * 5

  const I11 = (D8 / 9) * 4
  const I12 = D8

  return {
    D8,
    E8,
    autoQty,
    autoQtyPercentage,
    autoL1Qty,
    autoL2Qty,
    I11,
    I12,
    A12LessAutoSlCalc,
  }
}

/**
 * Calcule les niveaux de take profit pour L1 et L2
 * @param {Object} params - Paramètres de calcul
 * @returns {Object} - Niveaux de TP calculés
 */
const calculateTakeProfitLevels = params => {
  const { A11, A12, autoQtyPercentage, manage1, manage2, direction } = params

  const autoL1Tp =
    direction === 'long'
      ? A11 + (autoQtyPercentage / 100 / manage1) * A11
      : A11 - (autoQtyPercentage / 100 / manage1) * A11

  const autoL2Tp =
    direction === 'long'
      ? A12 + (autoQtyPercentage / 100 / manage2) * A12
      : A12 - (autoQtyPercentage / 100 / manage2) * A12

  return {
    autoL1Tp,
    autoL2Tp,
  }
}

/**
 * Calcule la marge
 * @param {Object} params - Paramètres de calcul
 * @returns {number} - Marge calculée
 */
const calculateMargin = params => {
  const { A12, I12, accountSize, leverage } = params
  return ((A12 * I12) / (accountSize * leverage * 0.6)) * 100
}

/**
 * Calcule les profits
 * @param {Object} params - Paramètres de calcul
 * @returns {Object} - Profits calculés
 */
const calculateProfits = params => {
  const {
    direction,
    autoEntry,
    autoTp,
    autoQty,
    A11,
    autoL1Tp,
    I11,
    A12,
    autoL2Tp,
    I12,
    accountSize,
  } = params

  const calculateProfit = (entry, tp, qty) => {
    return direction === 'long' ? tp * qty - entry * qty : entry * qty - tp * qty
  }

  const entryProfit = calculateProfit(autoEntry, autoTp, autoQty)
  const L1Profit = calculateProfit(A11, autoL1Tp, I11)
  const L2Profit = calculateProfit(A12, autoL2Tp, I12)

  return {
    entryProfit,
    L1Profit,
    L2Profit,
    entryProfitPercentage: (entryProfit / accountSize) * 100,
    L1ProfitPercentage: (L1Profit / accountSize) * 100,
    L2ProfitPercentage: (L2Profit / accountSize) * 100,
  }
}

/**
 * Fonction principale de calcul
 * @param {Object} formData - Données du formulaire
 * @returns {Object} - Tous les calculs formatés
 */
const calculateAll = formData => {
  const { direction, accountSize, risk, leverage, high, low, manage1, manage2 } = formData

  // Calculs de base
  const riskReward = (risk * accountSize) / 100
  const entryPoints = calculateEntryPoints(high, low)
  const tpSl = calculateTpSl(high, low, direction)
  const weightedAverages = calculateWeightedAverages(entryPoints)

  // Calculs des quantités
  const quantities = calculateQuantities({
    riskReward,
    A12: weightedAverages.A12,
    autoSl: tpSl.autoSl,
    direction,
    autoEntry: entryPoints.autoEntry,
    autoTp: tpSl.autoTp,
    manage1,
    manage2,
  })

  // Calculs des niveaux de TP
  const tpLevels = calculateTakeProfitLevels({
    A11: weightedAverages.A11,
    A12: weightedAverages.A12,
    autoQtyPercentage: quantities.autoQtyPercentage,
    manage1,
    manage2,
    direction,
  })

  // Calcul de la marge
  const margin = calculateMargin({
    A12: weightedAverages.A12,
    I12: quantities.I12,
    accountSize,
    leverage,
  })

  // Calculs des profits
  const profits = calculateProfits({
    direction,
    autoEntry: entryPoints.autoEntry,
    autoTp: tpSl.autoTp,
    autoQty: quantities.autoQty,
    A11: weightedAverages.A11,
    autoL1Tp: tpLevels.autoL1Tp,
    I11: quantities.I11,
    A12: weightedAverages.A12,
    autoL2Tp: tpLevels.autoL2Tp,
    I12: quantities.I12,
    accountSize,
  })

  // Retour des résultats formatés
  return {
    riskReward,
    autoEntry: formatNumber(entryPoints.autoEntry),
    autoTp: formatNumber(tpSl.autoTp),
    autoSl: formatNumber(tpSl.autoSl),
    autoL1Entry: formatNumber(entryPoints.autoL1Entry),
    autoL1Tp: formatNumber(tpLevels.autoL1Tp),
    autoL2Entry: formatNumber(entryPoints.autoL2Entry),
    autoL2Tp: formatNumber(tpLevels.autoL2Tp),
    A11: formatNumber(weightedAverages.A11),
    A12: formatNumber(weightedAverages.A12),
    D8: formatNumber(quantities.D8),
    E8: formatNumber(quantities.E8),
    I11: formatNumber(quantities.I11),
    I12: formatNumber(quantities.I12),
    autoQty: formatNumber(quantities.autoQty),
    autoQtyPercentage: formatNumber(quantities.autoQtyPercentage),
    autoL1Qty: formatNumber(quantities.autoL1Qty),
    autoL2Qty: formatNumber(quantities.autoL2Qty),
    margin: formatNumber(margin),
    entryProfit: formatNumber(profits.entryProfit),
    L1Profit: formatNumber(profits.L1Profit),
    L2Profit: formatNumber(profits.L2Profit),
    entryProfitPercentage: formatNumber(profits.entryProfitPercentage),
    L1ProfitPercentage: formatNumber(profits.L1ProfitPercentage),
    L2ProfitPercentage: formatNumber(profits.L2ProfitPercentage),
    A12LessAutoSlCalc: formatNumber(quantities.A12LessAutoSlCalc),
  }
}

export {
  calculateAll,
  calculateEntryPoints,
  calculateMargin,
  calculateProfits,
  calculateQuantities,
  calculateTakeProfitLevels,
  calculateTpSl,
  calculateWeightedAverages,
}
