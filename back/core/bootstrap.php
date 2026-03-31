<?php

// Autoloader simple pour les classes
spl_autoload_register(function ($class) {
    $prefix = 'App\\';
    $baseDir = __DIR__ . '/src/';

    // Vérifie si la classe utilise le namespace App
    if (strpos($class, $prefix) !== 0) {
        return;
    }

    // Récupère le chemin relatif du namespace
    $relativePath = substr($class, strlen($prefix));
    $filePath = $baseDir . str_replace('\\', '/', $relativePath) . '.php';

    if (file_exists($filePath)) {
        require_once $filePath;
    }
});

// Configuration
session_start();
header('Content-Type: application/json; charset=utf-8');

// Initialise la connexion à la base de données
require_once __DIR__ . '/../config/database.php';

// Classe Database utilise des variables d'environnement qui doivent être définies
// Ou se connecte avec les paramètres du fichier config/database.php existant
