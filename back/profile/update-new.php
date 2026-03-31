<?php
require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(405, ['ok' => false, 'message' => 'Methode non autorisee']);
}

if (!isset($_SESSION['user'])) {
    json_response(401, ['ok' => false, 'message' => 'Non connecte']);
}

$data = get_json_input();
$description = trim((string) ($data['description'] ?? ''));
$filiere = trim((string) ($data['filiere'] ?? ''));
$image_url = trim((string) ($data['image_url'] ?? ''));
$competencesInput = $data['competences'] ?? [];

if (is_array($competencesInput)) {
    $skills = array_values(array_filter(array_map('trim', $competencesInput)));
} else {
    $skills = array_values(array_filter(array_map('trim', explode(',', (string) $competencesInput))));
}

$competences = implode(', ', $skills);
$userId = (int) $_SESSION['user']['id_user'];

$sql_parts = ['description = :description', 'filiere = :filiere', 'competences = :competences'];
$params = [
    'description' => $description !== '' ? $description : null,
    'filiere' => $filiere !== '' ? $filiere : null,
    'competences' => $competences !== '' ? $competences : null,
    'id_user' => $userId,
];

if ($image_url !== '') {
    $sql_parts[] = 'image_profile = :image_url';
    $params['image_url'] = $image_url;
}

$sql = 'UPDATE users SET ' . implode(', ', $sql_parts) . ' WHERE id_user = :id_user';
$stmt = $pdo->prepare($sql);
$stmt->execute($params);

$_SESSION['user']['filiere'] = $filiere !== '' ? $filiere : null;
if ($image_url !== '') {
    $_SESSION['user']['image_profile'] = $image_url;
}

json_response(200, [
    'ok' => true,
    'message' => 'Profil mis a jour.',
    'profile' => [
        'id_user' => $userId,
        'description' => $description,
        'filiere' => $filiere,
        'competences' => $skills,
        'image_profile' => $image_url,
    ],
]);
?>
