# Architecture POO - YConnect

## Overview

Votre code a été refactorisé pour respecter les principes de Programmation Orientée Objet (POO). Voici la structure:

## Architecture

### 1. **Classes de Base**

#### `Database.php` (Singleton Pattern)
- **Encapsulation**: Connexion PDO privée et centralisée
- **Héritage**: Classe de base pour tous les services
- **Pattern**: Singleton - une seule instance en mémoire

```php
$db = Database::getInstance();
$db->fetchOne($sql, $params);
$db->fetchAll($sql, $params);
$db->execute($sql, $params);
```

### 2. **Classes Modèles** (Encapsulation)

#### `Models/User.php`
- Propriétés privées avec getters/setters publics
- Méthodes utiles: `isAdmin()`, `getFullName()`, `toArray()`

```php
$user = new User($data);
echo $user->getFullName();  // Accès via getter
$user->setFiliere('Informatique')->setDescription('...');  // Chainable
```

#### `Models/Post.php`, `Models/Message.php`
- Même pattern d'encapsulation
- Conversion vers tableaux: `toArray()`

### 3. **Classes de Services** (Héritage et Business Logic)

#### `BaseService` (Classe abstraite)
- **Héritage**: Classe parente pour tous les services
- Méthodes communes: validation, sanitization, accès à la DB

```php
abstract class BaseService {
    protected Database $db;
    protected function validate(array $data, array $required): array
    protected function sanitize(string $str): string
}
```

#### Services spécialisés (héritent de BaseService)

**`AuthService`**
```php
$auth = new AuthService();
$user = $auth->login($email, $password);
$user = $auth->register($nom, $prenom, $email, $mdp);
$users = $auth->searchUsers($query);
```

**`PostService`**
```php
$posts = new PostService();
$post = $posts->create($userId, $content, $imageUrl);
$allPosts = $posts->getAllPosts();
$posts->deletePost($postId, $userId);
$posts->toggleLike($postId, $userId, 'like');
```

**`MessageService`**
```php
$messages = new MessageService();
$msg = $messages->sendMessage($senderId, $recipientId, $text);
$thread = $messages->getThread($userId1, $userId2);
$contacts = $messages->getContacts($userId);
```

**`ProfileService`**
```php
$profile = new ProfileService();
$user = $profile->updateProfile($userId, ['description' => '...', 'filiere' => '...']);
$user = $profile->getUserProfile($userId);
```

**`NewsService`**
```php
$news = new NewsService();
$news = $news->create($titre, $desc, $type, $date, $userId);
$allNews = $news->getAllNews();
```

### 4. **Utils**

#### `ResponseHandler.php`
- Encapsule la logique de réponse JSON
- Méthodes statiques rapides

```php
ResponseHandler::success(['data' => $data], 200);
ResponseHandler::error('Erreur', 400);
ResponseHandler::ensureMethod('POST');
```

## Principes POO Respectés

✅ **Encapsulation**
- Propriétés privées dans les modèles
- Accès via getters/setters publics
- Logique métier isolée dans les services

✅ **Héritage**
- BaseService est la classe parente
- Tous les services héritent de BaseService
- Réutilisation du code de validation et sanitization

✅ **Polymorphisme**
- Chaque service peut implémenter sa propre logique
- Méthode `toArray()` sur tous les modèles
- Interface commune via BaseService

✅ **Abstraction**
- BaseService est abstraite
- Services cachent les détails d'implémentation
- Controllers utilisant les services n'ont pas besoin de connaître la DB

## Migration des Endpoints

### Ancien Style (Procédural)
```php
// back/auth/login.php
$user = $stmt->fetch();
$_SESSION['user'] = [...];
json_response(200, ['ok' => true, 'user' => $_SESSION['user']]);
```

### Nouveau Style (POO)
```php
// back/api/auth/login-new.php
$authService = new AuthService();
$user = $authService->login($email, $mdp);
$_SESSION['user'] = $user->toArray();
ResponseHandler::success(['user' => $user->toArray()], 200);
```

## Comment Refactoriser Vos Endpoints

1. **Importer le bootstrap**
   ```php
   require_once __DIR__ . '/../../core/bootstrap.php';
   use App\Services\NomService;
   use App\ResponseHandler;
   ```

2. **Instancier le service**
   ```php
   $service = new NomService();
   ```

3. **Utiliser les méthodes du service**
   ```php
   $result = $service->methodName($params);
   ```

4. **Répondre avec ResponseHandler**
   ```php
   ResponseHandler::success(['data' => $result->toArray()]);
   ResponseHandler::error('Message d\'erreur', 400);
   ```

## Avantages

✅ Code plus maintenable et testable
✅ Séparation des responsabilités
✅ Réutilisabilité du code
✅ Plus facile d'ajouter de nouvelles fonctionnalités
✅ Gestion d'erreurs cohérente
✅ Respect des critères POO du projet

## Frontend

Le frontend React est déjà structuré avec des composants réutilisables (App.jsx, HomePage.jsx, etc.), ce qui respecte les principes de POO en JavaScript/React.

Vous pouvez aussi créer une classe `ApiClient` pour abstraire les appels API.
