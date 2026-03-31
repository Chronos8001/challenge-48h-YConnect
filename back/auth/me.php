<?php
require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(405, ['ok' => false, 'message' => 'Methode non autorisee']);
}

if (!isset($_SESSION['user'])) {
    json_response(401, ['ok' => false, 'message' => 'Non connecte']);
}

$userId = (int) ($_SESSION['user']['id_user'] ?? 0);
if ($userId <= 0) {
    json_response(401, ['ok' => false, 'message' => 'Session invalide']);
}

$sql = 'SELECT id_user, nom, prenom, email, role, filiere, image_profile FROM users WHERE id_user = :id_user LIMIT 1';
$stmt = $pdo->prepare($sql);
$stmt->execute(['id_user' => $userId]);
$user = $stmt->fetch();

if (!$user) {
    session_unset();
    session_destroy();
    json_response(401, ['ok' => false, 'message' => 'Utilisateur introuvable']);
}

$_SESSION['user'] = [
    'id_user' => (int) $user['id_user'],
    'nom' => $user['nom'],
    'prenom' => $user['prenom'],
    'email' => $user['email'],
    'role' => (int) $user['role'],
    'filiere' => $user['filiere'],
    'image_profile' => $user['image_profile'],
];

json_response(200, ['ok' => true, 'user' => $_SESSION['user']]);
