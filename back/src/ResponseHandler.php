<?php

namespace App;

/**
 * Classe ResponseHandler - Gestion des réponses JSON
 * Encapsule la logique de formatage des réponses
 */
class ResponseHandler
{
    /**
     * Envoie une réponse de succès
     */
    public static function success(array $data = [], int $statusCode = 200): void
    {
        http_response_code($statusCode);
        echo json_encode([
            'ok' => true,
            ...$data,
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    /**
     * Envoie une réponse d'erreur
     */
    public static function error(string $message, int $statusCode = 400, array $extra = []): void
    {
        http_response_code($statusCode);
        echo json_encode([
            'ok' => false,
            'message' => $message,
            ...$extra,
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    /**
     * Valide la méthode HTTP
     */
    public static function ensureMethod(string $method): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== $method) {
            self::error("Méthode non autorisée: {$_SERVER['REQUEST_METHOD']}", 405);
        }
    }

    /**
     * Récupère l'input JSON
     */
    public static function getJsonInput(): array
    {
        $rawInput = file_get_contents('php://input');
        if ($rawInput === false || $rawInput === '') {
            return [];
        }
        $data = json_decode($rawInput, true);
        return is_array($data) ? $data : [];
    }
}
