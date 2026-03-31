<?php
require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(405, ['ok' => false, 'message' => 'Methode non autorisee']);
}

if (!isset($_SESSION['user'])) {
    json_response(401, ['ok' => false, 'message' => 'Non connecte']);
}

$userId = (int) ($_SESSION['user']['id_user'] ?? 0);
if ($userId <= 0) {
    json_response(401, ['ok' => false, 'message' => 'Session invalide']);
}

$roleStmt = $pdo->prepare('SELECT role FROM users WHERE id_user = :id_user LIMIT 1');
$roleStmt->execute(['id_user' => $userId]);
$roleRow = $roleStmt->fetch();

if (!$roleRow || (int) ($roleRow['role'] ?? 0) !== 1) {
    json_response(403, ['ok' => false, 'message' => 'Acces reserve aux administrateurs']);
}

$data = get_json_input();
$titre = trim((string) ($data['titre'] ?? ''));
$description = trim((string) ($data['description'] ?? ''));
$typeEvent = trim((string) ($data['type_event'] ?? ''));
$dateEvent = trim((string) ($data['date_event'] ?? ''));

if ($titre === '' || $description === '' || $typeEvent === '' || $dateEvent === '') {
    json_response(422, ['ok' => false, 'message' => 'Tous les champs sont obligatoires']);
}

$dateObj = DateTime::createFromFormat('Y-m-d', $dateEvent);
if (!$dateObj || $dateObj->format('Y-m-d') !== $dateEvent) {
    json_response(422, ['ok' => false, 'message' => 'Format de date invalide']);
}

$sql = 'INSERT INTO ynov_news (titre, description, type_event, date_event) VALUES (:titre, :description, :type_event, :date_event)';
$stmt = $pdo->prepare($sql);
$stmt->execute([
    'titre' => $titre,
    'description' => $description,
    'type_event' => $typeEvent,
    'date_event' => $dateEvent,
]);

json_response(201, [
    'ok' => true,
    'message' => 'News creee avec succes',
    'news' => [
        'id_news' => (int) $pdo->lastInsertId(),
        'titre' => $titre,
        'description' => $description,
        'type_event' => $typeEvent,
        'date_event' => $dateEvent,
    ],
]);
