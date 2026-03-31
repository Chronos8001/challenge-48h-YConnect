<?php

// Exemple de l'ancien endpoint refactorisé
// Ancien: back/auth/login.php
// Nouveau: back/api/auth/login.php

require_once __DIR__ . '/../../core/bootstrap.php';

use App\Services\AuthService;
use App\ResponseHandler;

ResponseHandler::ensureMethod('POST');

try {
    $data = ResponseHandler::getJsonInput();
    $email = trim($data['email'] ?? '');
    $mdp = (string)($data['mdp'] ?? '');

    if ($email === '' || $mdp === '') {
        ResponseHandler::error('Veuillez renseigner email et mot de passe.', 422);
    }

    // Utilise le service au lieu de faire les requêtes directement
    $authService = new AuthService();
    $user = $authService->login($email, $mdp);

    // Crée la session
    session_regenerate_id(true);
    $_SESSION['user'] = $user->toArray();

    ResponseHandler::success(['user' => $user->toArray()], 200);

} catch (\Exception $e) {
    ResponseHandler::error($e->getMessage(), 401);
}
