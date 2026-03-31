<?php
require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(405, ['ok' => false, 'message' => 'Methode non autorisee']);
}

if (!isset($_SESSION['user'])) {
    json_response(401, ['ok' => false, 'message' => 'Non connecte']);
}

$sql = "SELECT
            p.id_post,
            p.id_auteur,
            p.contenu,
            p.image_url,
            p.date_publi,
            u.nom,
            u.prenom,
            u.image_profile
        FROM posts p
        INNER JOIN users u ON u.id_user = p.id_auteur
        ORDER BY p.date_publi DESC";

$stmt = $pdo->query($sql);
$posts = $stmt->fetchAll();

json_response(200, ['ok' => true, 'posts' => $posts]);
