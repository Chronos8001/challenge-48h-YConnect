<?php
require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(405, ['ok' => false, 'message' => 'Methode non autorisee']);
}

if (!isset($_SESSION['user'])) {
    json_response(401, ['ok' => false, 'message' => 'Non connecte']);
}

$data = get_json_input();
$postId = (int) ($data['id_post'] ?? 0);

if ($postId <= 0) {
    json_response(422, ['ok' => false, 'message' => 'Post invalide']);
}

$sqlSelect = 'SELECT id_post, id_auteur FROM posts WHERE id_post = :id_post LIMIT 1';
$stmtSelect = $pdo->prepare($sqlSelect);
$stmtSelect->execute(['id_post' => $postId]);
$post = $stmtSelect->fetch();

if (!$post) {
    json_response(404, ['ok' => false, 'message' => 'Post introuvable']);
}

if ((int) $post['id_auteur'] !== (int) $_SESSION['user']['id_user']) {
    json_response(403, ['ok' => false, 'message' => 'Vous ne pouvez supprimer que vos propres posts']);
}

$sqlDelete = 'DELETE FROM posts WHERE id_post = :id_post';
$stmtDelete = $pdo->prepare($sqlDelete);
$stmtDelete->execute(['id_post' => $postId]);

json_response(200, ['ok' => true, 'message' => 'Post supprime']);
