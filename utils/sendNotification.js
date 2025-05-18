// utils/sendNotification.js

async function sendNotification(notification) {
  // Simulate network delay and success/failure randomly
  return new Promise((resolve) => {
    setTimeout(() => {
      // 80% chance to succeed
      const success = Math.random() < 0.8;
      resolve(success);
    }, 1000); // Simulate 1-second sending delay
  });
}

module.exports = sendNotification;
