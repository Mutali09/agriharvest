"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  unit: string;
  quantity: number;
  category: string | null;
  location: string;
  imageUrl: string | null;
  createdAt: Date;
  sellerEmail?: string | null;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [contactModal, setContactModal] = useState<{ show: boolean; product: Product | null }>({
    show: false,
    product: null
  });
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; product: Product | null }>({
    show: false,
    product: null
  });
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleContactSeller = (product: Product) => {
    setContactModal({ show: true, product });
  };

  const handleDeleteProduct = (product: Product) => {
    setDeleteModal({ show: true, product });
  };

  const confirmDelete = async () => {
    if (!deleteModal.product) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/products?id=${deleteModal.product.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Remove the product from the local state
        setProducts(products.filter(p => p.id !== deleteModal.product!.id));
        alert('Product deleted successfully!');
        setDeleteModal({ show: false, product: null });
      } else {
        const error = await response.json();
        alert(`Failed to delete product: ${error.error}`);
      }
    } catch (error) {
      alert('Failed to delete product. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: contactModal.product?.id,
          buyerName: contactForm.name,
          buyerEmail: contactForm.email,
          buyerPhone: contactForm.phone || undefined,
          message: contactForm.message,
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to send message');
      }

      alert('Message sent successfully! The seller has been notified.');
      setContactModal({ show: false, product: null });
      setContactForm({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryIcon = (category: string | null) => {
    if (!category) return "🌾";
    const icons: { [key: string]: string } = {
      vegetables: "🌽",
      fruits: "🍌",
      grains: "🌾",
      livestock: "🐄",
      dairy: "🥛",
      poultry: "🐔",
      herbs: "🌿",
      tubers: "🥔"
    };
    return icons[category] || "🌾";
  };

  return (
    <div>
      <div className="text-center mb-12 animate-fade-in-up">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <span className="text-6xl">🌾</span>
          <h1 className="text-5xl font-bold text-[#2d5016] mb-4">Fresh from the Farm</h1>
          <span className="text-6xl">🚜</span>
        </div>
        <p className="text-xl text-[#8b4513] max-w-2xl mx-auto">
          Discover fresh, locally grown produce directly from Kenyan farmers. 
          Quality you can trust, delivered to your doorstep.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 animate-fade-in-up">
          <div className="text-6xl mb-4">🌱</div>
          <h2 className="text-2xl font-semibold text-[#2d5016] mb-2">No products yet</h2>
          <p className="text-[#8b4513] mb-6">Be the first to add fresh produce to our marketplace!</p>
          <Link 
            href="/admin" 
            className="btn-primary text-lg px-8 py-4 inline-block"
          >
            🌱 Add Your First Product 🌱
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((p, index) => (
            <div 
              key={p.id} 
              className="card overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {p.imageUrl ? (
                <div className="relative w-full h-48 overflow-hidden">
                  <Image
                    src={p.imageUrl}
                    alt={p.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-[#fdf6e3] to-[#d2b48c] flex items-center justify-center">
                  <span className="text-4xl">{getCategoryIcon(p.category)}</span>
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-bold text-xl text-[#2d5016] line-clamp-2">{p.title}</h2>
                  {p.category && (
                    <span className="text-2xl" title={p.category}>
                      {getCategoryIcon(p.category)}
                    </span>
                  )}
                </div>
                
                <p className="text-[#8b4513] text-sm mb-4 line-clamp-2">{p.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8b4513]">Price:</span>
                    <span className="font-bold text-[#2d5016] text-lg">KES {p.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8b4513]">Per:</span>
                    <span className="font-medium text-[#2d5016]">{p.unit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8b4513]">Available:</span>
                    <span className="font-medium text-[#2d5016]">{p.quantity}</span>
                  </div>
                  {p.category && (
                    <div className="flex items-center justify-between">
                      <span className="text-[#8b4513]">Category:</span>
                      <span className="font-medium text-[#2d5016] capitalize">{p.category}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-[#8b4513]">Location:</span>
                    <span className="font-medium text-[#2d5016]">{p.location}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={() => handleContactSeller(p)}
                    className="flex-1 bg-gradient-to-r from-[#2d5016] to-[#8b4513] text-white py-2 px-4 rounded-lg hover:from-[#8b4513] hover:to-[#2d5016] transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    📞 Contact Seller
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(p)}
                    className="px-4 py-2 bg-[#c0392b] text-white rounded-lg hover:bg-[#a93226] transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    title="Delete Product"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contact Seller Modal */}
      {contactModal.show && contactModal.product && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card p-8 max-w-md w-full max-h-[90vh] overflow-y-auto animate-bounce-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#2d5016]">Contact Seller</h2>
              <button
                onClick={() => setContactModal({ show: false, product: null })}
                className="text-[#8b4513] hover:text-[#2d5016] text-2xl transition-colors duration-200"
              >
                ×
              </button>
            </div>
            
            <div className="mb-6 p-4 bg-[#fdf6e3] rounded-lg border border-[#d2b48c]">
              <h3 className="font-semibold text-[#2d5016] mb-2">{contactModal.product.title}</h3>
              <p className="text-sm text-[#8b4513]">Location: {contactModal.product.location}</p>
              <p className="text-sm text-[#8b4513]">Price: KES {contactModal.product.price.toLocaleString()} / {contactModal.product.unit}</p>
            </div>

            <form onSubmit={handleSubmitContact} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#2d5016] mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="form-input w-full"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-[#2d5016] mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="form-input w-full"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-[#2d5016] mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  className="form-input w-full"
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-[#2d5016] mb-1">Message *</label>
                <textarea
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="form-input w-full resize-none"
                  placeholder="Tell the seller what you're interested in..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setContactModal({ show: false, product: null })}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex-1 disabled:opacity-60"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && deleteModal.product && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card p-8 max-w-md w-full animate-bounce-in">
            <div className="text-center">
              <div className="text-6xl mb-4">🗑️</div>
              <h2 className="text-2xl font-bold text-[#2d5016] mb-4">Delete Product</h2>
              <p className="text-[#8b4513] mb-6">
                Are you sure you want to delete <strong>"{deleteModal.product.title}"</strong>? 
                This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal({ show: false, product: null })}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="bg-[#c0392b] text-white px-4 py-2 rounded-lg hover:bg-[#a93226] disabled:opacity-60 transition-all duration-200 flex-1"
                >
                  {isDeleting ? "Deleting..." : "Delete Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}