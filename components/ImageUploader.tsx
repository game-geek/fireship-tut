import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage'
import { ChangeEvent, FC, useContext, useState } from 'react'
import { UserContext } from '../lib/context'
import { storage } from '../lib/firebase'

interface props {

}

const ImageUploader:FC<props> = ({ }) => {
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [downloadURL, setDownloadURL] = useState<null | string>(null)
    const { user } = useContext(UserContext)

    async function uploadFile(e: ChangeEvent<HTMLInputElement>) {
      if (!e.target.files || !user) {
        console.log("no file uploaded")
        return
      }
      // Get the file
      const file = Array.from(e.target.files)[0]
      const extension = file.type.split('/')[1]


      // Makes a reference to the storage bucket loaction
      console.log(`uploads/${user.uid}/${Date.now()}.${extension}`)
      const storageRef = ref(storage, `uploads/${user.uid}/${Date.now()}.${extension}`);
      setUploading(true)

      // Starts upload
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Listen to updates to upload task
      uploadTask.on('state_changed', (snapshot) => {
        // progress
          const progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
          console.log('Upload is ' + progress + '% done');
          setProgress(Number(progress))
        }, (error) => {
          // errors
          console.log("ERROR:", error, error.message)
        }, () => {
          // Get downloadURL AFTER task resolves (Note: this is not a Native Promise)
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            setDownloadURL(downloadURL)
            setUploading(false)
          });
        })
    }

  return (
    <div className='box'>
        {!uploading && (
          <>
            <label className="btn">
              📸 Upload Img
              <input type="file" onChange={uploadFile} accept="image/x-png,image/gif,image/jpeg" />
            </label>
          </>
        )}

        {downloadURL && <code className='upload-snippet'>{`![alt](${downloadURL})`}</code>}
    </div>
  )
}

export default ImageUploader