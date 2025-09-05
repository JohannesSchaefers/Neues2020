/*import { Handlers, PageProps } from "$fresh/server.ts";
import { listPDFFiles } from "../main.ts";

// Import dotenv to load the environment variables
import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";

// Load environment variables from .env file
config(); // Simply load environment variables

interface Data {
  files: string[];
  subdomain: string;
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    // Get environment variables
    const bucketName = Deno.env.get("R2_BUCKET_NAME");  // Get bucket name from environment
    const subdomain = Deno.env.get("SUBDOMAIN");  // Get subdomain from environment

    // Check if bucketName is missing, and log a warning
    if (!bucketName) {
      console.warn("R2_BUCKET_NAME is not set in the environment variables.");
    }
    if (!subdomain) {
      console.warn("SUBDOMAIN is not set in the environment variables.");
    }

    try {
      // List the PDF files from the R2 bucket
      const files = await listPDFFiles(bucketName || "my-bucket");  // Default to "my-bucket" if not found

      // Return the data to the client (files and subdomain)
      return ctx.render({ files, subdomain: subdomain || "subdomain.domain.de" });
    } catch (error) {
      console.error(
        `Failed to list PDF files: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return ctx.render({ files: [], subdomain: subdomain || "subdomain.domain.de" });
    }
  },
};

export default function Home({ data }: PageProps<Data>) {
  const { files, subdomain } = data;  // Destructure both files and subdomain

  return (
    <div class="p-4 mx-auto max-w-screen-md">
      <h1 class="text-2xl font-bold">PDF-Dateien</h1>
      {files.length === 0 ? (
        <p>Keine PDF-Dateien gefunden.</p>
      ) : (
        <ul class="mt-4">
          {files.map((file) => (
            <li key={file}>
              <a
                href={`https://${subdomain}/${file}`}  // Use subdomain here
                class="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener"
              >
                {file}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
*/

import { Handlers, PageProps } from "$fresh/server.ts";
import { listPDFFiles } from "../main.ts";

// Import dotenv to load the environment variables
import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";

// Load environment variables from .env file (same as main.ts)
const env = config();

// Log the loaded environment variables for debugging purposes
console.log("Loaded environment variables:", env);

interface Data {
  files: string[];
  subdomain: string;
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    // Fetch environment variables using `config()`
    const bucketName = env.R2_BUCKET_NAME || "my-bucket"; // Default if not found
    let subdomain = env.SUBDOMAIN; // Directly from `env`

    // Debug output for environment variables
    console.log("R2_BUCKET_NAME:", bucketName);
    console.log("SUBDOMAIN:", subdomain);

    // Validate the required environment variables (same as in main.ts)
    function checkEnvVar(variable: string | undefined, name: string): void {
      if (!variable?.trim()) {
        console.error(`Fehler: ${name} ist nicht gesetzt oder leer`);
        throw new Error(`${name} fehlt`);
      }
    }

    // Validate the `bucketName` and `subdomain`
    checkEnvVar(bucketName, "R2_BUCKET_NAME");
    checkEnvVar(subdomain, "SUBDOMAIN");

    // Provide a fallback if subdomain is undefined
    subdomain = subdomain || "subdomain.domain.de";  // Default if not found

    try {
      // List the PDF files from the R2 bucket
      const files = await listPDFFiles(bucketName);  // Ensure bucketName is valid

      // Return the data to the client (files and subdomain)
      return ctx.render({ files, subdomain });
    } catch (error) {
      console.error(
        `Failed to list PDF files: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return ctx.render({ files: [], subdomain });
    }
  },
};

export default function Home({ data }: PageProps<Data>) {
  const { files, subdomain } = data;  // Destructure both files and subdomain

  return (
    <div class="p-4 mx-auto max-w-screen-md">
      <h1 class="text-2xl font-bold">PDF-Dateien</h1>
      {files.length === 0 ? (
        <p>Keine PDF-Dateien gefunden.</p>
      ) : (
        <ul class="mt-4">
          {files.map((file) => (
            <li key={file}>
              <a
                href={`https://${subdomain}/${file}`}  //   Use subdomain here
                class="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener"
              >
                {file}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
