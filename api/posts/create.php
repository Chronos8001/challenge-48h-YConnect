<?php
require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(405, ['ok' => false, 'message' => 'Methode non autorisee']);
}

if (!isset($_SESSION['user'])) {
    json_response(401, ['ok' => false, 'message' => 'Non connecte']);
}

$data = get_json_input();
$contenu = trim($data['contenu'] ?? '');
$imageUrl = trim($data['image_url'] ?? '');

if ($contenu === '') {
    json_response(422, ['ok' => false, 'message' => 'Le contenu du post est obligatoire.']);
}

$sql = 'INSERT INTO posts (id_auteur, contenu, image_url) VALUES (:id_auteur, :contenu, :image_url)';
$stmt = $pdo->prepare($sql);
$stmt->execute([
    'id_auteur' => (int) $_SESSION['user']['id_user'],
    'contenu' => $contenu,
    'image_url' => $imageUrl !== '' ? $imageUrl : null,
]);

json_response(201, ['ok' => true, 'message' => 'Post publie avec succes.']);
