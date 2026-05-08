<?php
include 'config.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['email'], $input['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Email and password required']);
    exit;
}

$stmt = $pdo->prepare('SELECT id, firstName, lastName, email, studentId, password FROM users WHERE email = ?');
$stmt->execute([$input['email']]);
$user = $stmt->fetch();

if ($user && password_verify($input['password'], $user['password'])) {
    unset($user['password']);
    echo json_encode(['success' => true, 'user' => $user]);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid credentials']);
}
?>

