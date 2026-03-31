<?php

// Exemple: back/api/posts/list-new.php
// Utilise la classe PostService

require_once __DIR__ . '/../../core/bootstrap.php';

use App\Services\PostService;
use App\ResponseHandler;

ResponseHandler::ensureMethod('GET');

try {
    $postService = new PostService();
    $posts = $postService->getAllPosts();

    // Convertit les objets Post en tableaux
    $postsData = array_map(fn($post) => $post->toArray(), $posts);

    ResponseHandler::success(['posts' => $postsData], 200);

} catch (\Exception $e) {
    ResponseHandler::error($e->getMessage(), 500);
}
