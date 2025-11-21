"use client";

import { type ChangeEvent, type DragEvent, useRef, useState } from "react";

interface ProcessedImage {
  original: File;
  processed: Blob;
  previewUrl: string;
  originalSize: number;
  processedSize: number;
}

export default function Home() {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = async (file: File): Promise<ProcessedImage> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to create blob"));
              return;
            }

            resolve({
              original: file,
              processed: blob,
              previewUrl: URL.createObjectURL(blob),
              originalSize: file.size,
              processedSize: blob.size,
            });
          },
          file.type,
          1.0,
        );
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsProcessing(true);

    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );

    try {
      const processed = await Promise.all(imageFiles.map(processImage));
      setImages((prev) => [...prev, ...processed]);
    } catch (error) {
      console.error("Error processing images:", error);
      alert("Error processing images");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const downloadImage = (image: ProcessedImage) => {
    const url = URL.createObjectURL(image.processed);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cleaned_${image.original.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    images.forEach((image, index) => {
      setTimeout(() => downloadImage(image), index * 100);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].previewUrl);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const clearAll = () => {
    images.forEach((img) => {
      URL.revokeObjectURL(img.previewUrl);
    });
    setImages([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Math.round((bytes / k ** i) * 100) / 100} ${sizes[i]}`;
  };

  return (
    <div
      className="h-screen overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom right, var(--background), var(--background-secondary))",
      }}
    >
      <div className="mx-auto h-full max-w-6xl overflow-y-auto px-4 py-8">
        <div className="mb-6 text-center">
          <h1
            className="mb-2 text-3xl/tight font-bold sm:text-4xl/tight"
            style={{ color: "var(--foreground)" }}
          >
            Metadata Remover
          </h1>
          <p
            className="text-base/6"
            style={{ color: "var(--foreground-secondary)" }}
          >
            Remove all metadata from your photos quickly and securely
          </p>
        </div>

        <div
          role="button"
          tabIndex={0}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className="mb-8 cursor-pointer rounded-lg border-2 border-dashed transition-all"
          style={{
            borderColor: isDragging ? "var(--primary)" : "var(--border)",
            backgroundColor: isDragging
              ? "var(--primary-light)"
              : "var(--card-bg)",
          }}
          onMouseEnter={(e) => {
            if (!isDragging) {
              e.currentTarget.style.borderColor = "var(--border-hover)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isDragging) {
              e.currentTarget.style.borderColor = "var(--border)";
            }
          }}
        >
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-10">
            <svg
              className="size-12"
              style={{ color: "var(--foreground-tertiary)" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              role="img"
              aria-label="Upload icon"
            >
              <title>Upload</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div className="text-center">
              <p
                className="text-base/6 font-medium"
                style={{ color: "var(--foreground)" }}
              >
                Drag and drop images here
              </p>
              <p
                className="text-sm/5"
                style={{ color: "var(--foreground-secondary)" }}
              >
                or click to select files
              </p>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />

        {isProcessing && (
          <div
            className="mb-8 flex items-center justify-center gap-3 rounded-lg px-4 py-3"
            style={{ backgroundColor: "var(--primary-light)" }}
          >
            <div
              className="size-5 animate-spin rounded-full border-2 border-t-transparent"
              style={{
                borderColor: "var(--primary)",
                borderTopColor: "transparent",
              }}
            />
            <p className="text-base/6" style={{ color: "var(--primary-text)" }}>
              Processing images...
            </p>
          </div>
        )}

        {images.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <p
              className="text-base/6"
              style={{ color: "var(--foreground-secondary)" }}
            >
              Processed: <span className="font-semibold">{images.length}</span>{" "}
              {images.length === 1 ? "image" : "images"}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={clearAll}
                className="rounded-lg border px-4 py-2 text-base/6 font-medium transition-colors"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--card-bg)",
                  color: "var(--foreground-secondary)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--muted-bg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--card-bg)";
                }}
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={downloadAll}
                className="rounded-lg px-4 py-2 text-base/6 font-medium transition-colors"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--background)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--primary-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--primary)";
                }}
              >
                Download all
              </button>
            </div>
          </div>
        )}

        {images.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image, index) => (
              <div
                key={image.previewUrl}
                className="overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-md"
                style={{ backgroundColor: "var(--card-bg)" }}
              >
                <div
                  className="relative aspect-video"
                  style={{ backgroundColor: "var(--muted-bg)" }}
                >
                  <img
                    src={image.previewUrl}
                    alt={`Preview ${index + 1}`}
                    className="size-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <p
                    className="mb-2 truncate text-sm/6 font-medium"
                    style={{ color: "var(--foreground)" }}
                  >
                    {image.original.name}
                  </p>
                  <div
                    className="mb-3 flex items-center justify-between text-xs/5"
                    style={{ color: "var(--foreground-secondary)" }}
                  >
                    <span>{formatFileSize(image.originalSize)}</span>
                    <span>→</span>
                    <span
                      className="font-medium"
                      style={{ color: "var(--success)" }}
                    >
                      {formatFileSize(image.processedSize)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => downloadImage(image)}
                      className="flex-1 rounded-lg px-3 py-2 text-sm/5 font-medium transition-colors"
                      style={{
                        backgroundColor: "var(--primary)",
                        color: "var(--background)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--primary-hover)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--primary)";
                      }}
                    >
                      Download
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="rounded-lg border px-3 py-2 text-sm/5 font-medium transition-colors"
                      style={{
                        borderColor: "var(--border)",
                        backgroundColor: "var(--card-bg)",
                        color: "var(--foreground-secondary)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--muted-bg)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--card-bg)";
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {images.length === 0 && !isProcessing && (
          <div className="py-8 text-center">
            <div
              className="rounded-lg border p-4 backdrop-blur-sm"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--card-bg-secondary)",
              }}
            >
              <h3
                className="mb-2 text-sm/5 font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                How does it work?
              </h3>
              <ul
                className="list-inside list-disc gap-1 text-xs/5"
                style={{ color: "var(--foreground-secondary)" }}
              >
                <li>Processing happens entirely in your browser</li>
                <li>Your photos are never uploaded to any server</li>
                <li>All EXIF metadata is removed (GPS, camera, date, etc.)</li>
                <li>Image quality is preserved (100%)</li>
              </ul>
            </div>
          </div>
        )}

        <div className="mt-auto pt-8 pb-4 text-center">
          <p
            className="text-xs/5"
            style={{ color: "var(--foreground-tertiary)" }}
          >
            made by{" "}
            <a
              href="https://github.com/00000kkkkk"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors"
              style={{ color: "var(--foreground-secondary)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--foreground-secondary)";
              }}
            >
              00000kkkkk
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
