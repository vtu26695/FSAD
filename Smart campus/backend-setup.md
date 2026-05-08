# Backend Setup - XAMPP + MySQL + PHP API

## 1. Copy Project to XAMPP
```
cd "C:\Users\munna\Downloads\Smart campus"
xcopy * "C:\xampp\htdocs\smart-campus" /E /I
```

## 2. Create MySQL Database
1. Start XAMPP → Apache + MySQL
2. Open http://localhost/phpmyadmin
3. Run SQL:

```sql
CREATE DATABASE smart_campus;
USE smart_campus;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  firstName VARCHAR(50),
  lastName VARCHAR(50),
  email VARCHAR(100) UNIQUE,
  studentId VARCHAR(20),
  password VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200),
  date DATE,
  time TIME,
  location VARCHAR(200),
  category ENUM('academic','sports','cultural','social'),
  description TEXT,
  capacity INT DEFAULT 100,
  organizer VARCHAR(100),
  registrations INT DEFAULT 0,
  createdBy INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (createdBy) REFERENCES users(id)
);
```

## 3. Test Backend
```
http://localhost/smart-campus/
```

Ready for PHP API creation!
