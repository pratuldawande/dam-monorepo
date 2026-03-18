import { useEffect, useState } from 'react';
import CreateProjectModal from '../components/CreateProjectModal';
import ConfirmModal from '../components/ConfirmModal';
import '../styles/projects.css';
import { useNavigate } from 'react-router-dom';
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
  type CreateProjectReq,
  type Project,
  type ProjectsRes,
} from '../services/projectService';

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editProject, setEditProject] = useState<Project | null>(null);

  // Fake API call simulation
  useEffect(() => {
    callGetProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const callGetProjects = async () => {
    setLoading(true);
    getProjects()
      .then((data: ProjectsRes) => {
        setProjects(data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const handleDelete = (id: string) => {
    deleteProject(id)
      .then(() => {
        // Optionally refetch projects here
        setProjects((prev) => prev.filter((p) => p._id !== id));
      })
      .catch((err) => {
        alert('Project deletion failed: ' + err.message);
        callGetProjects(); // Refetch to restore deleted project on failure
      })
      .finally(() => {
        setShowCreate(false);
        setDeleteId(null);
      });
  };

  const handleCreateProject = (newProject: CreateProjectReq) => {
    if (editProject) {
      updateProject(newProject.name, newProject.description, editProject._id)
        .then(() => {
          callGetProjects();
        })
        .catch((err) => {
          alert('Project update failed: ' + err.message);
        })
        .finally(() => {
          setShowCreate(false);
          setEditProject(null);
        });
    } else {
      createProject(newProject.name, newProject.description)
        .then(() => {
          callGetProjects();
        })
        .catch((err) => {
          alert('Project creation failed: ' + err.message);
        })
        .finally(() => {
          setShowCreate(false);
        });
    }
  };

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h2>Projects</h2>
        <button onClick={() => setShowCreate(true)}>+ Create Project</button>
      </div>

      {/* Loading */}
      {loading && <p className="state-text">Loading projects...</p>}

      {/* Error */}
      {error && <p className="state-text error">{error}</p>}

      {/* Empty */}
      {!loading && projects.length === 0 && (
        <p className="state-text">No projects found</p>
      )}

      {/* Project List */}
      {/* Project Table */}
      {!loading && projects.length > 0 && (
        <div className="table-wrapper">
          <table className="projects-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Files</th>
                <th>Jobs</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project._id}>
                  <td>{project.name}</td>
                  <td className="desc-cell">{project.description}</td>
                  <td>{project.filesCount}</td>
                  <td>{project.jobsCount}</td>
                  <td>{new Date(project.createdAt).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <button
                      className="view-btn"
                      onClick={() => navigate(`/projects/${project._id}`)}
                    >
                      View
                    </button>
                    <button
                      className="open-btn"
                      onClick={() => {
                        setEditProject(project);
                        setShowCreate(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => setDeleteId(project._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {showCreate && (
        <CreateProjectModal
          onClose={() => {
            setShowCreate(false);
            setEditProject(null);
          }}
          onCreate={handleCreateProject}
          editProject={editProject}
        />
      )}

      {deleteId && (
        <ConfirmModal
          message="Are you sure you want to delete this project?"
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
};

export default Projects;
