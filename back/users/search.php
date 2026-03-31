<?php
require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(405, ['ok' => false, 'message' => 'Methode non autorisee']);
}

if (!isset($_SESSION['user'])) {
    json_response(401, ['ok' => false, 'message' => 'Non connecte']);
}

$currentUserId = (int) $_SESSION['user']['id_user'];
$query = trim((string) ($_GET['q'] ?? ''));

if ($query === '') {
    json_response(200, ['ok' => true, 'users' => []]);
}

$sql = "SELECT id_user, nom, prenom, email, filiere
        FROM users
        WHERE id_user != :currentUserId
          AND (
            nom LIKE :term
            OR prenom LIKE :term
            OR email LIKE :term
            OR filiere LIKE :term
          )
        ORDER BY nom ASC, prenom ASC
        LIMIT 20";

$stmt = $pdo->prepare($sql);
$stmt->execute([
    'currentUserId' => $currentUserId,
    'term' => '%' . $query . '%',
]);

$users = $stmt->fetchAll();
json_response(200, ['ok' => true, 'users' => $users]);
