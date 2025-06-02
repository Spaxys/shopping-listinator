const fs = require('fs');
const path = require('path');

const isEasBuild = process.env.EAS_BUILD === 'true';
const googleServicesPath = path.join(process.cwd(), 'google-services.json');

if (isEasBuild) {
  if (!process.env.GOOGLE_SERVICES_JSON) {
    console.error('❌ GOOGLE_SERVICES_JSON environment variable is not set');
    process.exit(1);
  }

  try {
    // Verify it's valid JSON before writing
    const content = process.env.GOOGLE_SERVICES_JSON;
    JSON.parse(content); // This will throw if content isn't valid JSON
    
    fs.writeFileSync(googleServicesPath, content);
    console.log('✅ Created google-services.json from environment variable');
    
    // Verify file was written correctly
    const writtenContent = fs.readFileSync(googleServicesPath, 'utf8');
    JSON.parse(writtenContent); // Verify written content is valid JSON
    console.log('✅ Verified written file is valid JSON');
  } catch (error) {
    console.error('❌ Failed to create or verify google-services.json:', error);
    process.exit(1);
  }
}