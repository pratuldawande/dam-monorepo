import { useState } from 'react';
import '../styles/createProjectModal.css';
import type { Project } from '../services/projectService';

interface Props {
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCreate: (project: any) => void;
  editProject: Project | null;
}

const CreateProjectModal = ({ onClose, onCreate, editProject }: Props) => {
  const [name, setName] = useState(editProject ? editProject.name : '');
  const [description, setDescription] = useState(
    editProject ? editProject.description : ''
  );
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name || !description) {
      setError('All fields are required');
      return;
    }

    onCreate({
      name,
      description,
    });

    onClose();
  };

  return (
    <div className="create-overlay">
      <div className="create-modal">
        <h3>Create Project</h3>

        <div className="create-form">
          <input
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {error && <p className="input-error">{error}</p>}

          <div className="create-actions">
            <button className="create-cancel" onClick={onClose}>
              Cancel
            </button>

            <button className="create-submit" onClick={handleSubmit}>
              {editProject ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
