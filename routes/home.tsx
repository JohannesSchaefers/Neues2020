/*
import { Handlers, PageProps } from "$fresh/server.ts";
import { listPDFFiles } from "../main.ts";

interface Data {
  files: string[];
  subdomain: string;
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    // Fetch environment variables using Deno.env.get() in Deno Deploy
    const bucketName = Deno.env.get("R2_BUCKET_NAME") || "my-bucket";  // Default if not found
    let subdomain = Deno.env.get("SUBDOMAIN"); // Directly from environment

    // Debug output for environment variables
    console.log("R2_BUCKET_NAME:", bucketName);
    console.log("SUBDOMAIN:", subdomain);

    // Validate the required environment variables
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
*/



import { Handlers, PageProps } from "$fresh/server.ts";
import { listPDFFiles } from "../main.ts";

interface Data {
  files: string[];
  subdomain: string;
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    // Zugriff auf Umgebungsvariablen mit Deno.env.get
    const bucketName = Deno.env.get("R2_BUCKET_NAME");
    const subdomain = Deno.env.get("SUBDOMAIN");

    // Debug-Ausgabe
    console.log("R2_BUCKET_NAME:", bucketName);
    console.log("SUBDOMAIN:", subdomain);

    // Helper zum Validieren
    function checkEnvVar(variable: string | undefined, name: string): void {
      if (!variable?.trim()) {
        console.error(`Fehler: ${name} ist nicht gesetzt oder leer`);
        throw new Error(`${name} fehlt`);
      }
    }

    // Validierung der Variablen
    checkEnvVar(bucketName, "R2_BUCKET_NAME");
    checkEnvVar(subdomain, "SUBDOMAIN");

    try {
      // Dateien aus dem Bucket holen
      const files = await listPDFFiles(bucketName!);

      // Daten an die Seite weitergeben
      return ctx.render({ files, subdomain: subdomain! });
    } catch (error) {
      console.error(
        `Failed to list PDF files: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return ctx.render({ files: [], subdomain: subdomain! });
    }
  },
};

export default function Home({ data }: PageProps<Data>) {
  const { files, subdomain } = data;

  return (
    <div class="p-4 mx-auto max-w-screen-md">
      <h1 class="text-2xl font-bold">PDF-Dateien</h1>
      {files.length === 0 ? (
        <p>Keine PDF-Dateien gefunden!!</p>
      ) : (
        <ul class="mt-4">
          {files.map((file) => (
            <li key={file}>
              <a
                href={`https://${subdomain}/${file}`}
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
