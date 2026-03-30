<?php
session_start();
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json; charset=utf-8');

function json_response(int $statusCode, array $payload): void
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function get_json_input(): array
{
    $rawInput = file_get_contents('php://input');

    if ($rawInput === false || $rawInput === '') {
        return [];
    }

    $data = json_decode($rawInput, true);
    return is_array($data) ? $data : [];
}
