import React, { useState } from 'react';
import { X, Upload, AlertTriangle } from 'lucide-react';

interface BulkUploadModalProps {
  onClose: () => void;
  onUpload: (data: any[]) => void;
}

export function BulkUploadModal({ onClose, onUpload }: BulkUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/json') {
        setError('Please upload a JSON file');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          onUpload(data);
          onClose();
        } catch (error) {
          setError('Invalid JSON format');
        }
      };
      reader.readAsText(file);
    } catch (error) {
      setError('Error reading file');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full m-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Bulk Upload Products</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <span className="text-gray-600">
                {file ? file.name : 'Click to upload JSON file'}
              </span>
            </label>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">File Format</h3>
            <p className="text-sm text-blue-600">
              Upload a JSON file containing an array of products with the following structure:
            </p>
            <pre className="mt-2 text-xs bg-blue-100 p-2 rounded overflow-x-auto">
{`[
  {
    "name": "Product Name",
    "sku": "SKU123",
    "price": 100,
    "availableQuantity": 50,
    "category": "Category",
    "image": "URL",
    "availableColors": ["#FFFFFF"]
  }
]`}
            </pre>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!file}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              Upload Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}