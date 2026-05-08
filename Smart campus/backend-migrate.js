// Migrate localStorage data to MySQL
// Run once after backend setup

async function migrateData() {
  // Get local users
  const users = JSON.parse(localStorage.getItem('campusUsers') || '[]');
  
  for (let user of users) {
    await fetch('api/register.php', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(user)
    });
  }
  
  // Get local events  
  const events = JSON.parse(localStorage.getItem('campusEvents') || '[]');
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  for (let event of events) {
    await fetch('api/events.php', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({...event, createdBy: currentUser.id})
    });
  }
  
  console.log('Migration complete!');
}

// Uncomment to run
// migrateData();

