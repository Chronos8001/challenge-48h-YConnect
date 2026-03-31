<?php
require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(405, ['ok' => false, 'message' => 'Methode non autorisee']);
}

if (!isset($_SESSION['user'])) {
    json_response(401, ['ok' => false, 'message' => 'Non connecte']);
}

$currentUserId = (int) $_SESSION['user']['id_user'];
$otherUserId = (int) ($_GET['user_id'] ?? 0);

if ($otherUserId <= 0 || $otherUserId === $currentUserId) {
    json_response(422, ['ok' => false, 'message' => 'Destinataire invalide']);
}

$check = $pdo->prepare('SELECT id_user FROM users WHERE id_user = :id_user LIMIT 1');
$check->execute(['id_user' => $otherUserId]);
if (!$check->fetch()) {
    json_response(404, ['ok' => false, 'message' => 'Utilisateur introuvable']);
}

$sql = "SELECT
            id_message,
            id_expediteur,
            id_destinataire,
            message_text,
            date_envoi,
            statut_lu
        FROM messages
        WHERE
            (id_expediteur = :currentUserId AND id_destinataire = :otherUserId)
            OR
            (id_expediteur = :otherUserId AND id_destinataire = :currentUserId)
        ORDER BY date_envoi ASC, id_message ASC
        LIMIT 300";

$stmt = $pdo->prepare($sql);
$stmt->execute([
    'currentUserId' => $currentUserId,
    'otherUserId' => $otherUserId,
]);
$messages = $stmt->fetchAll();

$markRead = $pdo->prepare('UPDATE messages SET statut_lu = 1 WHERE id_expediteur = :otherUserId AND id_destinataire = :currentUserId AND statut_lu = 0');
$markRead->execute([
    'otherUserId' => $otherUserId,
    'currentUserId' => $currentUserId,
]);

json_response(200, ['ok' => true, 'messages' => $messages]);
