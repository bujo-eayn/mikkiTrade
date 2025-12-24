'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Upload,
  X,
  Save,
  Eye
} from 'lucide-react';

export default function NewVehiclePage() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate save
    setTimeout(() => {
      router.push('/admin/vehicles');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Badge */}
      {/* <div className="fixed top-4 right-4 bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-semibold shadow-lg z-50">
        🎬 DEMO MODE
      </div> */}

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="p-6">
          <Link href="/admin/vehicles" className="text-[#a235c3] hover:text-[#8b2da3] font-semibold flex items-center space-x-2 mb-4">
            <ChevronLeft size={16} />
            <span>Back to Vehicles</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Add New Vehicle</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in the details to add a new vehicle to your inventory</p>
        </div>
      </div>

      {/* Form */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Make *</label>
                    <input
                      type="text"
                      placeholder="e.g., Toyota"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a235c3] focus:border-transparent text-gray-900 placeholder:text-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                    <input
                      type="text"
                      placeholder="e.g., Camry"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a235c3] focus:border-transparent text-gray-900 placeholder:text-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                    <input
                      type="number"
                      placeholder="2023"
                      min="1900"
                      max="2100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a235c3] focus:border-transparent text-gray-900 placeholder:text-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (KES) *</label>
                    <input
                      type="number"
                      placeholder="3200000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a235c3] focus:border-transparent text-gray-900 placeholder:text-gray-400"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Vehicle Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mileage (km)</label>
                    <input
                      type="number"
                      placeholder="50000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a235c3] focus:border-transparent text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a235c3] focus:border-transparent text-gray-900">
                      <option>Manual</option>
                      <option>Automatic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a235c3] focus:border-transparent text-gray-900">
                      <option>Petrol</option>
                      <option>Diesel</option>
                      <option>Hybrid</option>
                      <option>Electric</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Body Type</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a235c3] focus:border-transparent text-gray-900">
                      <option>Sedan</option>
                      <option>SUV</option>
                      <option>Hatchback</option>
                      <option>Truck</option>
                      <option>Van</option>
                      <option>Coupe</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                    <input
                      type="text"
                      placeholder="e.g., Silver"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a235c3] focus:border-transparent text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Description & Features</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      rows={5}
                      placeholder="Describe the vehicle condition, features, history, etc."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a235c3] focus:border-transparent text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Features (one per line)</label>
                    <textarea
                      rows={4}
                      placeholder="Leather Seats&#10;Sunroof&#10;Navigation System&#10;Backup Camera"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a235c3] focus:border-transparent text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Vehicle Images</h2>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#a235c3] transition-colors">
                    <input
                      type="file"
                      id="image-upload"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                      <p className="text-gray-600 font-semibold mb-2">Click to upload images</p>
                      <p className="text-sm text-gray-400">PNG, JPG, WebP up to 5MB each</p>
                      <p className="text-xs text-gray-400 mt-2">Upload up to 10 images per vehicle</p>
                    </label>
                  </div>

                  {images.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                      {images.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img}
                            alt={`Vehicle ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                          {index === 0 && (
                            <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                              Primary
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publish Settings */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Publish Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a235c3] focus:border-transparent text-gray-900">
                      <option value="available">Available</option>
                      <option value="reserved">Reserved</option>
                      <option value="sold">Sold</option>
                      <option value="coming_soon">Coming Soon</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      className="w-4 h-4 text-[#a235c3] focus:ring-[#a235c3] border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="text-sm text-gray-700">
                      Featured (Show in New Arrivals)
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="on-deal"
                      className="w-4 h-4 text-[#a235c3] focus:ring-[#a235c3] border-gray-300 rounded"
                    />
                    <label htmlFor="on-deal" className="text-sm text-gray-700">
                      On Deal (Show in Promotions)
                    </label>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Tags</h2>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Add tags (comma separated)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a235c3] focus:border-transparent text-gray-900 placeholder:text-gray-400"
                  />
                  <p className="text-xs text-gray-400">e.g., luxury, family-car, fuel-efficient</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-gradient-to-r from-[#a235c3] to-[#2b404f] text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      <span>Save & Publish</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 flex items-center justify-center space-x-2"
                >
                  <Eye size={20} />
                  <span>Save as Draft</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
