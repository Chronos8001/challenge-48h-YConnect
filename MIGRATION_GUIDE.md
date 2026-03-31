# Guide de Migration - De Procédural à POO

## 📋 Plan de Migration

Cette guide explique comment refactoriser graduellement votre codebase existante.

## Phase 1: Configuration de Base (FAIT ✅)

### Fichiers créés:
- `back/src/Database.php` - Classe singleton
- `back/src/ResponseHandler.php` - Gestion réponses
- `back/src/Models/User.php`, `Post.php`, `Message.php`
- `back/src/Services/BaseService.php`
- `back/src/Services/AuthService.php`, etc.
- `back/core/bootstrap.php` - Autoloader

### Action:
Copier ces fichiers dans votre projet. L'autoloader charge automatiquement les classes.

## Phase 2: Refactoriser Auth (Urgent)

### Fichiers à refactoriser:
- `back/auth/login.php` 
- `back/auth/register.php`
- `back/auth/me.php`
- `back/auth/logout.php`

### Template:

```php
<?php
require_once __DIR__ . '/../../core/bootstrap.php';

use App\Services\AuthService;
use App\ResponseHandler;

ResponseHandler::ensureMethod('METHOD');

try {
    $input = ResponseHandler::getJsonInput();
    
    $service = new AuthService();
    $result = $service->methodName(...);
    
    ResponseHandler::success(['data' => $result->toArray()]);
} catch (\Exception $e) {
    ResponseHandler::error($e->getMessage(), STATUS);
}
```

### Exemple 1: `back/auth/login.php`

**AVANT:**
```php
<?php
require_once __DIR__ . '/../bootstrap.php';

$data = get_json_input();
$email = trim($data['email'] ?? '');
$mdp = (string)($data['mdp'] ?? '');

if ($email === '' || $mdp === '') {
    json_response(422, ['ok' => false, 'message' => 'Remplissez tous les champs.']);
}

$sql = 'SELECT ... FROM users WHERE email = :email';
$stmt = $pdo->prepare($sql);
$stmt->execute(['email' => $email]);
$user = $stmt->fetch();

if (!$user || !password_verify($mdp, $user['mdp'])) {
    json_response(401, ['ok' => false, 'message' => 'Identifiants invalides.']);
}

$_SESSION['user'] = [...];
json_response(200, ['ok' => true, 'user' => $_SESSION['user']]);
```

**APRÈS:**
```php
<?php
require_once __DIR__ . '/../../core/bootstrap.php';

use App\Services\AuthService;
use App\ResponseHandler;

ResponseHandler::ensureMethod('POST');

try {
    $input = ResponseHandler::getJsonInput();
    
    $service = new AuthService();
    $user = $service->login($input['email'], $input['mdp']);
    
    session_regenerate_id(true);
    $_SESSION['user'] = $user->toArray();
    
    ResponseHandler::success(['user' => $user->toArray()], 200);
} catch (\Exception $e) {
    ResponseHandler::error($e->getMessage(), 401);
}
```

### Exemple 2: `back/auth/register.php`

**AVANT:**
```php
<?php
require_once __DIR__ . '/../bootstrap.php';

$data = get_json_input();
$nom = trim($data['nom'] ?? '');
$prenom = trim($data['prenom'] ?? '');
$email = trim($data['email'] ?? '');
$mdp = (string)($data['mdp'] ?? '');

if ($nom === '' || $prenom === '' || $email === '' || $mdp === '') {
    json_response(422, ['ok' => false, 'message' => 'Remplissez tous les champs.']);
}

$sql = 'SELECT id_user FROM users WHERE email = :email';
$stmt = $pdo->prepare($sql);
$stmt->execute(['email' => $email]);

if ($stmt->rowCount() > 0) {
    json_response(409, ['ok' => false, 'message' => 'Email déclaré déjà.']);
}

$hashedPassword = password_hash($mdp, PASSWORD_BCRYPT);
$sql = 'INSERT INTO users (nom, prenom, email, mdp, role, filiere) VALUES (?, ?, ?, ?, 0, "")';
$stmt = $pdo->prepare($sql);
$stmt->execute([$nom, $prenom, $email, $hashedPassword]);

json_response(201, ['ok' => true, 'message' => 'Inscription réussie.']);
```

**APRÈS:**
```php
<?php
require_once __DIR__ . '/../../core/bootstrap.php';

use App\Services\AuthService;
use App\ResponseHandler;

ResponseHandler::ensureMethod('POST');

try {
    $input = ResponseHandler::getJsonInput();
    
    $service = new AuthService();
    $user = $service->register(
        $input['nom'],
        $input['prenom'],
        $input['email'],
        $input['mdp']
    );
    
    ResponseHandler::success(['user' => $user->toArray()], 201);
} catch (\Exception $e) {
    ResponseHandler::error($e->getMessage(), 400);
}
```

## Phase 3: Refactoriser Posts

