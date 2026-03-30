<?php
require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(405, ['ok' => false, 'message' => 'Methode non autorisee']);
}

if (!isset($_SESSION['user'])) {
    json_response(401, ['ok' => false, 'message' => 'Non connecte']);
}

json_response(200, ['ok' => true, 'user' => $_SESSION['user']]);
