import type { Document } from "@/types/document";

function DocumentViewer({ doc }: { doc: Document }) {
  const isImage = doc.mimeType.startsWith("image/");
  const isPDF = doc.mimeType === "application/pdf";
  const isDoc =
    doc.mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  return (
    <div className="space-y-4">
      <div className="w-full h-100 flex items-center justify-center border rounded-md overflow-hidden">
        {isImage && (
          <img
            src={doc.fileUrl}
            alt="document"
            className="max-h-full object-contain"
          />
        )}

        {isPDF && (
          <iframe
            src={doc.fileUrl}
            className="w-full h-full"
            title="pdf"
          />
        )}

        {isDoc && (
          <iframe
            src={`https://docs.google.com/gview?url=${doc.fileUrl}&embedded=true`}
            className="w-full h-full"
            title="docx"
          />
        )}

        {!isImage && !isPDF && !isDoc && (
          <div className="text-sm text-gray-500">
            Cannot preview this file type
          </div>
        )}
      </div>

      <div className="text-sm space-y-1">
        <p><strong>Type:</strong> {doc.documentType}</p>
        <p><strong>Side:</strong> {doc.side}</p>
      </div>

      <div className="flex justify-end">
        <a
          href={doc.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline text-sm"
        >
          Download / Open
        </a>
      </div>
    </div>
  );
}

export default DocumentViewer;