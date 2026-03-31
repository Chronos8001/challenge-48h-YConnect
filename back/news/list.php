<?php
require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(405, ['ok' => false, 'message' => 'Methode non autorisee']);
}

if (!isset($_SESSION['user'])) {
    json_response(401, ['ok' => false, 'message' => 'Non connecte']);
}

$count = (int) $pdo->query('SELECT COUNT(*) AS c FROM ynov_news')->fetch()['c'];

if ($count === 0) {
    $seed = [
        ['Challenge 48h: lancement des equipes', 'Le challenge demarre ce vendredi a 18h au campus. Formez votre equipe.', 'Challenge', date('Y-m-d', strtotime('+5 days'))],
        ['Tournoi BDS multisport', 'Le BDS organise un tournoi de futsal et basket le mois prochain.', 'BDS', date('Y-m-d', strtotime('+12 days'))],
        ['Afterwork BDE', 'Le BDE vous donne rendez-vous jeudi soir pour un afterwork networking.', 'BDE', date('Y-m-d', strtotime('+8 days'))],
    ];

    $insert = $pdo->prepare('INSERT INTO ynov_news (titre, description, type_event, date_event) VALUES (:titre, :description, :type_event, :date_event)');
    foreach ($seed as $row) {
        $insert->execute([
            'titre' => $row[0],
            'description' => $row[1],
            'type_event' => $row[2],
            'date_event' => $row[3],
        ]);
    }
}

$sql = 'SELECT id_news, titre, description, type_event, date_event FROM ynov_news ORDER BY date_event ASC, id_news DESC LIMIT 8';
$stmt = $pdo->query($sql);
$news = $stmt->fetchAll();

json_response(200, ['ok' => true, 'news' => $news]);
