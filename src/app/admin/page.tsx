"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface ProductForm {
  title: string;
  description: string;
  price: string;
  unit: string;
  quantity: string;
  category: string;
  location: string;
  imageUrl: string;
  sellerEmail: string;
}

const CATEGORIES = [
  { value: "vegetables", label: "🌽 Vegetables", icon: "🌽" },
  { value: "fruits", label: "🍌 Fruits", icon: "🍌" },
  { value: "grains", label: "🌾 Grains", icon: "🌾" },
  { value: "livestock", label: "🐄 Livestock", icon: "🐄" },
  { value: "dairy", label: "🥛 Dairy", icon: "🥛" },
  { value: "poultry", label: "🐔 Poultry", icon: "🐔" },
  { value: "herbs", label: "🌿 Herbs", icon: "🌿" },
  { value: "tubers", label: "🥔 Tubers", icon: "🥔" },
];

const KENYAN_LOCATIONS = [
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Malindi", "Kitale",
  "Kakamega", "Nyeri", "Machakos", "Embu", "Meru", "Kisii", "Bungoma", "Busia",
  "Vihiga", "Siaya", "Migori", "Homa Bay", "Kericho", "Bomet", "Narok", "Kajiado",
  "Kiambu", "Murang'a", "Kirinyaga", "Nyeri", "Laikipia", "Nakuru", "Baringo",
  "Elgeyo Marakwet", "West Pokot", "Samburu", "Turkana", "Marsabit", "Isiolo",
  "Mandera", "Wajir", "Garissa", "Tana River", "Lamu", "Kilifi", "Kwale", "Taita Taveta"
];

