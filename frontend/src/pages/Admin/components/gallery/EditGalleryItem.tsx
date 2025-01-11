import { useState, useRef, useEffect } from "react";
import { useUpdateGalleryItem } from "@hooks/useGallery";
import { GalleryItem } from "@/types/gallery.types";
import { FaTimes, FaPlus, FaImage } from "react-icons/fa";

interface EditGalleryItemProps {
  item: GalleryItem;
  onClose: () => void;
}

const EditGalleryItem = ({ item, onClose }: EditGalleryItemProps) => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(item.image.url);
  const [description, setDescription] = useState(item.description);
  const [tags, setTags] = useState<string[]>(item.tags);
  const [newTag, setNewTag] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateGalleryItem = useUpdateGalleryItem();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    if (image) {
      formData.append("image", image);
    }
    formData.append("description", description);
    formData.append("tags", JSON.stringify(tags));

    try {
      await updateGalleryItem.mutateAsync({
        id: item._id,
        formData,
      });
      onClose();
    } catch (error) {
      console.error("Failed to update gallery item:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Edit Gallery Item</h3>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="gallery-form">
          <div className="image-upload">
            <div className="image-preview">
              <img src={preview} alt="Preview" />
              <button
                type="button"
                className="change-image"
                onClick={() => fileInputRef.current?.click()}
              >
                Change Image
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter image description..."
              required
            />
          </div>

          <div className="form-group">
            <label>Tags:</label>
            <div className="tags-input">
              <div className="tags-list">
                {tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)}>
                      <FaTimes />
                    </button>
                  </span>
                ))}
              </div>
              <div className="add-tag">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!newTag.trim()}
                >
                  <FaPlus />
                </button>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-save"
              disabled={!description || updateGalleryItem.isPending}
            >
              {updateGalleryItem.isPending ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditGalleryItem;
