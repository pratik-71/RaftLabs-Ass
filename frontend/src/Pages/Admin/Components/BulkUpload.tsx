import React, { useState, useRef } from 'react';
import { Upload, Download, Image as ImageIcon, X, CheckCircle2, AlertCircle } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { supabase } from '../../../Config/supabase';
import { toast } from 'react-hot-toast';
import { BACKEND_URL } from '../../../Config/api';
import { CATEGORIES } from './AddProduct';

interface BulkProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  items: string[];
  stock: number;
  imageFile: File | null;
  imagePreview: string | null;
  status: 'pending' | 'uploading' | 'success' | 'error';
  errorMsg?: string;
}

export default function BulkUpload() {
  const [products, setProducts] = useState<BulkProduct[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = () => {
    const template = [
      {
        name: "Classic Burger",
        description: "Delicious double patty burger with special sauce.",
        price: 12.99,
        category: "Burger",
        items: ["patty", "tomato", "cheese", "lettuce"],
        stock: 50
      },
      {
        name: "Spicy Noodles",
        description: "Hot and spicy noodles tossed in special wok sauce.",
        price: 8.50,
        category: "Chinese",
        items: ["noodles", "sauce", "veggies"],
        stock: 100
      }
    ];
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(template, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "bulk_upload_template.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleJSONUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!Array.isArray(json)) {
          toast.error("JSON file must contain an array of products.");
          return;
        }

        const parsedProducts: BulkProduct[] = json.map((item, index) => ({
          _id: `temp_${Date.now()}_${index}`,
          name: item.name || '',
          description: item.description || '',
          price: parseFloat(item.price) || 0,
          category: item.category || CATEGORIES[0],
          items: Array.isArray(item.items) ? item.items : (typeof item.items === 'string' ? item.items.split(',') : []),
          stock: parseInt(item.stock) || 0,
          imageFile: null,
          imagePreview: null,
          status: 'pending'
        }));

        setProducts(parsedProducts);
        toast.success(`Loaded ${parsedProducts.length} products from JSON`);
      } catch (err) {
        toast.error("Invalid JSON file");
      }
    };
    reader.readAsText(file);
    
    // reset input
    if (e.target) e.target.value = '';
  };

  const handleImageChange = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(file, options);
        const previewUrl = URL.createObjectURL(compressedFile);
        
        setProducts(prev => prev.map(p => 
          p._id === id ? { ...p, imageFile: compressedFile, imagePreview: previewUrl } : p
        ));
      } catch (error) {
        console.error("Error compressing image:", error);
        toast.error('Failed to compress image.');
      }
    }
  };

  const removeProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p._id !== id));
  };

  const removeImage = (id: string) => {
    setProducts(prev => prev.map(p => 
      p._id === id ? { ...p, imageFile: null, imagePreview: null } : p
    ));
  };

  const handleSaveAll = async () => {
    const pendingProducts = products.filter(p => p.status === 'pending' || p.status === 'error');
    if (pendingProducts.length === 0) {
      toast.error("No pending products to upload.");
      return;
    }

    setIsUploading(true);
    let successCount = 0;

    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      if (p.status === 'success') continue;

      // Mark as uploading
      setProducts(prev => prev.map((item, idx) => idx === i ? { ...item, status: 'uploading' } : item));

      try {
        let imageUrl = '';

        if (p.imageFile) {
          const fileExt = p.imageFile.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, p.imageFile);

          if (uploadError) throw uploadError;

          const { data: publicUrlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

          imageUrl = publicUrlData.publicUrl;
        }

        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        const response = await fetch(`${BACKEND_URL}/api/products`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({
            name: p.name,
            description: p.description,
            price: p.price,
            category: p.category,
            items: p.items,
            stock: p.stock,
            imageUrl
          })
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to save to database');
        }

        // Mark as success
        setProducts(prev => prev.map((item, idx) => idx === i ? { ...item, status: 'success' } : item));
        successCount++;
        
      } catch (err: any) {
        console.error(err);
        setProducts(prev => prev.map((item, idx) => idx === i ? { ...item, status: 'error', errorMsg: err.message } : item));
      }
    }

    setIsUploading(false);
    toast.success(`Successfully uploaded ${successCount} products!`);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold">Bulk Upload Products</h2>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={handleDownloadTemplate}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Download size={18} />
            Template
          </button>
          
          <label className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-md cursor-pointer">
            <Upload size={18} />
            Upload JSON
            <input type="file" accept=".json" className="hidden" onChange={handleJSONUpload} ref={fileInputRef} />
          </label>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {products.map((product) => (
              <div key={product._id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row gap-6 relative">
                
                {product.status !== 'success' && !isUploading && (
                  <button onClick={() => removeProduct(product._id)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
                    <X size={20} />
                  </button>
                )}

                {/* Left: Data */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between pr-8">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{product.name || 'Unnamed Product'}</h3>
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-md mt-1">{product.category}</span>
                    </div>
                    <div className="font-black text-lg text-primary">
                      ₹{product.price.toFixed(2)}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                  
                  <div className="text-xs text-gray-500 font-medium bg-gray-50 p-2 rounded-lg border border-gray-100">
                    Items: {product.items.join(', ')} <br/>
                    Stock: {product.stock}
                  </div>

                  {/* Status Indicator */}
                  <div className="pt-2">
                    {product.status === 'uploading' && <span className="text-blue-500 text-sm font-bold flex items-center gap-1"><div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div> Uploading...</span>}
                    {product.status === 'success' && <span className="text-green-500 text-sm font-bold flex items-center gap-1"><CheckCircle2 size={16} /> Uploaded Successfully</span>}
                    {product.status === 'error' && <span className="text-red-500 text-sm font-bold flex items-center gap-1"><AlertCircle size={16} /> Error: {product.errorMsg}</span>}
                  </div>
                </div>

                {/* Right: Image Upload */}
                <div className="w-full md:w-48 shrink-0">
                  <div className={`relative h-32 w-full rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-colors ${product.imagePreview ? 'border-transparent bg-gray-50' : 'border-gray-300 hover:border-primary'}`}>
                    
                    {product.imagePreview ? (
                      <>
                        <img src={product.imagePreview} alt="Preview" className="w-full h-full object-contain mix-blend-multiply" />
                        {product.status !== 'success' && !isUploading && (
                          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                            <button onClick={() => removeImage(product._id)} className="p-2 bg-white text-red-500 rounded-full shadow-lg">
                              <X size={18} />
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-primary">
                        <ImageIcon size={28} />
                        <span className="text-xs font-bold mt-2">Attach Image</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleImageChange(product._id, e)} 
                          disabled={product.status === 'success' || isUploading}
                        />
                      </label>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Submit Action */}
          <div className="sticky bottom-4 pt-4 flex justify-end bg-surface/80 backdrop-blur-md rounded-xl p-4 border border-border shadow-sm">
            <button 
              onClick={handleSaveAll}
              disabled={isUploading || products.every(p => p.status === 'success')}
              className="bg-primary hover:bg-primaryHover text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-md disabled:opacity-50 flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading All...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  Save {products.filter(p => p.status !== 'success').length} Products
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <Upload className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-900">No products loaded</h3>
          <p className="text-gray-500 mt-1 max-w-md mx-auto text-sm">Download the template, fill it with your data, and upload the JSON file here to get started.</p>
        </div>
      )}
    </div>
  );
}