export default function AdminPage() {
  const [form, setForm] = useState<ProductForm>({
    title: "",
    description: "",
    price: "",
    unit: "kg",
    quantity: "1",
    category: "",
    location: "",
    imageUrl: "",
    sellerEmail: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // In a real app, you'd upload to a cloud service
      // For now, we'll create a local URL
      const imageUrl = URL.createObjectURL(file);
      setForm(prev => ({ ...prev, imageUrl }));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false
  });

  const handleLocationChange = (value: string) => {
    setForm(prev => ({ ...prev, location: value }));
    
    if (value.length > 2) {
      const filtered = KENYAN_LOCATIONS.filter(location =>
        location.toLowerCase().includes(value.toLowerCase())
      );
      setLocationSuggestions(filtered.slice(0, 5));
      setShowLocationSuggestions(filtered.length > 0);
    } else {
      setShowLocationSuggestions(false);
    }
  };

  const selectLocation = (location: string) => {
    setForm(prev => ({ ...prev, location }));
    setShowLocationSuggestions(false);
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          quantity: Number(form.quantity),
        }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Failed to create product");
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      setMsg("Product created successfully! 🎉");
      setForm({
        title: "",
        description: "",
        price: "",
        unit: "kg",
        quantity: "1",
        category: "",
        location: "",
        imageUrl: "",
        sellerEmail: "",
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setMsg(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }

  function bind<K extends keyof ProductForm>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((s) => ({ ...s, [key]: e.target.value }));
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12 animate-fade-in-up">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <span className="text-6xl">👨‍🌾</span>
          <h1 className="text-5xl font-bold text-[#2d5016]">Product Management</h1>
          <span className="text-6xl">🌾</span>
        </div>
        <p className="text-xl text-[#8b4513] max-w-2xl mx-auto">
          Add fresh produce to your marketplace and connect with buyers directly
        </p>
      </div>
      
      <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Info Card */}
          <div className="card p-6 animate-fade-in-up">
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-3xl">📝</span>
              <h2 className="text-2xl font-bold text-[#2d5016]">Product Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#2d5016] mb-2">Product Title</label>
                <input 
                  value={form.title} 
                  onChange={bind("title")} 
                  className="form-input w-full" 
                  placeholder="e.g. Fresh Organic Tomatoes" 
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-[#2d5016] mb-2">Category</label>
                <select 
                  value={form.category} 
                  onChange={bind("category")} 
                  className="form-input w-full"
                  required
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-semibold text-[#2d5016] mb-2">Description</label>
              <textarea 
                value={form.description} 
                onChange={bind("description")} 
                className="form-input w-full resize-none" 
                rows={4}
                placeholder="Describe your product in detail..."
                required
              />
            </div>
          </div>

          {/* Pricing & Availability Card */}
          <div className="card p-6 animate-fade-in-up">
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-3xl">💰</span>
              <h2 className="text-2xl font-bold text-[#2d5016]">Pricing & Availability</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#2d5016] mb-2">Price (KES)</label>
                <input 
                  value={form.price} 
                  onChange={bind("price")} 
                  type="number" 
                  min="0"
                  step="0.01"
                  className="form-input w-full" 
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-[#2d5016] mb-2">Unit</label>
                <select 
                  value={form.unit} 
                  onChange={bind("unit")} 
                  className="form-input w-full"
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="bag">Bag</option>
                  <option value="crate">Crate</option>
                  <option value="piece">Piece</option>
                  <option value="bundle">Bundle</option>
                  <option value="litre">Litre (L)</option>
                  <option value="dozen">Dozen</option>
                  <option value="ton">Ton</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-[#2d5016] mb-2">Quantity Available</label>
                <input 
                  value={form.quantity} 
                  onChange={bind("quantity")} 
                  type="number" 
                  min="1"
                  className="form-input w-full" 
                  placeholder="1"
                  required
                />
              </div>
            </div>
          </div>

          {/* Location & Media Card */}
          <div className="card p-6 animate-fade-in-up">
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-3xl">📍</span>
              <h2 className="text-2xl font-bold text-[#2d5016]">Location & Media</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-semibold text-[#2d5016] mb-2">Location</label>
                <input 
                  value={form.location} 
                  onChange={(e) => handleLocationChange(e.target.value)}
                  className="form-input w-full" 
                  placeholder="e.g. Nakuru, Eldoret, Nairobi" 
                  required
                />
                
                {showLocationSuggestions && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-[#d2b48c] rounded-lg shadow-lg z-10 mt-1">
                    {locationSuggestions.map((location, index) => (
                      <button
                        key={index}
                        onClick={() => selectLocation(location)}
                        className="w-full text-left px-4 py-2 hover:bg-[#fdf6e3] transition-colors duration-200"
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-[#2d5016] mb-2">Seller Email</label>
                <input 
                  type="email"
                  value={form.sellerEmail}
                  onChange={bind("sellerEmail")}
                  className="form-input w-full"
                  placeholder="seller@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2d5016] mb-2">Image Upload</label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
                    isDragActive 
                      ? 'border-[#2d5016] bg-[#fdf6e3]' 
                      : 'border-[#d2b48c] hover:border-[#2d5016] hover:bg-[#fdf6e3]'
                  }`}
                >
                  <input {...getInputProps()} />
                  {form.imageUrl ? (
                    <div className="space-y-2">
                      <img src={form.imageUrl} alt="Preview" className="w-20 h-20 object-cover rounded-lg mx-auto" />
                      <p className="text-sm text-[#8b4513]">Click to change image</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <span className="text-4xl">📸</span>
                      <p className="text-[#8b4513]">
                        {isDragActive ? 'Drop the image here' : 'Drag & drop an image, or click to select'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-6">
            <button
              disabled={loading}
              className="btn-primary text-lg px-8 py-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating Product...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>🌱</span>
                  <span>Save Product</span>
                  <span>🌱</span>
                </div>
              )}
            </button>
          </div>

          {/* Message Display */}
          {msg && (
            <div className={`mt-4 p-4 rounded-xl text-center font-medium ${
              msg.includes('Error') 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {msg}
            </div>
          )}
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24 animate-slide-in-right">
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-3xl">👁️</span>
              <h2 className="text-2xl font-bold text-[#2d5016]">Live Preview</h2>
            </div>
            
            <div className="bg-[#fdf6e3] rounded-xl p-4 border border-[#d2b48c]">
              {form.title ? (
                <div className="space-y-4">
                  {form.imageUrl && (
                    <div className="relative w-full h-48 overflow-hidden rounded-lg">
                      <img
                        src={form.imageUrl}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-[#2d5016] line-clamp-2">
                      {form.title || "Product Title"}
                    </h3>
                    
                    {form.description && (
                      <p className="text-sm text-[#8b4513] line-clamp-3">
                        {form.description}
                      </p>
                    )}
                    
                    <div className="space-y-1 text-sm">
                      {form.price && (
                        <div className="flex justify-between">
                          <span className="text-[#8b4513]">Price:</span>
                          <span className="font-bold text-[#2d5016]">KES {form.price}</span>
                        </div>
                      )}
                      
                      {form.unit && (
                        <div className="flex justify-between">
                          <span className="text-[#8b4513]">Per:</span>
                          <span className="text-[#2d5016]">{form.unit}</span>
                        </div>
                      )}
                      
                      {form.quantity && (
                        <div className="flex justify-between">
                          <span className="text-[#8b4513]">Available:</span>
                          <span className="text-[#2d5016]">{form.quantity}</span>
                        </div>
                      )}
                      
                      {form.category && (
                        <div className="flex justify-between">
                          <span className="text-[#8b4513]">Category:</span>
                          <span className="text-[#2d5016]">
                            {CATEGORIES.find(c => c.value === form.category)?.icon} {form.category}
                          </span>
                        </div>
                      )}
                      
                      {form.location && (
                        <div className="flex justify-between">
                          <span className="text-[#8b4513]">Location:</span>
                          <span className="text-[#2d5016]">{form.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-[#8b4513]">
                  <span className="text-4xl block mb-2">👀</span>
                  <p>Fill in the form to see a live preview of your product card</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* Success Animation */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="animate-bounce-in">
            <div className="bg-green-500 text-white rounded-full w-24 h-24 flex items-center justify-center text-4xl shadow-2xl">
              ✅
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
