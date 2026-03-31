<?php
require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(405, ['ok' => false, 'message' => 'Methode non autorisee']);
}

if (!isset($_SESSION['user'])) {
    json_response(401, ['ok' => false, 'message' => 'Non connecte']);
}

$currentUserId = (int) $_SESSION['user']['id_user'];
$data = get_json_input();
$destinataireId = (int) ($data['destinataire_id'] ?? 0);
$messageText = trim((string) ($data['message_text'] ?? ''));

if ($destinataireId <= 0 || $destinataireId === $currentUserId) {
    json_response(422, ['ok' => false, 'message' => 'Destinataire invalide']);
}

if ($messageText === '') {
    json_response(422, ['ok' => false, 'message' => 'Le message est vide']);
}

$check = $pdo->prepare('SELECT id_user FROM users WHERE id_user = :id_user LIMIT 1');
$check->execute(['id_user' => $destinataireId]);
if (!$check->fetch()) {
    json_response(404, ['ok' => false, 'message' => 'Destinataire introuvable']);
}

$sql = 'INSERT INTO messages (id_expediteur, id_destinataire, message_text) VALUES (:id_expediteur, :id_destinataire, :message_text)';
$stmt = $pdo->prepare($sql);
$stmt->execute([
    'id_expediteur' => $currentUserId,
    'id_destinataire' => $destinataireId,
    'message_text' => $messageText,
]);

json_response(201, [
    'ok' => true,
    'message' => 'Message envoye',
    'message_item' => [
        'id_message' => (int) $pdo->lastInsertId(),
        'id_expediteur' => $currentUserId,
        'id_destinataire' => $destinataireId,
        'message_text' => $messageText,
    ],
]);
