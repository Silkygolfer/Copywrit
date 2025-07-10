import { Loader2, Upload } from "lucide-react"

export default function ContextUploadButton({openFilePicker, isUploading}: {openFilePicker: () => void, isUploading: boolean}) {
    return (
        <>
            {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
                <Upload className="h-4 w-4 mr-2" />
            )}
            <span>{isUploading ? 'Uploading...' : 'Add Context'}</span>
        </>
    )
}