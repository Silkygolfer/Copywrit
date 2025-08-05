import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@clerk/nextjs';

interface UseFileUploadProps {
  businessId: string;
}

export const useFileUpload = ({ businessId }: UseFileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { getToken } = useAuth();

  const uploadFile = useCallback(async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);
      formData.append('businessId', businessId);

      const token = await getToken({ template: "convex" });

      const response = await fetch(`${process.env.NEXT_PUBLIC_CONVEX_SITE_URL}/api/upload`, {
        method: "POST",
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const { error } = await response.json();
        toast.error('Failed to upload file.', {
          description: error
        });
        return;
      }
      
      const data = await response.json();
      toast.success('File uploaded successfully!');
      return data;
    } catch (error) {
      console.error('File upload failed:', error);
      toast.error('Failed to upload file. Please try again.');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [businessId, getToken]);

  const openFilePicker = useCallback(() => {
    const input = document.createElement('input'); 
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.txt,.md';
    
    input.onchange = async (event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        await uploadFile(target.files[0]);
      }
    };
    
    input.click();
  }, [uploadFile]);

  return {
    openFilePicker,
    isUploading,
    uploadProgress: {},
  };
}; 