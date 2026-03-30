<?php
$host = 'localhost';
$dbname = 'yconnect'; 
$username = 'root';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username);
    
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Connexion réussie !"; 
} catch (PDOException $e) {
    die("Erreur de connexion : " . $e->getMessage());
}
?>