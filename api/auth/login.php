<?php
require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(405, ['ok' => false, 'message' => 'Methode non autorisee']);
}

$data = get_json_input();
$email = trim($data['email'] ?? '');
$mdp = (string) ($data['mdp'] ?? '');

if ($email === '' || $mdp === '') {
    json_response(422, ['ok' => false, 'message' => 'Veuillez renseigner email et mot de passe.']);
}

$sql = 'SELECT id_user, nom, prenom, email, mdp, role, filiere FROM users WHERE email = :email LIMIT 1';
$stmt = $pdo->prepare($sql);
$stmt->execute(['email' => $email]);
$user = $stmt->fetch();

if (!$user || !password_verify($mdp, $user['mdp'])) {
    json_response(401, ['ok' => false, 'message' => 'Identifiants invalides.']);
}

session_regenerate_id(true);
$_SESSION['user'] = [
    'id_user' => (int) $user['id_user'],
    'nom' => $user['nom'],
    'prenom' => $user['prenom'],
    'email' => $user['email'],
    'role' => (int) $user['role'],
    'filiere' => $user['filiere'],
];

json_response(200, ['ok' => true, 'user' => $_SESSION['user']]);