### Fichiers:
- `back/posts/create.php`
- `back/posts/list.php` 
- `back/posts/delete.php`

### Template:

```php
<?php
require_once __DIR__ . '/../../core/bootstrap.php';

use App\Services\PostService;
use App\ResponseHandler;

ResponseHandler::ensureMethod('METHOD');

try {
    $input = ResponseHandler::getJsonInput();
    
    // Vérifier authentification
    if (empty($_SESSION['user'])) {
        ResponseHandler::error('Non authentifié', 401);
    }
    
    $service = new PostService();
    $result = $service->methodName(...);
    
    ResponseHandler::success(['post' => $result->toArray()]);
} catch (\Exception $e) {
    ResponseHandler::error($e->getMessage(), 400);
}
```

## Phase 4: Refactoriser Messages

```php
<?php
require_once __DIR__ . '/../../core/bootstrap.php';

use App\Services\MessageService;
use App\ResponseHandler;

ResponseHandler::ensureMethod('POST');

try {
    $input = ResponseHandler::getJsonInput();
    
    if (empty($_SESSION['user'])) {
        ResponseHandler::error('Non authentifié', 401);
    }
    
    $userId = $_SESSION['user']['id_user'];
    $service = new MessageService();
    $message = $service->sendMessage($userId, $input['destinataire_id'], $input['message_text']);
    
    ResponseHandler::success(['message' => $message->toArray()]);
} catch (\Exception $e) {
    ResponseHandler::error($e->getMessage(), 400);
}
```

## Phase 5: Refactoriser Frontend (Optionnel)

### Fichier `frontend/src/services/ApiClient.js` - CRÉÉ ✅

Utiliser:
```javascript
import ApiClient from '../services/ApiClient';

const api = new ApiClient('/api');

// Au lieu de :
// const response = await fetch('/api/posts/list.php', {...})

// Maintenant :
const response = await api.getPosts();
```

### Intégrer dans `HomePage.jsx`:

**AVANT:**
```jsx
async function loadPosts() {
    const response = await fetch(`${API_BASE}/posts/list.php`, {...});
    const data = await response.json();
    setPosts(data.posts);
}
```

**APRÈS:**
```jsx
import { apiClient } from '../services/useApi';

async function loadPosts() {
    const data = await apiClient.getPosts();
    setPosts(data.posts.map(p => new Post(p)));
}
```

## Checklist de Migration

### Phase 1: Setup ✅
- [x] Database.php créée
- [x] ResponseHandler.php créé
- [x] Modèles créés
- [x] Services créés
- [x] Bootstrap créé

### Phase 2: Auth
- [ ] login.php refactorisé
- [ ] register.php refactorisé
- [ ] me.php refactorisé
- [ ] logout.php refactorisé

### Phase 3: Posts
- [ ] create.php refactorisé
- [ ] list.php refactorisé
- [ ] delete.php refactorisé

### Phase 4: Messages
- [ ] send.php refactorisé
- [ ] thread.php refactorisé
- [ ] users.php refactorisé

### Phase 5: Misc
- [ ] profile/* refactorisés
- [ ] news/* refactorisés
- [ ] users/* refactorisés

### Phase 6: Frontend
- [ ] HomePage.jsx utilise ApiClient
- [ ] Autres pages utilisent ApiClient
- [ ] Modèles JS utilisés

## Erreurs Communes à Éviter

### ❌ Ne pas faire ceci:

```php
// ❌ MAUVAIS - Oublier le namespace
new AuthService();  // Erreur: classe non trouvée

// ❌ MAUVAIS - Accès direct à propriétés
$user->nom;  // Propriété privée!

// ❌ MAUVAIS - Pas de gestion d'erreurs
$service->login($email, $mdp);  // Peut throw

// ❌ MAUVAIS - Session directe
$_SESSION['user'] = $userData;  // Utiliser toArray()
```

### ✅ À la place:

```php
// ✅ BON - Utiliser use
use App\Services\AuthService;
$service = new AuthService();

// ✅ BON - Utiliser getters
$nom = $user->getNom();

// ✅ BON - Gérer les exceptions
try {
    $user = $service->login($email, $mdp);
} catch (\Exception $e) {
    ResponseHandler::error($e->getMessage());
}

// ✅ BON - Convertir en array
$_SESSION['user'] = $user->toArray();
```

## Support

- Consultez `back/POO_ARCHITECTURE.md` pour la documentation complète
- Consultez `back/api/auth/login-new.php` pour un exemple complet
- Consultez `back/api/posts/list-new.php` pour un autre exemple

## Résumé

Vous avez maintenant:
1. ✅ Structure POO complète
2. ✅ Services métier
3. ✅ Modèles encapsulés
4. ✅ Héritage fonctionnel
5. ✅ Gestion erreurs centralisée

Il reste à refactoriser les endpoints existants en utilisant ce nouveau système.
