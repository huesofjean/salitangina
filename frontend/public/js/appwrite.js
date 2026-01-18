// appwrite.js
import { Client, Account, Databases, Storage, ID } from "https://cdn.jsdelivr.net/npm/appwrite@13.0.1/dist/appwrite.min.js";

// Initialize the client
const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
  .setProject("salitang-ina-01");              // Replace with your project ID

// Export objects for use in other scripts
export const auth = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID };
