<?php
require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(405, ['ok' => false, 'message' => 'Methode non autorisee']);
}

if (!isset($_SESSION['user'])) {
    json_response(401, ['ok' => false, 'message' => 'Non connecte']);
}

$currentUserId = (int) $_SESSION['user']['id_user'];

$sql = "SELECT
            u.id_user,
            u.nom,
            u.prenom,
            u.email,
            u.filiere,
            (
                SELECT m.message_text
                FROM messages m
                WHERE
                    (m.id_expediteur = u.id_user AND m.id_destinataire = :currentUserId)
                    OR
                    (m.id_expediteur = :currentUserId AND m.id_destinataire = u.id_user)
                ORDER BY m.date_envoi DESC
                LIMIT 1
            ) AS last_message,
            (
                SELECT m.date_envoi
                FROM messages m
                WHERE
                    (m.id_expediteur = u.id_user AND m.id_destinataire = :currentUserId)
                    OR
                    (m.id_expediteur = :currentUserId AND m.id_destinataire = u.id_user)
                ORDER BY m.date_envoi DESC
                LIMIT 1
            ) AS last_message_date,
            (
                SELECT COUNT(*)
                FROM messages m
                WHERE m.id_expediteur = u.id_user
                  AND m.id_destinataire = :currentUserId
                  AND m.statut_lu = 0
            ) AS unread_count
        FROM users u
        WHERE u.id_user != :currentUserId
        ORDER BY last_message_date DESC, u.nom ASC, u.prenom ASC";

$stmt = $pdo->prepare($sql);
$stmt->execute(['currentUserId' => $currentUserId]);
$users = $stmt->fetchAll();

json_response(200, ['ok' => true, 'users' => $users]);
