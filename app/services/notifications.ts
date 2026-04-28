// services/notifications.ts
const BASE_URL = "http://10.49.201.2:3000";
export const notifyFriends = async (friendIds: string[], message: string) => {
  await fetch("${BASE_URL}/notify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ friendIds, message }),
  });
};

export const registerPushToken = async (userId: string, token: string) => {
  await fetch("${BASE_URL}/register-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, token }),
  });
};
