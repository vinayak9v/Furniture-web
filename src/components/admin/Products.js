'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, UploadCloud, X, Save, Image as ImageIcon,
  Tag, Box, DollarSign, Loader2, CheckCircle2,
  Plus, Edit, Trash2, Package
} from 'lucide-react';

export default function ProductsManagementPage() {
  // ================= MAIN STATES =================
  const [currentView, setCurrentView] = useState('LIST'); // 'LIST' | 'FORM'
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingProducts, setIsFetchingProducts] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [editingId, setEditingId] = useState(null);

  // ================= FORM STATES =================
  const initialFormState = {
    name: '', slug: '', categoryId: '', shortDescription: '', description: '',
    price: '', oldPrice: '', discount: '', stock: '', sku: '', material: '',
    color: '', dimensions: '', weight: '', warranty: '', status: 'ACTIVE',
    isFeatured: '0', isBestSeller: '0'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  // ================= INITIAL FETCH =================
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setIsFetchingProducts(true);
    try {
      const res = await fetch(`/api/admin/products`);
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setIsFetchingProducts(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`/api/admin/categories`);
      const data = await res.json();
      if (data.success) setCategories(data.categories);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  // ================= HELPERS & HANDLERS =================
  const resetForm = () => {
    setFormData(initialFormState);
    setThumbnail(null);
    setThumbnailPreview(null);
    setImages([]);
    setImagesPreview([]);
    setEditingId(null);
    setError('');
    setSuccess('');
  };

  const handleAddNew = () => {
    resetForm();
    setCurrentView('FORM');
  };

  const handleEdit = (product) => {
    resetForm();
    setEditingId(product.id);

    // Populate form with existing data
    setFormData({
      name: product.name || '', slug: product.slug || '', categoryId: product.categoryId || '',
      shortDescription: product.shortDescription || '', description: product.description || '',
      price: product.price || '', oldPrice: product.oldPrice || '', discount: product.discount || '',
      stock: product.stock || '', sku: product.sku || '', material: product.material || '',
      color: product.color || '', dimensions: product.dimensions || '', weight: product.weight || '',
      warranty: product.warranty || '', status: product.status || 'ACTIVE',
      isFeatured: String(product.isFeatured || 0), isBestSeller: String(product.isBestSeller || 0)
    });

    if (product.thumbnail) {
      setThumbnail(product.thumbnail);
      setThumbnailPreview(product.thumbnail);
    }

    if (product.images && product.images.length > 0) {
      const imgUrls = typeof product.images[0] === 'object' ? product.images.map(img => img.image) : product.images;
      setImages(imgUrls);
      setImagesPreview(imgUrls);
    }

    setCurrentView('FORM');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        alert('Product deleted successfully');
      } else {
        alert(data.message || 'Failed to delete product');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting product');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked ? '1' : '0' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (name === 'name' && !editingId) {
        setFormData(prev => ({
          ...prev,
          slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        }));
      }
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImages(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagesPreview(prev => [...prev, ...newPreviews]);
    }
  };

  const removeGalleryImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
    setImagesPreview(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // ================= FORM SUBMISSION (ADD / EDIT) =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // 1. Handle Thumbnail Upload
      let finalThumbnailUrl = thumbnail;
      if (thumbnail instanceof File) {
        const thumbData = new FormData();
        thumbData.append("file", thumbnail);
        thumbData.append("upload_preset", "xyzchandan");

        const thumbRes = await fetch("https://api.cloudinary.com/v1_1/dyhaohtql/image/upload", {
          method: "POST", body: thumbData,
        });
        const thumbResult = await thumbRes.json();
        if (thumbResult.error) throw new Error("Failed to upload thumbnail");
        finalThumbnailUrl = thumbResult.secure_url;
      } else if (!thumbnail) {
        throw new Error("Thumbnail image is required");
      }

      // 2. Handle Gallery Images Upload
      const finalUploadedImages = [];
      for (let image of images) {
        if (typeof image === 'string') {
          finalUploadedImages.push(image); // existing URL
        } else if (image instanceof File) {
          const imageData = new FormData();
          imageData.append("file", image);
          imageData.append("upload_preset", "xyzchandan");
          const imageRes = await fetch("https://api.cloudinary.com/v1_1/dyhaohtql/image/upload", {
            method: "POST", body: imageData,
          });
          const imageResult = await imageRes.json();
          if (!imageResult.error) finalUploadedImages.push(imageResult.secure_url);
        }
      }

      // 3. API Payload
      const payload = {
        ...formData,
        thumbnail: finalThumbnailUrl,
        images: finalUploadedImages,
      };

      // 4. Send Request (POST for New, PUT for Edit)
      const url = editingId ? `/api/admin/products/${editingId}` : `/api/admin/products`;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(`Product ${editingId ? 'updated' : 'added'} successfully!`);
        fetchProducts(); // Refresh list
        setTimeout(() => {
          setCurrentView('LIST');
        }, 1500);
      } else {
        setError(data.message || "Failed to save product.");
      }
    } catch (err) {
      setError(err.message || "Server error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // ================= RENDER LIST VIEW =================
  if (currentView === 'LIST') {
    return (
      <div className="min-h-screen bg-[#f8f9fa] p-4 md:p-8 font-sans">
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Products</h1>
              <p className="text-sm text-gray-500">Manage your store products.</p>
            </div>
            <button
              onClick={handleAddNew}
              className="px-5 py-2.5 bg-[#8c5a35] text-white font-bold text-sm rounded-xl hover:bg-[#7a4e2e] transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus size={18} /> Add New Product
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[800px]">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
                  <tr>
                    <th className="p-4 font-semibold w-16">Image</th>
                    <th className="p-4 font-semibold">Product Info</th>
                    <th className="p-4 font-semibold">Category</th>
                    <th className="p-4 font-semibold">Price</th>
                    <th className="p-4 font-semibold">Stock</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isFetchingProducts ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-[#8c5a35]" size={30} /></td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-500">
                        <Package className="mx-auto text-gray-300 mb-2" size={40} />
                        No products found. Click 'Add New Product' to get started.
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50/50">
                        <td className="p-4">
                          <img src={product.thumbnail || '/placeholder.png'} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500 mt-1">SKU: {product.sku || 'N/A'}</div>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-semibold">
                            {product.categoryName || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-gray-900">
                          ₹{product.price}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${product.stock > 10 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {product.stock} in stock
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Edit size={18} />
                            </button>
                            <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= RENDER ADD/EDIT FORM VIEW =================
  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 md:p-8 font-sans pb-24">
      <form onSubmit={handleSubmit} className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentView('LIST')}
              className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{editingId ? 'Edit Product' : 'Add New Product'}</h1>
              <p className="text-sm text-gray-500">{editingId ? 'Update your product details.' : 'Create a new product for your store.'}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setCurrentView('LIST')}
              className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-[#8c5a35] text-white font-bold text-sm rounded-xl hover:bg-[#7a4e2e] transition-colors flex items-center gap-2 disabled:opacity-70 shadow-sm"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {editingId ? 'Update Product' : 'Save Product'}
            </button>
          </div>
        </div>

        {/* ALERTS */}
        {error && <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2"><X size={18}/> {error}</div>}
        {success && <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-600 rounded-xl text-sm font-bold flex items-center gap-2"><CheckCircle2 size={18}/> {success}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ================= LEFT COLUMN ================= */}
          <div className="lg:col-span-8 space-y-6">

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><Tag size={20} className="text-[#8c5a35]"/> Basic Info</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Product Name *</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#8c5a35]" placeholder="e.g. Luxury Wooden Sofa" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Slug</label>
                  <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none text-gray-500" placeholder="luxury-wooden-sofa" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Short Description</label>
                  <textarea name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} rows="2" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#8c5a35] resize-none" placeholder="Brief summary..."></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Full Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows="5" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#8c5a35] resize-none" placeholder="Detailed product description..."></textarea>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><DollarSign size={20} className="text-[#8c5a35]"/> Pricing & Inventory</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Price (₹) *</label>
                  <input type="number" name="price" required value={formData.price} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#8c5a35]" placeholder="25000" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Old Price (₹)</label>
                  <input type="number" name="oldPrice" value={formData.oldPrice} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#8c5a35]" placeholder="30000" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Discount (%)</label>
                  <input type="number" name="discount" value={formData.discount} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#8c5a35]" placeholder="10" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Stock Quantity *</label>
                  <input type="number" name="stock" required value={formData.stock} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#8c5a35]" placeholder="50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">SKU</label>
                  <input type="text" name="sku" value={formData.sku} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#8c5a35]" placeholder="SOFA-001" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><Box size={20} className="text-[#8c5a35]"/> Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Material</label>
                  <input type="text" name="material" value={formData.material} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#8c5a35]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Color</label>
                  <input type="text" name="color" value={formData.color} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#8c5a35]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Dimensions</label>
                  <input type="text" name="dimensions" value={formData.dimensions} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#8c5a35]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Weight</label>
                  <input type="text" name="weight" value={formData.weight} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#8c5a35]" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Warranty</label>
                  <input type="text" name="warranty" value={formData.warranty} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#8c5a35]" />
                </div>
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN ================= */}
          <div className="lg:col-span-4 space-y-6">

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Organization</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Category *</label>
                  <select name="categoryId" required value={formData.categoryId} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#8c5a35] bg-white">
                    <option value="" disabled>Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                    {categories.length === 0 && <option value="1">Sofa (Fallback ID: 1)</option>}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#8c5a35] bg-white">
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </div>
                <div className="pt-4 space-y-4 border-t border-gray-100">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" name="isFeatured" checked={formData.isFeatured === '1'} onChange={handleInputChange} className="w-5 h-5 rounded text-[#8c5a35] focus:ring-[#8c5a35]" />
                    <span className="text-sm font-bold text-gray-800">Mark as Featured</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" name="isBestSeller" checked={formData.isBestSeller === '1'} onChange={handleInputChange} className="w-5 h-5 rounded text-[#8c5a35] focus:ring-[#8c5a35]" />
                    <span className="text-sm font-bold text-gray-800">Mark as Best Seller</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><ImageIcon size={20} className="text-[#8c5a35]"/> Product Media</h2>

              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Thumbnail Image *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#8c5a35] transition-colors relative">
                  {thumbnailPreview ? (
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden group">
                      <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center">
                        <label className="cursor-pointer bg-white text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                          Change
                          <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailChange} />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8">
                      <UploadCloud size={32} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 font-medium mb-1">Upload Main Image</p>
                      <label className="cursor-pointer text-[#8c5a35] text-xs font-bold hover:underline">
                        Browse File
                        <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailChange} />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Gallery Images</label>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {imagesPreview.map((src, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg border border-gray-200 overflow-hidden group">
                      <img src={src} alt="Gallery" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-[#8c5a35] transition-colors relative cursor-pointer bg-gray-50">
                    <UploadCloud size={24} className="text-gray-400" />
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" multiple onChange={handleImagesChange} />
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 text-center">You can upload multiple images at once.</p>
              </div>

            </div>

          </div>
        </div>
      </form>
    </div>
  );
}
