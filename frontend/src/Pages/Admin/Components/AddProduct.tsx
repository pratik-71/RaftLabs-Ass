import React, { useState, useRef } from 'react';
import { Plus, X, Image as ImageIcon } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { supabase } from '../../../Config/supabase';
import { toast } from 'react-hot-toast';
import { productSchema, validateData } from '../../../Utils/validators';
import { BACKEND_URL } from '../../../Config/api';

export const CATEGORIES = ['Burger', 'Pizza', 'Coffee', 'Tacos', 'Burritos', 'Sandwich', 'Sub', 'Cold drink', 'Wraps', 'Momos'];

export default function AddProduct() {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [items, setItems] = useState(''); // comma separated
  const [stock, setStock] = useState('0');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsCompressing(true);
      
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(file, options);
        setImageFile(compressedFile);
        setImagePreview(URL.createObjectURL(compressedFile));
      } catch (error) {
        console.error("Error compressing image:", error);
        toast.error('Failed to compress image. Please try another.');
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate with Zod like a python serializer
    const validation = validateData(productSchema, {
      name: productName,
      description,
      price: parseFloat(price) || 0,
      category,
      items,
      stock: parseInt(stock, 10) || 0
    });

    if (validation.success === false) {
      toast.error(validation.error);
      return;
    }

    setIsUploading(true);

    try {
      let imageUrl = '';

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile);

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      // Save to Express backend
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      const response = await fetch(`${BACKEND_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: productName,
          description,
          price: parseFloat(price),
          category,
          items: items.split(',').map(i => i.trim()),
          stock: parseInt(stock, 10) || 0,
          imageUrl
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to save product to database');
      }

      toast.success('Product added successfully!');
      
      // Reset form
      setProductName('');
      setDescription('');
      setPrice('');
      setCategory(CATEGORIES[0]);
      setItems('');
      setStock('0');
      handleRemoveImage();

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'An error occurred while saving the product.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Add New Product</h2>

      <form className="w-full space-y-6" onSubmit={handleAddProduct}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-textMain mb-2">Product Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-surface" 
              placeholder="e.g. Double Cheeseburger" 
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-textMain mb-2">Category</label>
            <select 
              className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-surface"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-textMain mb-2">Short Description</label>
          <textarea 
            rows={3} 
            className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-surface" 
            placeholder="Delicious double patty burger with special sauce..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-textMain mb-2">Price (₹)</label>
            <input 
              type="number" 
              step="0.01" 
              className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-surface" 
              placeholder="9.99" 
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-textMain mb-2">Items Included (comma separated)</label>
            <input 
              type="text" 
              className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-surface" 
              placeholder="e.g. patty, tomato, cheese, lettuce" 
              value={items}
              onChange={(e) => setItems(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-textMain mb-2">Stock Quantity</label>
          <input 
            type="number" 
            className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-surface" 
            placeholder="e.g. 50" 
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-textMain mb-2">Product Image (Compressed Automatically)</label>
          
          <div className="mt-2 flex justify-center rounded-xl border border-dashed border-gray-300 px-6 py-10 bg-surface relative overflow-hidden transition-colors hover:border-primary">
            {(imagePreview || isCompressing || isUploading) ? (
              <div className="relative group w-full flex justify-center items-center h-48">
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className={`max-h-64 object-contain rounded-lg ${(isCompressing || isUploading) ? 'opacity-50' : ''}`} />
                )}
                
                {(isCompressing || isUploading) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 rounded-lg">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="mt-2 text-sm font-semibold text-primary">
                      {isCompressing ? 'Compressing...' : 'Uploading...'}
                    </span>
                  </div>
                )}

                {imagePreview && !isUploading && !isCompressing && (
                  <button 
                    type="button" 
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-transparent font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primaryHover"
                  >
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} ref={fileInputRef} />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="pt-4 flex justify-end">
          <button 
            type="submit" 
            disabled={isUploading}
            className="bg-primary hover:bg-primaryHover text-white px-10 py-3 rounded-xl font-bold transition-colors shadow-md disabled:opacity-70 flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Uploading & Saving...
              </>
            ) : (
              <>
                <Plus size={20} />
                Save Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
