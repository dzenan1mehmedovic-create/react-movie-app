import { Client, Account, ID } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const account = new Account(client);

export const registerUser = async (email, password, name) => {
  try {
    return await account.create(ID.unique(), email, password, name);
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    return await account.createEmailPasswordSession(email, password);
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await account.deleteSession("current");
    window.location.href = "/";
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch {
    return null;
  }
};
