// Load .env only when running locally (not on Deno Deploy)
if (Deno.env.get("DENO_DEPLOYMENT_ID") === undefined) {
  await import("https://deno.land/std@0.224.0/dotenv/load.ts");
}

import {
  S3Client,
  ListObjectsV2Command,
  _Object as ObjectSummary,
} from "npm:@aws-sdk/client-s3";

// === Environment Variables ===
const accessKeyId = Deno.env.get("R2_ACCESS_KEY_ID");
const secretAccessKey = Deno.env.get("R2_SECRET_ACCESS_KEY");
const endpoint = Deno.env.get("R2_ENDPOINT");
const bucketName = Deno.env.get("R2_BUCKET_NAME");

// === Safe Startup Check ===
const requiredVars = ["R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_ENDPOINT", "R2_BUCKET_NAME"];
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

// === Initialize S3 Client ===
const s3Client = new S3Client({
  region: "auto",
  endpoint,
  credentials: {
    accessKeyId: accessKeyId!,
    secretAccessKey: secretAccessKey!,
  },
});

console.log("✅ S3 Client successfully initialized.");

// === List PDF Files in Bucket ===
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
    console.error("❌ Fehler beim Abrufen der Dateien aus R2:", error);
    throw error;
  }
}

// === Test run when executed directly ===
if (import.meta.main) {
  const bucketToUse = bucketName!;
  const pdfs = await listPDFFiles(bucketToUse);
  console.log("Found PDFs:", pdfs);
}
