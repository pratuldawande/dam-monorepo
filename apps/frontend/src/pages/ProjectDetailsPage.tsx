import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/projectDetails.css';
import { getProject, type Project } from '../services/projectService';
import {
  deleteFile,
  downloadZip,
  getFiles,
  uploadFiles,
  type File,
} from '../services/fileService';
import { getJobs, createJob, type Job } from '../services/jobService';

const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isSelectingFiles, setIsSelectingFiles] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [createdJob, setCreatedJob] = useState<Job | null>(null);

  useEffect(() => {
    callGetProject();
    callGetFiles();
    callGetJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  useEffect(() => {
    if (!createdJob) return;
    const interval = setInterval(async () => {
      getJobs(createdJob.projectId).then((data) => {
        if (data.data.length > 0) {
          setJobs([...data.data]);
          const allCase = data.data.every(
            (job: Job) => job.status === 'COMPLETED' || job.status === 'FAILED'
          );
          if (allCase) {
            clearInterval(interval);
          }
        } else {
          console.error('No Jobs found for project ID:', createdJob.projectId);
        }
      });
    }, 5000);

    // Cleanup when component unmounts
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdJob]);

  const callGetFiles = async () => {
    getFiles(projectId!).then((data) => {
      if (data.data.length > 0) {
        setFiles([...data.data]);
      } else {
        console.error('No files found for project ID:', projectId);
      }
    });
  };
  const callGetJobs = async () => {
    getJobs(projectId!).then((data) => {
      if (data.data.length > 0) {
        setJobs([...data.data]);
      } else {
        console.error('No Jobs found for project ID:', projectId);
      }
    });
  };

  const callGetProject = async () => {
    getProject(projectId!).then((data) => {
      if (data.data) {
        const proj: Project = data.data;
        setProject(proj);
      } else {
        console.error('No project found with ID:', projectId);
      }
    });
  };

  const handleDownload = async (job: Job) => {
    try {
      const response = await downloadZip(job.projectId, job.outputFileId);

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `job-${job.outputFileId}-output.zip`; // dynamic name
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length === 0) return;

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    const formData = new FormData();

    // append all selected files
    Array.from(files).forEach((file) => {
      if (file.size > MAX_SIZE) {
        alert(`${file.name} exceeds 5MB limit`);
        e.target.value = '';
        return;
      }
      formData.append('files', file);
    });

    uploadFiles(projectId!, formData)
      .then((data) => {
        if (data.success) {
          callGetFiles();
        } else {
          alert('File upload failed: ' + data.message);
        }
      })
      .catch((err) => {
        alert('File upload failed: ' + err.message);
      })
      .finally(() => {
        // reset file input
        e.target.value = '';
      });
  };

  const handleCreateJobClick = () => {
    if (!isSelectingFiles) {
      // Enable selection mode
      setIsSelectingFiles(true);
      return;
    }

    // If already selecting → create job
    if (selectedFiles.length === 0) {
      alert('Please select at least one file');
      return;
    }
    createJob(projectId!, selectedFiles)
      .then((data) => {
        if (data.success) {
          setJobs((prev) => [...prev, data.data]);
          setCreatedJob(data.data);
          //callGetJobs();
        }
      })
      .catch((err) => {
        alert('Job creation failed: ' + err.message);
      })
      .finally(() => {
        setIsSelectingFiles(false);
        setSelectedFiles([]);
      });
  };

  const handleDeleteFile = async (fileId: string) => {
    deleteFile(projectId!, fileId)
      .then((data) => {
        if (data.success) {
          console.log('File deleted successfully');
        }
        // remove file from UI without refetch
        setFiles((prevFiles) =>
          prevFiles.filter((file) => file._id !== fileId)
        );
      })
      .catch((err) => {
        alert('File deletion failed: ' + err.message);
      });
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      // Unselect all
      setSelectedFiles([]);
    } else {
      // Select all
      setSelectedFiles(files.map((file) => file._id));
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="project-details-container">
      {/* Project Info */}
      <section className="project-info">
        <div className="project-header">
          <div>
            <h2>{project.name}</h2>
            <p>{project.description}</p>
            <span>
              Created: {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </section>

      {/* Files Section */}
      <section className="project-section">
        <div className="section-header">
          <h3>Files</h3>
          <div className="job-actions">
            {isSelectingFiles ? (
              <>
                <button
                  className="create-job-btn"
                  onClick={handleCreateJobClick}
                >
                  Confirm Zip
                </button>

                <button
                  className="cancel-btn"
                  onClick={() => {
                    setIsSelectingFiles(false);
                    setSelectedFiles([]);
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button className="create-job-btn" onClick={handleCreateJobClick}>
                + Create Zip
              </button>
            )}
            <label className="upload-btn">
              Upload Files
              <input type="file" multiple hidden onChange={handleFileUpload} />
            </label>
          </div>
        </div>
        <div className="table-wrapper">
          <table className="project-table">
            <thead>
              <tr>
                {isSelectingFiles && (
                  <th>
                    <input
                      type="checkbox"
                      checked={
                        selectedFiles.length === files.length &&
                        files.length > 0
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                )}
                <th>Name</th>
                <th>Uploaded Date</th>
                <th>Size</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file._id}>
                  {isSelectingFiles && (
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file._id)}
                        onChange={() => {
                          setSelectedFiles((prev) =>
                            prev.includes(file._id)
                              ? prev.filter((id) => id !== file._id)
                              : [...prev, file._id]
                          );
                        }}
                      />
                    </td>
                  )}
                  <td>{file.name}</td>
                  <td>{new Date(file.createdAt).toLocaleDateString()}</td>
                  <td>{file.size}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteFile(file._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="project-section">
        <h3>Jobs</h3>
        <div className="table-wrapper">
          <table className="project-table">
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Created</th>
                <th>Completed At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td>{job._id}</td>
                  <td>
                    <span className={`job-badge ${job.status.toLowerCase()}`}>
                      {job.status}
                    </span>
                  </td>
                  <td>{job.progress}%</td>
                  <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                  <td>
                    {job.updatedAt
                      ? new Date(job.updatedAt).toLocaleDateString()
                      : '-'}
                  </td>
                  {job.status === 'COMPLETED' ? (
                    <td className="action-cell">
                      <button
                        className="download-btn"
                        onClick={() => handleDownload(job)}
                      >
                        Download
                      </button>
                    </td>
                  ) : (
                    <td className="action-cell">
                      <span className="disabled-text">Not Ready</span>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetailsPage;
