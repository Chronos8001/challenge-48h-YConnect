<?php
$filename = basename($_GET['file'] ?? '');

if (empty($filename) || preg_match('/\.\./', $filename)) {
  http_response_code(400);
  exit;
}

$filepath = __DIR__ . '/' . $filename;

if (!file_exists($filepath)) {
  http_response_code(404);
  exit;
}

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $filepath);
finfo_close($finfo);

header('Content-Type: ' . $mime);
header('Content-Length: ' . filesize($filepath));
readfile($filepath);
?>
