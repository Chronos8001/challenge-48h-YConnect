<?php
require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(405, ['ok' => false, 'message' => 'Methode non autorisee']);
}

$data = get_json_input();

$nom = trim($data['nom'] ?? '');
$prenom = trim($data['prenom'] ?? '');
$email = trim($data['email'] ?? '');
$mdp = (string) ($data['mdp'] ?? '');
$filiere = trim($data['filiere'] ?? '');

$errors = [];

if ($nom === '' || $prenom === '' || $email === '' || $mdp === '') {
    $errors[] = 'Les champs nom, prenom, email et mot de passe sont obligatoires.';
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Adresse email invalide.';
}

if (strlen($mdp) < 8) {
    $errors[] = 'Le mot de passe doit contenir au moins 8 caracteres.';
}

if ($errors) {
    json_response(422, ['ok' => false, 'errors' => $errors]);
}

$sqlCheck = 'SELECT id_user FROM users WHERE email = :email LIMIT 1';
$stmtCheck = $pdo->prepare($sqlCheck);
$stmtCheck->execute(['email' => $email]);

if ($stmtCheck->fetch()) {
    json_response(409, ['ok' => false, 'message' => 'Cet email est deja utilise.']);
}

$hash = password_hash($mdp, PASSWORD_DEFAULT);
$sqlInsert = 'INSERT INTO users (nom, prenom, email, mdp, role, filiere) VALUES (:nom, :prenom, :email, :mdp, 0, :filiere)';
$stmtInsert = $pdo->prepare($sqlInsert);
$stmtInsert->execute([
    'nom' => $nom,
    'prenom' => $prenom,
    'email' => $email,
    'mdp' => $hash,
    'filiere' => $filiere !== '' ? $filiere : null,
]);

json_response(201, ['ok' => true, 'message' => 'Inscription reussie.']);
