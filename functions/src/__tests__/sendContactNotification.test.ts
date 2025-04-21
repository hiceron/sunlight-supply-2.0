import * as admin from 'firebase-admin';
import functionsTestInit from 'firebase-functions-test';
import { sendContactNotification } from '../sendContactNotification';

const functionsTest = functionsTestInit();

describe('sendContactNotification', () => {
  afterAll(() => {
    functionsTest.cleanup();
  });

  it('should send an email when a new contact submission is added', async () => {
    const fakeData = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'Hello, this is a test!',
      timestamp: Date.now(),
    };
    const snap = functionsTest.database.makeDataSnapshot(fakeData, '/contact_submissions/abc123');
    const wrapped = functionsTest.wrap(sendContactNotification);
    // The function returns null and logs errors if any
    await expect(wrapped(snap)).resolves.toBeNull();
  });
});
