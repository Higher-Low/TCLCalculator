# TCL Calculator - Extension Chrome

## 📊 Description

Extension Chrome pour le calcul de positions de trading avec gestion des risques. Cette extension fournit un calculateur avancé pour les stratégies de trading avec des niveaux d'entrée, de sortie et de gestion des risques automatiques.

## 🏗️ Architecture

L'extension est structurée de manière modulaire avec une séparation claire des responsabilités :

### 📁 Structure des fichiers

```
src/modules/chrome/
├── index.html          # Interface utilisateur principale
├── index.js            # Point d'entrée de l'application
├── extension.js        # Service Worker (background script)
├── manifest.json       # Configuration de l'extension
├── style.css           # Styles CSS modernes et responsive
├── utils.js            # Fonctions utilitaires communes
├── calculator.js       # Module de calculs de trading
├── ui.js              # Contrôleur d'interface utilisateur
└── README.md          # Documentation
```

### 🔧 Modules

#### `utils.js`

- **Fonctions utilitaires** : normalisation des nombres, copie dans le presse-papiers
- **Validation** : validation des données d'entrée
- **Stockage** : sauvegarde et chargement des données

#### `calculator.js`

- **Calculs de trading** : points d'entrée, take profit, stop loss
- **Gestion des risques** : calcul des quantités et marges
- **Algorithmes** : moyennes pondérées, niveaux de gestion

#### `ui.js`

- **Contrôleur d'interface** : gestion des formulaires et affichage
- **Événements** : gestion des interactions utilisateur
- **Rendu** : génération dynamique du contenu

## 🚀 Fonctionnalités

### ✨ Interface utilisateur

- **Design moderne** : Interface responsive avec CSS Grid et Flexbox
- **Thème cohérent** : Variables CSS pour une personnalisation facile
- **Accessibilité** : Support des lecteurs d'écran et navigation clavier
- **Feedback visuel** : Animations et transitions fluides

### 📈 Calculs de trading

- **Points d'entrée automatiques** : Calcul basé sur les niveaux Fibonacci
- **Gestion des risques** : Calcul automatique des quantités et marges
- **Take Profit/Stop Loss** : Niveaux optimisés selon la stratégie
- **Positions multiples** : Support des positions L1 et L2

### 💾 Persistance des données

- **Sauvegarde automatique** : Stockage local des paramètres
- **Restauration** : Chargement automatique des données sauvegardées
- **Validation** : Vérification des données avant sauvegarde

### 📋 Fonctionnalités avancées

- **Copie rapide** : Clic pour copier les valeurs dans le presse-papiers
- **Calculs en temps réel** : Mise à jour automatique des résultats
- **Gestion d'erreurs** : Messages d'erreur clairs et informatifs

## 🛠️ Installation

### Prérequis

- Chrome/Chromium version 88+
- Support des modules ES6

### Installation manuelle

1. Téléchargez ou clonez le projet
2. Ouvrez Chrome et allez dans `chrome://extensions/`
3. Activez le "Mode développeur"
4. Cliquez sur "Charger l'extension non empaquetée"
5. Sélectionnez le dossier `src/modules/chrome/`

### Utilisation

1. Cliquez sur l'icône de l'extension dans la barre d'outils
2. Le panneau latéral s'ouvre avec l'interface du calculateur
3. Remplissez les paramètres de trading
4. Les calculs se mettent à jour automatiquement
5. Cliquez sur les valeurs pour les copier

## 📊 Paramètres

### Configuration du compte

- **Taille du compte** : Montant disponible pour le trading
- **Direction** : Long ou Short
- **Risque (%)** : Pourcentage de risque par trade
- **Levier** : Multiplicateur de levier

### Prix High/Low

- **Prix haut** : Niveau de résistance
- **Prix bas** : Niveau de support

### Gestion des positions

- **Manage 1** : Paramètre de gestion pour L1
- **Manage 2** : Paramètre de gestion pour L2

## 🎯 Résultats calculés

### Positions

- **Entry** : Point d'entrée principal
- **L1** : Position de niveau 1
- **L2** : Position de niveau 2
- **SL** : Stop Loss

### Métriques

- **Quantités** : Taille des positions
- **Take Profit** : Niveaux de sortie
- **Profit** : Profit potentiel
- **Marge** : Utilisation de la marge

## 🔧 Développement

### Structure modulaire

Chaque module a une responsabilité spécifique :

- **Séparation des préoccupations** : UI, logique métier, utilitaires
- **Réutilisabilité** : Fonctions modulaires et testables
- **Maintenabilité** : Code organisé et documenté

### Standards de code

- **ES6+** : Utilisation des modules et syntaxe moderne
- **Documentation** : Commentaires JSDoc pour toutes les fonctions
- **Gestion d'erreurs** : Try/catch et validation appropriée
- **Performance** : Calculs optimisés et rendu efficace

### Tests

- **Validation** : Tests des fonctions de calcul
- **Interface** : Tests des interactions utilisateur
- **Stockage** : Tests de persistance des données

## 📝 Changelog

### Version 1.0.0

- ✅ Architecture modulaire complète
- ✅ Interface utilisateur moderne et responsive
- ✅ Calculs de trading avancés
- ✅ Sauvegarde automatique des données
- ✅ Copie rapide des valeurs
- ✅ Gestion d'erreurs robuste

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Suivre les standards de code existants
4. Ajouter des tests si nécessaire
5. Soumettre une pull request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 🆘 Support

Pour toute question ou problème :

- Ouvrez une issue sur GitHub
- Consultez la documentation
- Vérifiez les logs de la console pour le debugging

---

**TCL Calculator** - Extension Chrome pour le trading professionnel 🚀
