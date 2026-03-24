import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAsset, uploadAssets, type Asset } from "../api/asset.api";
import { useAssets } from "../hooks/useAssets";
import "../styles/assets.css";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

const formatBytes = (bytes?: number) => {
  if (!bytes) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

const formatDate = (value?: string) => {
  if (!value) {
    return "NA";
  }

  return new Date(value).toLocaleString();
};

const getAssetPreview = (asset: Asset) => {
  if (asset.type?.startsWith("image/")) {
    return asset.url;
  }

  return asset.metadata?.thumbnails?.[0]?.url || asset.url;
};

const Assets = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  const { data, isLoading, isError, error, isFetching } = useAssets({
    page,
    limit,
    search: search || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
    type: typeFilter === "all" ? undefined : typeFilter,
  });

  const uploadMutation = useMutation({
    mutationFn: uploadAssets,
    onSuccess: () => {
      setSelectedFiles([]);
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });

  const assets = data?.data ?? [];
  const meta = data?.meta;
  const totalAssets = meta?.total ?? 0;
  const currentPage = meta?.page ?? page;
  const currentLimit = meta?.limit ?? limit;
  const totalPages = meta?.totalPages ?? 0;
  const hasFilters = Boolean(search) || statusFilter !== "all" || typeFilter !== "all";

  useEffect(() => {
    if (!meta) {
      return;
    }

    if (totalPages === 0 && page !== 1) {
      setPage(1);
      return;
    }

    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [meta, page, totalPages]);

  const mergeFiles = (incomingFiles: File[]) => {
    setSelectedFiles((currentFiles) => {
      const nextFiles = [...currentFiles];

      incomingFiles.forEach((file) => {
        const alreadyAdded = nextFiles.some(
          (existingFile) =>
            existingFile.name === file.name &&
            existingFile.size === file.size &&
            existingFile.lastModified === file.lastModified
        );

        if (!alreadyAdded) {
          nextFiles.push(file);
        }
      });

      return nextFiles;
    });
  };

  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    mergeFiles(files);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    mergeFiles(Array.from(event.dataTransfer.files || []));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || uploadMutation.isPending) {
      return;
    }

    await uploadMutation.mutateAsync(selectedFiles);
  };

  const removeSelectedFile = (indexToRemove: number) => {
    setSelectedFiles((currentFiles) =>
      currentFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleDelete = async (assetId: string) => {
    if (deleteMutation.isPending) {
      return;
    }

    const confirmed = window.confirm("Delete this asset and its generated files?");

    if (!confirmed) {
      return;
    }

    await deleteMutation.mutateAsync(assetId);
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatusFilter("all");
    setTypeFilter("all");
    setPage(1);
  };

  return (
    <div className="assets-page">
      <section className="assets-hero">
        <div>
          <p className="assets-kicker">Media Desk</p>
          <h1>Assets</h1>
          <p className="assets-subtitle">
            Upload files with drag and drop, then track processing, thumbnails, and
            transcoded outputs in one place.
          </p>
        </div>

        <div className="assets-hero-stats">
          <div className="asset-stat-card">
            <span>Matching Assets</span>
            <strong>{totalAssets}</strong>
          </div>
          <div className="asset-stat-card">
            <span>Visible Rows</span>
            <strong>{assets.length}</strong>
          </div>
          <div className="asset-stat-card">
            <span>Page</span>
            <strong>{totalPages === 0 ? 0 : currentPage}</strong>
          </div>
        </div>
      </section>

      <section className="assets-upload-panel">
        <div
          className={`upload-dropzone ${isDragging ? "dragging" : ""}`}
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            if (event.currentTarget === event.target) {
              setIsDragging(false);
            }
          }}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            className="upload-input"
            type="file"
            multiple
            onChange={handleFileSelection}
          />

          <div className="upload-copy">
            <span className="upload-badge">Drag and drop</span>
            <h2>Drop images or videos here</h2>
            <p>Or pick files manually and send them to the asset pipeline.</p>
          </div>

          <div className="upload-actions">
            <button
              type="button"
              className="ghost-upload-btn"
              onClick={() => inputRef.current?.click()}
            >
              Choose files
            </button>
            <button
              type="button"
              className="primary-upload-btn"
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || uploadMutation.isPending}
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload assets"}
            </button>
          </div>
        </div>

        <div className="upload-queue-panel">
          <div className="upload-queue-header">
            <h3>Upload Queue</h3>
            <span>{selectedFiles.length} file(s)</span>
          </div>

          {selectedFiles.length === 0 ? (
            <p className="queue-empty">No files selected yet.</p>
          ) : (
            <div className="selected-file-list">
              {selectedFiles.map((file, index) => (
                <div key={`${file.name}-${file.lastModified}-${index}`} className="selected-file-card">
                  <div>
                    <strong>{file.name}</strong>
                    <p>
                      {file.type || "Unknown type"} · {formatBytes(file.size)}
                    </p>
                  </div>
                  <button type="button" onClick={() => removeSelectedFile(index)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {uploadMutation.isError ? (
            <p className="asset-feedback error">
              {(uploadMutation.error as Error)?.message || "Upload failed"}
            </p>
          ) : null}

          {uploadMutation.isSuccess ? (
            <p className="asset-feedback success">Assets uploaded successfully.</p>
          ) : null}
        </div>
      </section>

      <section className="assets-table-section">
        <div className="assets-table-header">
          <div>
            <p className="assets-kicker">Library</p>
            <h2>Uploaded assets</h2>
          </div>
          <div className="assets-table-toolbar">
            <label className="asset-control asset-search-control">
              <span>Search</span>
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Name, type, or tag"
              />
            </label>

            <label className="asset-control">
              <span>Status</span>
              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPage(1);
                }}
              >
                <option value="all">All statuses</option>
                <option value="queued">Queued</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </label>

            <label className="asset-control">
              <span>Type</span>
              <select
                value={typeFilter}
                onChange={(event) => {
                  setTypeFilter(event.target.value);
                  setPage(1);
                }}
              >
                <option value="all">All media</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label className="asset-control asset-limit-control">
              <span>Rows</span>
              <select
                value={limit}
                onChange={(event) => {
                  setLimit(Number(event.target.value));
                  setPage(1);
                }}
              >
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option} / page
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              className="asset-clear-filters-btn"
              onClick={clearFilters}
              disabled={!hasFilters}
            >
              Clear
            </button>
          </div>
        </div>

        {isLoading ? <p className="asset-feedback">Loading assets...</p> : null}
        {!isLoading && isFetching ? (
          <p className="asset-feedback">Refreshing asset list...</p>
        ) : null}
        {isError ? (
          <p className="asset-feedback error">
            {(error as Error)?.message || "Failed to load assets"}
          </p>
        ) : null}

        {!isLoading && !isError ? (
          <div className="assets-table-shell">
            <table className="assets-table">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Outputs</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="assets-empty-row">
                      No assets found.
                    </td>
                  </tr>
                ) : (
                  assets.map((asset) => {
                    const previewUrl = getAssetPreview(asset);
                    const thumbnailCount = asset.metadata?.thumbnails?.length ?? 0;
                    const variantCount = asset.metadata?.variants?.length ?? 0;

                    return (
                      <tr key={asset._id}>
                        <td>
                          <div className="asset-preview-frame">
                            {previewUrl ? (
                              <img src={previewUrl} alt={asset.originalName || "Asset preview"} />
                            ) : (
                              <span>No preview</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="asset-name-cell">
                            <strong>{asset.originalName || asset.name || "Unnamed asset"}</strong>
                            <span>{asset.userId || "Unknown owner"}</span>
                          </div>
                        </td>
                        <td>{asset.type || "NA"}</td>
                        <td>{formatBytes(asset.size)}</td>
                        <td>
                          <span className={`asset-status asset-status-${asset.status}`}>
                            {asset.status || "unknown"}
                          </span>
                        </td>
                        <td>{formatDate(asset.createdAt)}</td>
                        <td>
                          <div className="asset-output-cell">
                            <span>{thumbnailCount} thumbnails</span>
                            <span>{variantCount} variants</span>
                            {asset.url ? (
                              <a href={asset.url} target="_blank" rel="noreferrer">
                                Open original
                              </a>
                            ) : null}
                          </div>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="asset-delete-btn"
                            onClick={() => handleDelete(asset._id)}
                            disabled={deleteMutation.isPending}
                          >
                            {deleteMutation.isPending ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : null}

        {!isLoading && !isError ? (
          <div className="assets-pagination">
            <p className="assets-pagination-summary">
              {totalAssets === 0
                ? "No matching assets"
                : `Showing ${(currentPage - 1) * currentLimit + 1}-${Math.min(
                    currentPage * currentLimit,
                    totalAssets
                  )} of ${totalAssets}`}
            </p>

            <div className="assets-pagination-actions">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={currentPage <= 1}
              >
                Previous
              </button>
              <span>
                Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() =>
                  setPage((current) =>
                    totalPages === 0 ? current : Math.min(totalPages, current + 1)
                  )
                }
                disabled={totalPages === 0 || currentPage >= totalPages}
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default Assets;
