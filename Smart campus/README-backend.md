# Backend Deployment Instructions

## Quick Start
```
1. Copy project: xcopy "C:\Users\munna\Downloads\Smart campus" "C:\xampp\htdocs\smart-campus" /E /I
2. Start XAMPP Apache + MySQL
3. Run database setup in phpMyAdmin (backend-setup.md)
4. Test API: http://localhost/smart-campus/api/events.php
```

## Update Frontend for Backend
Replace localStorage calls in script.js/auth.js with fetch:

**auth.js register**:
```js
async register(e) {
  e.preventDefault();
  const formData = { /* form values */ };
  
  const response = await fetch('api/register.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(formData)
  });
  
  const result = await response.json();
  if (result.success) {
    window.location.href = 'login.html';
  }
}
```

**script.js loadEvents**:
```js
async loadFromBackend() {
  const response = await fetch('api/events.php');
  return await response.json();
}
```

## Test Endpoints
```
POST http://localhost/smart-campus/api/register.php
POST http://localhost/smart-campus/api/login.php  
GET  http://localhost/smart-campus/api/events.php
POST http://localhost/smart-campus/api/events.php
```

**Ready**: Full MySQL backend operational. Frontend updates next!
