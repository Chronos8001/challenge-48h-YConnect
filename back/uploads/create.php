<?php
session_start();

if (!isset($_SESSION['user'])) {
  http_response_code(401);
  echo json_encode(['ok' => false, 'message' => 'Unauthorized']);
  exit;
}

if (!isset($_FILES['image'])) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'message' => 'No image provided']);
  exit;
}

$file = $_FILES['image'];
$allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

if (!in_array($file['type'], $allowed_types)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'message' => 'Invalid image type']);
  exit;
}

if ($file['size'] > 5 * 1024 * 1024) { // 5MB max
  http_response_code(400);
  echo json_encode(['ok' => false, 'message' => 'Image too large (max 5MB)']);
  exit;
}

$upload_dir = __DIR__;
if (!is_dir($upload_dir)) {
  mkdir($upload_dir, 0755, true);
}

$file_ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = 'post_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $file_ext;
$filepath = $upload_dir . '/' . $filename;

if (!move_uploaded_file($file['tmp_name'], $filepath)) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'message' => 'Failed to save image']);
  exit;
}

$image_url = '/api/uploads/image.php?file=' . urlencode($filename);

http_response_code(200);
echo json_encode(['ok' => true, 'image_url' => $image_url]);
?>
