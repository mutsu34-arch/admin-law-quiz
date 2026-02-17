import { initializeApp, getApps, cert, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import { join } from "path";

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];
  // 방법 1: JSON 파일 경로 (추천 - 더 쉬움)
  const filePath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (filePath) {
    try {
      const fullPath = join(process.cwd(), filePath);
      const json = JSON.parse(readFileSync(fullPath, "utf-8")) as ServiceAccount;
      return initializeApp({ credential: cert(json) });
    } catch {
      return null;
    }
  }
  // 방법 2: .env에 JSON 문자열
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccount || serviceAccount.includes("your-project-id")) return null;
  try {
    const parsed = JSON.parse(serviceAccount) as ServiceAccount;
    return initializeApp({ credential: cert(parsed) });
  } catch {
    return null;
  }
}

const app = getAdminApp();
export const adminDb = app ? getFirestore(app) : null;
