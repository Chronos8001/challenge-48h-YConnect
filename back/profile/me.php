<?php
require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(405, ['ok' => false, 'message' => 'Methode non autorisee']);
}

if (!isset($_SESSION['user'])) {
    json_response(401, ['ok' => false, 'message' => 'Non connecte']);
}

$userId = (int) $_SESSION['user']['id_user'];
$sql = 'SELECT id_user, nom, prenom, email, filiere, description, competences FROM users WHERE id_user = :id_user LIMIT 1';
$stmt = $pdo->prepare($sql);
$stmt->execute(['id_user' => $userId]);
$user = $stmt->fetch();

if (!$user) {
    json_response(404, ['ok' => false, 'message' => 'Utilisateur introuvable']);
}

$skills = array_values(array_filter(array_map('trim', explode(',', (string) ($user['competences'] ?? '')))));
$user['competences'] = $skills;

json_response(200, ['ok' => true, 'profile' => $user]);
