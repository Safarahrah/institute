# Guide de Test - VifTutor

Ce document décrit les tests manuels à effectuer pour valider le bon fonctionnement de la plateforme.

## 1. Test d'authentification

### 1.1 Inscription d'un élève
1. Ouvrir l'application
2. Cliquer sur "S'inscrire"
3. Remplir le formulaire:
   - Nom complet: "Test Élève"
   - Email: "eleve@test.com"
   - Mot de passe: "password123"
   - Rôle: Élève
4. Cliquer sur "S'inscrire"
5. **Résultat attendu**: L'utilisateur est connecté et redirigé vers le tableau de bord élève

### 1.2 Inscription d'un tuteur
1. Se déconnecter
2. Cliquer sur "S'inscrire"
3. Remplir le formulaire:
   - Nom complet: "Test Tuteur"
   - Email: "tuteur@test.com"
   - Mot de passe: "password123"
   - Rôle: Tuteur
4. Cliquer sur "S'inscrire"
5. **Résultat attendu**: L'utilisateur est connecté et redirigé vers le tableau de bord tuteur

### 1.3 Connexion
1. Se déconnecter
2. Cliquer sur "Se connecter"
3. Entrer les identifiants
4. Cliquer sur "Se connecter"
5. **Résultat attendu**: L'utilisateur est connecté

### 1.4 Déconnexion
1. Cliquer sur le bouton "Déconnexion" dans la barre de navigation
2. **Résultat attendu**: L'utilisateur est déconnecté et retourne à l'écran de connexion

## 2. Tests Élève

### 2.1 Visualisation des matières
1. Se connecter en tant qu'élève
2. Observer la page d'accueil
3. **Résultat attendu**:
   - 6 matières sont affichées (Mathématiques, Français, Sciences, Histoire-Géo, Anglais, Arts)
   - Chaque matière a une icône et une couleur distinctive
   - Les cartes sont cliquables

### 2.2 Visualisation des leçons
1. Cliquer sur une matière (ex: Mathématiques)
2. **Résultat attendu**:
   - Liste des leçons de la matière sélectionnée
   - Chaque leçon affiche: titre, description, niveau, durée
   - Bouton "Retour aux matières" visible

### 2.3 Suivre une leçon
1. Cliquer sur une leçon (ex: "Les additions simples")
2. Lire le contenu de la leçon
3. **Résultat attendu**:
   - Contenu structuré en sections
   - Bouton "Commencer les exercices" visible
   - Possibilité de revenir en arrière

### 2.4 Réaliser des exercices
1. Cliquer sur "Commencer les exercices"
2. Répondre à la première question
3. Cliquer sur "Valider"
4. **Résultat attendu**:
   - Feedback immédiat (correct/incorrect)
   - Explication affichée
   - Score mis à jour
   - Bouton "Question suivante"

### 2.5 Compléter une leçon
1. Répondre à toutes les questions
2. Cliquer sur "Terminer" à la dernière question
3. **Résultat attendu**:
   - Retour à la liste des leçons
   - Leçon marquée comme complétée (icône verte)
   - Score final affiché

### 2.6 Visualiser la progression
1. Cliquer sur l'onglet "Ma Progression"
2. **Résultat attendu**:
   - Statistiques générales: leçons terminées, score moyen, temps d'étude
   - Graphiques de progression par matière
   - Barres de progression avec pourcentages

### 2.7 Modifier le profil
1. Cliquer sur l'onglet "Profil"
2. Modifier le nom complet
3. Sélectionner un niveau scolaire
4. Ajouter une biographie
5. Cliquer sur "Enregistrer les modifications"
6. **Résultat attendu**:
   - Message de succès affiché
   - Profil mis à jour

## 3. Tests Tuteur

### 3.1 Visualiser ses leçons
1. Se connecter en tant que tuteur
2. **Résultat attendu**:
   - Liste vide ou liste des leçons créées
   - Bouton "Nouvelle leçon" visible

### 3.2 Créer une nouvelle leçon
1. Cliquer sur "Nouvelle leçon"
2. Remplir le formulaire:
   - Titre: "Test Leçon"
   - Description: "Description test"
   - Matière: Mathématiques
   - Niveau: CP
   - Durée: 30 minutes
3. Ajouter une section de contenu
4. Ajouter un exercice QCM avec 4 options
5. Cocher "Publier cette leçon"
6. Cliquer sur "Sauvegarder"
7. **Résultat attendu**:
   - Message de succès
   - Retour à la liste des leçons
   - Nouvelle leçon visible dans la liste

### 3.3 Modifier une leçon
1. Cliquer sur "Modifier" sur une leçon existante
2. Changer le titre
3. Ajouter une section supplémentaire
4. Cliquer sur "Sauvegarder"
5. **Résultat attendu**:
   - Modifications enregistrées
   - Retour à la liste

