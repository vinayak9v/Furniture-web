'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus, Search, Edit, Trash2, Image as ImageIcon, Loader2, X
} from 'lucide-react';

export default function CategoryManager() {
  const brandBrown = "#8c5a35";

  // States
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form States
  const [categoryName, setCategoryName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [editingId, setEditingId] = useState(null); // Pata lagane ke liye ki edit mode hai ya nahi

  // ================= 1. FETCH CATEGORIES =================
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/categories`);
      const data = await response.json();

      if (data.success) {
        setCategories(data.categories);
      } else {
        setError('Failed to load categories');
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError('Server connection error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ================= 2. FILE SELECTION =================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // ================= 3. SUBMIT (ADD OR EDIT) =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName) {
      alert("Please provide a category name.");
      return;
    }

    if (!editingId && !selectedFile) {
      alert("Please provide an image for the new category.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', categoryName);
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      // Check URL and Method (POST for Add, PUT for Edit)
      const url = editingId ? `/api/admin/categories/${editingId}` : `/api/admin/categories`;
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        closeModal();
        fetchCategories(); // Refresh data
      } else {
        alert(data.message || "Failed to save category");
      }
    } catch (err) {
      console.error("Error submitting category:", err);
      alert("An error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= 4. OPEN EDIT MODAL =================
  const handleEditClick = (category) => {
    setCategoryName(category.name);
    setPreviewUrl(getImageUrl(category.image));
    setSelectedFile(null); // File clear kar do
    setEditingId(category.id); // ID set karo taaki update ho
    setIsModalOpen(true);
  };

  // ================= 5. DELETE CATEGORY =================
  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this category?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (response.ok) {
        fetchCategories(); // Refresh List
      } else {
        alert(data.message || "Failed to delete category");
      }
    } catch (err) {
      console.error("Error deleting:", err);
      alert("Error connecting to server.");
    }
  };

  // Reset Modal State
  const closeModal = () => {
    setIsModalOpen(false);
    setCategoryName('');
    setSelectedFile(null);
    setPreviewUrl(null);
    setEditingId(null);
  };

  // Helper Functions
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return imagePath; // Agar local image ho toh (Adjust according to your setup)
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] rounded-2xl w-full">

      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
          <p className="text-sm text-gray-500">Manage your product categories here.</p>
        </div>
        <button
          onClick={() => { closeModal(); setIsModalOpen(true); }}
          className="bg-[#8c5a35] hover:bg-[#7a4e2e] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-sm"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-xl">
          {error}
        </div>
      )}

      {/* TABLE SECTION */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search categories..."
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm w-64 outline-none focus:ring-2 focus:ring-[#8c5a35]/20"
            />
          </div>
          <span className="text-sm font-bold text-gray-500">Total: {categories.length}</span>
        </div>

        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-400">
              <Loader2 size={32} className="animate-spin text-[#8c5a35]" />
              <p className="text-sm font-medium">Loading categories...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 sticky top-0 z-10 backdrop-blur-sm">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Image</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Created At</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-gray-500 text-sm">No categories found. Click 'Add Category' to create one.</td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">#{cat.id}</td>
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center">
                          {cat.image ? (
                            <img
                              src={getImageUrl(cat.image)}
                              alt={cat.name}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <ImageIcon size={20} className="text-gray-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">{cat.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(cat.createdAt)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* EDIT BUTTON */}
                          <button
                            onClick={() => handleEditClick(cat)}
                            className="p-2 border border-gray-200 rounded-md text-gray-500 hover:text-[#8c5a35] hover:bg-orange-50 transition-colors"
                          >
                            <Edit size={16} />
                          </button>

                          {/* DELETE BUTTON */}
                          <button
                            onClick={() => handleDeleteClick(cat.id)}
                            className="p-2 border border-gray-200 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">

            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-lg text-gray-900">
                {editingId ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Category Name</label>
                <input
                  type="text"
                  required
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Living Room"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#8c5a35]/20 focus:border-[#8c5a35] transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">
                  Category Image {editingId && <span className="text-gray-400 lowercase font-normal">(Optional to change)</span>}
                </label>

                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-[#8c5a35] transition-colors relative">
                  <div className="space-y-1 text-center">
                    {previewUrl ? (
                      <div className="mx-auto h-24 w-24 rounded-lg overflow-hidden mb-3 border border-gray-200 relative group">
                        <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center">
                          <ImageIcon className="text-white" size={24} />
                        </div>
                      </div>
                    ) : (
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    )}

                    <div className="flex text-sm text-gray-600 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-bold text-[#8c5a35] hover:underline focus-within:outline-none">
                        <span>Upload a new file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} required={!editingId} />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-[#8c5a35] text-white font-bold text-sm rounded-xl hover:bg-[#7a4e2e] transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <><Loader2 size={18} className="animate-spin" /> {editingId ? "Updating..." : "Saving..."}</>
                  ) : (
                    editingId ? "Update Category" : "Save Category"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
