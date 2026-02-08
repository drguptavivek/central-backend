const { withDefaults } = require('../lib/model/container');
const { slonikPool } = require('../lib/external/slonik');
const config = require('config');

// Connect to DB
const db = slonikPool(config.get('test.database'));

const run = async () => {
  try {
    const container = withDefaults({ db });
    console.log('Container created.');

    const { Users, VgWebUserTotp } = container;
    
    // Check if VgWebUserTotp exists
    if (!VgWebUserTotp) {
      console.error('ERROR: VgWebUserTotp is missing from container!');
      process.exit(1);
    }
    console.log('VgWebUserTotp found in container.');

    // Find Alice
    const alice = await Users.getByEmail('alice@getodk.org');
    if (alice.isEmpty()) {
      console.error('ERROR: Alice not found.');
      process.exit(1);
    }
    const actorId = alice.get().actor.id;
    console.log(`Alice found. Actor ID: ${actorId}`);

    // Try to setup TOTP (Domain Logic)
    console.log('Attempting setupTotp...');
    const { setupTotp } = require('../lib/domain/vg-web-user-totp');
    
    // Mock container with Audits (since setupTotp logs audit)
    // Real Audits requires more setup, so we might fail on audit logging if not careful.
    // But let's try with the real container first.
    
    try {
      const result = await setupTotp(container, actorId, 'alice@getodk.org');
      console.log('Success!', result);
    } catch (err) {
      console.error('setupTotp failed:', err);
    }

  } catch (err) {
    console.error('Global error:', err);
  } finally {
    await db.end();
  }
};

run();
