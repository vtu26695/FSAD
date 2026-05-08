<?php
include 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
header('Content-Type: application/json');

switch ($method) {
    case 'GET':
        // Get all events
        $stmt = $pdo->query('SELECT * FROM events ORDER BY date, time ASC');
        $events = $stmt->fetchAll();
        echo json_encode($events);
        break;
        
    case 'POST':
        // Create event
        $input = json_decode(file_get_contents('php://input'), true);
        $userId = $input['createdBy'];
        
        $stmt = $pdo->prepare('INSERT INTO events (title, date, time, location, category, description, capacity, organizer, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $input['title'], $input['date'], $input['time'], $input['location'],
            $input['category'], $input['description'], $input['capacity'],
            $input['organizer'], $userId
        ]);
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        break;
        
    case 'PUT':
        // Update event
        $input = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare('UPDATE events SET title=?, date=?, time=?, location=?, category=?, description=?, capacity=?, organizer=? WHERE id=? AND createdBy=?');
        $stmt->execute([
            $input['title'], $input['date'], $input['time'], $input['location'],
            $input['category'], $input['description'], $input['capacity'],
            $input['organizer'], $input['id'], $input['createdBy']
        ]);
        echo json_encode(['success' => true]);
        break;
        
    case 'DELETE':
        // Delete event
        parse_str(file_get_contents('php://input'), $input);
        $id = $input['id'];
        $userId = $input['createdBy'];
        
        $stmt = $pdo->prepare('DELETE FROM events WHERE id=? AND createdBy=?');
        $stmt->execute([$id, $userId]);
        echo json_encode(['success' => true]);
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}
?>

