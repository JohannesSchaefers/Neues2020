// ==========================
// main.ts — Deploy-safe version
// ==========================

// Detect if running on Deno Deploy
const isInDeploy = Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined;

// Local startup check for required env vars (skipped on Deploy)
if (!isInDeploy) {
  const requiredVars = [
    "R2_ACCESS_KEY_ID",
    "R2_SECRET_ACCESS_KEY",
    "R2_ENDPOINT",
    "R2_BUCKET_NAME",
  ];

  let missingVars = false;
  for (const name of requiredVars) {
    if (!Deno.env.get(name)) {
      console.error(`❌ Missing env variable: ${name}`);
      missingVars = true;
    } else {
      console.log(`✅ Found env variable: ${name}`);
    }
  }

  if (missingVars) {
    console.error("❌ One or more required environment variables are missing. Exiting.");
    Deno.exit(1);
  }
}

// ==========================
// Fetch environment variables
// ==========================
const accessKeyId = Deno.env.get("R2_ACCESS_KEY_ID")!;
const secretAccessKey = Deno.env.get("R2_SECRET_ACCESS_KEY")!;
const endpoint = Deno.env.get("R2_ENDPOINT")!;
const bucketName = Deno.env.get("R2_BUCKET_NAME")!;

// ==========================
// Initialize S3 Client
// ==========================
import { S3Client, ListObjectsV2Command, _Object as ObjectSummary } from "npm:@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "auto",
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

console.log("✅ S3 Client successfully initialized.");

// ==========================
// List PDF files in bucket
// ==========================
export async function listPDFFiles(bucketName: string): Promise<string[]> {
  try {
    const command = new ListObjectsV2Command({ Bucket: bucketName });
    const response = await s3Client.send(command);

    const files = response.Contents?.filter((obj: ObjectSummary) =>
      obj.Key?.endsWith(".pdf")
    ).map((obj) => obj.Key!) || [];

    console.log("📂 Bucket contents:", files);
    return files;
  } catch (error) {
    console.error("❌ Error fetching files from R2:", error);
    throw error;
  }
}

// ==========================
// Test run when executed directly
// ==========================
if (import.meta.main) {
  const pdfs = await listPDFFiles(bucketName);
  console.log("Found PDFs:", pdfs);
}
