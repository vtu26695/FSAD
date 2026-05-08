<?php
include 'config.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['firstName'], $input['lastName'], $input['email'], $input['studentId'], $input['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

$hashedPassword = password_hash($input['password'], PASSWORD_DEFAULT);

try {
    $stmt = $pdo->prepare('INSERT INTO users (firstName, lastName, email, studentId, password) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$input['firstName'], $input['lastName'], $input['email'], $input['studentId'], $hashedPassword]);
    echo json_encode(['success' => true, 'userId' => $pdo->lastInsertId()]);
} catch (PDOException $e) {
    http_response_code(400);
    echo json_encode(['error' => 'Email already exists']);
}
?>

