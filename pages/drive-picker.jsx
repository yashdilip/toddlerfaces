import Script from "next/script";
import { useRouter } from "next/router";
import { useState } from "react";
import axios from "axios";

const pickerScope = "https://www.googleapis.com/auth/drive.readonly";

export default function DrivePickerPage() {
  const router = useRouter();
  const { albumId } = router.query;
  const [gapiReady, setGapiReady] = useState(false);
  const [gisReady, setGisReady] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [acceptedAttestation, setAcceptedAttestation] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_PICKER_API_KEY;
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const loadPickerApi = () => {
    window.gapi.load("picker", () => setGapiReady(true));
  }

  const createImageUrl = (fileId) => `https://drive.google.com/uc?export=view&id=${fileId}`;
  const createThumbnailUrl = (file) => file.thumbnails?.[file.thumbnails.length - 1]?.url || createImageUrl(file.id);

  const persistFiles = async (files) => {
    if (!acceptedAttestation) {
      setMessage("Legal upload attestation is required before importing Drive selections.");
      return;
    }

    if (!albumId) {
      setMessage("Album ID is required.");
      return;
    }

    const created = [];
    for (const file of files) {
      const response = await axios.post("/api/images", {
        albumId,
        provider: "google_drive",
        sourceUrl: createImageUrl(file.id),
        thumbnailUrl: createThumbnailUrl(file),
        caption: file.name,
        uploadAttestationAccepted: true,
      });
      if (response.data?.image) created.push(response.data.image);
    }

    setSelectedFiles(files);
    setMessage(`${created.length} Drive image reference${created.length === 1 ? "" : "s"} imported.`);
  }

  const openPicker = () => {
    setMessage("");

    if (!apiKey || !clientId) {
      setMessage("Google Picker is not configured. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID and NEXT_PUBLIC_GOOGLE_DRIVE_PICKER_API_KEY.");
      return;
    }

    if (!window.google?.accounts?.oauth2 || !window.google?.picker || !gapiReady || !gisReady) {
      setMessage("Google Picker scripts are still loading.");
      return;
    }

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: pickerScope,
      callback: (tokenResponse) => {
        const view = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS_IMAGES)
          .setIncludeFolders(true)
          .setSelectFolderEnabled(false);

        const picker = new window.google.picker.PickerBuilder()
          .setOAuthToken(tokenResponse.access_token)
          .setDeveloperKey(apiKey)
          .addView(view)
          .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
          .setCallback((data) => {
            if (data.action === window.google.picker.Action.PICKED) {
              persistFiles(data.docs);
            }
          })
          .build();

        picker.setVisible(true);
      },
    });

    tokenClient.requestAccessToken({ prompt: "" });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Script src="https://apis.google.com/js/api.js" onLoad={loadPickerApi} />
      <Script src="https://accounts.google.com/gsi/client" onLoad={() => setGisReady(true)} />

      <section className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Google Drive Picker</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">Select Drive images for this album</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
          Pick multiple images from Google Drive. Toddlerfaces stores image references, thumbnails, captions, and audit metadata; it does not copy original files into app storage.
        </p>

        <label className="mt-6 flex gap-3 rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200">
          <input type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600" checked={acceptedAttestation} onChange={(event) => setAcceptedAttestation(event.target.checked)} />
          <span>I legally attest that I am an adult, I have permission to attach these Drive images, and they do not contain illegal, exploitative, abusive, non-consensual, nude, violent, or restricted content.</span>
        </label>

        <button onClick={openPicker} className="mt-6 rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700" type="button">
          Open Google Drive Picker
        </button>

        {message && <p className="mt-5 rounded-md bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-200">{message}</p>}

        {selectedFiles.length > 0 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {selectedFiles.map((file) => (
              <div className="rounded-md border border-gray-200 p-3 text-sm dark:border-gray-800" key={file.id}>
                <p className="font-semibold text-gray-950 dark:text-white">{file.name}</p>
                <p className="mt-1 break-all text-xs text-gray-500 dark:text-gray-400">{file.id}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