### 3.4 Publier/Dépublier une leçon
1. Cliquer sur l'icône œil (publié) ou œil barré (non publié)
2. **Résultat attendu**:
   - Statut de publication inversé
   - Icône mise à jour

### 3.5 Supprimer une leçon
1. Cliquer sur l'icône corbeille
2. Confirmer la suppression
3. **Résultat attendu**:
   - Leçon supprimée de la liste
   - Confirmation affichée

### 3.6 Gestion des exercices
1. Créer/Modifier une leçon
2. Ajouter différents types d'exercices:
   - QCM (4 options)
   - Vrai/Faux
   - Réponse courte
   - Texte à trous
3. Pour chaque exercice:
   - Ajouter une question
   - Définir la réponse correcte
   - Ajouter une explication
   - Définir les points
4. **Résultat attendu**:
   - Tous les types d'exercices sont sauvegardés
   - Exercices affichés dans l'ordre

## 4. Tests Admin

### 4.1 Tableau de bord admin
1. Créer un utilisateur admin dans la base de données:
   ```sql
   UPDATE users_profiles SET role = 'admin' WHERE id = 'USER_ID';
   ```
2. Se connecter avec ce compte
3. **Résultat attendu**:
   - Statistiques globales affichées:
     - Nombre total d'utilisateurs
     - Répartition élèves/tuteurs
     - Nombre de leçons
     - Score moyen global
   - Graphiques de répartition
   - Statistiques d'engagement

## 5. Tests de Sécurité RLS

### 5.1 Isolation des données élèves
1. Se connecter en tant qu'élève A
2. Compléter quelques leçons
3. Se déconnecter et se connecter en tant qu'élève B
4. **Résultat attendu**:
   - L'élève B ne voit pas la progression de l'élève A
   - Chaque élève voit uniquement ses propres données

### 5.2 Gestion des leçons tuteurs
1. Se connecter en tant que tuteur A
2. Créer une leçon
3. Se déconnecter et se connecter en tant que tuteur B
4. **Résultat attendu**:
   - Le tuteur B ne peut pas modifier la leçon du tuteur A
   - Chaque tuteur gère uniquement ses propres leçons

### 5.3 Accès aux leçons publiées
1. Tuteur crée une leçon non publiée
2. Se connecter en tant qu'élève
3. **Résultat attendu**:
   - L'élève ne voit pas les leçons non publiées
   - Seules les leçons publiées sont accessibles

## 6. Tests de Performance

### 6.1 Chargement des données
1. Accéder à différentes pages de l'application
2. **Résultat attendu**:
   - Temps de chargement < 2 secondes
   - Indicateurs de chargement affichés pendant le chargement
   - Pas d'erreurs dans la console

### 6.2 Navigation fluide
1. Naviguer entre différents onglets
2. Passer d'une matière à une autre
3. **Résultat attendu**:
   - Transitions fluides
   - Pas de rechargement complet de la page
   - État conservé lors de la navigation

## 7. Tests d'Interface

### 7.1 Responsive Design
1. Tester l'application sur différentes tailles d'écran:
   - Mobile (< 768px)
   - Tablette (768px - 1024px)
   - Desktop (> 1024px)
2. **Résultat attendu**:
   - Interface adaptée à chaque taille
   - Tous les éléments accessibles
   - Texte lisible

### 7.2 Interactions utilisateur
1. Tester tous les boutons et liens
2. Vérifier les états hover
3. Tester les animations
4. **Résultat attendu**:
   - Tous les éléments interactifs fonctionnent
   - Retours visuels clairs (hover, focus, active)
   - Animations fluides

## 8. Tests de Validation

### 8.1 Formulaires
1. Essayer de soumettre des formulaires vides
2. Essayer des formats d'email invalides
3. Essayer des mots de passe trop courts
4. **Résultat attendu**:
   - Messages d'erreur clairs
   - Validation côté client active
   - Impossible de soumettre des données invalides

### 8.2 Gestion des erreurs
1. Tenter de se connecter avec de mauvais identifiants
2. Tenter d'accéder à une ressource inexistante
3. **Résultat attendu**:
   - Messages d'erreur explicites
   - Pas de crash de l'application
   - Possibilité de réessayer

## Résumé des Tests

- [ ] Authentification (inscription, connexion, déconnexion)
- [ ] Parcours élève complet
- [ ] Parcours tuteur complet
- [ ] Tableau de bord admin
- [ ] Sécurité et isolation des données
- [ ] Performance et chargement
- [ ] Interface responsive
- [ ] Validation des formulaires
- [ ] Gestion des erreurs

## Notes

- Toutes les fonctionnalités utilisent Supabase pour la persistance
- Les politiques RLS garantissent la sécurité des données
- L'application fonctionne entièrement côté client avec React
- Aucun rechargement de page nécessaire (SPA)
