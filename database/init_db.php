<?php
require_once __DIR__ . '/../config/database.php';

$queries = [
    "CREATE TABLE IF NOT EXISTS users (
        id_user int(11) NOT NULL AUTO_INCREMENT,
        nom varchar(50) NOT NULL,
        prenom varchar(50) NOT NULL,
        email varchar(100) NOT NULL UNIQUE,
        mdp varchar(255) NOT NULL,
        role tinyint(1) DEFAULT 0,
        filiere varchar(100) DEFAULT NULL,
        image_profile varchar(255) DEFAULT 'default.png',
        description text DEFAULT NULL,
        competences text DEFAULT NULL,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id_user)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

    "CREATE TABLE IF NOT EXISTS posts (
        id_post int(11) NOT NULL AUTO_INCREMENT,
        id_auteur int(11) NOT NULL,
        contenu text NOT NULL,
        image_url varchar(255) DEFAULT NULL,
        date_publi timestamp DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id_post),
        FOREIGN KEY (id_auteur) REFERENCES users(id_user) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

    "CREATE TABLE IF NOT EXISTS messages (
        id_message int(11) NOT NULL AUTO_INCREMENT,
        id_expediteur int(11) NOT NULL,
        id_destinataire int(11) NOT NULL,
        message_text text NOT NULL,
        image_msg varchar(255) DEFAULT NULL,
        date_envoi timestamp DEFAULT CURRENT_TIMESTAMP,
        statut_lu tinyint(1) DEFAULT 0,
        PRIMARY KEY (id_message),
        FOREIGN KEY (id_expediteur) REFERENCES users(id_user) ON DELETE CASCADE,
        FOREIGN KEY (id_destinataire) REFERENCES users(id_user) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

    "CREATE TABLE IF NOT EXISTS ynov_news (
        id_news int(11) NOT NULL AUTO_INCREMENT,
        titre varchar(150) NOT NULL,
        description text NOT NULL,
        type_event enum('Challenge','BDS','BDE','Autre') DEFAULT 'Autre',
        date_event date DEFAULT NULL,
        PRIMARY KEY (id_news)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
];

try {
    foreach ($queries as $query) {
        $pdo->exec($query);
    }

    echo 'Tables initialisees avec succes.';
} catch (PDOException $e) {
    die('Erreur lors de la creation des tables : ' . $e->getMessage());
}
