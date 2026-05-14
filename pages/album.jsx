import { useRouter } from "next/router";
import React, { useState, useEffect } from 'react'
// import { useDropzone } from 'react-dropzone'
import { FaPlus } from 'react-icons/fa'
import Dropzone from 'react-dropzone'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

const Album = () => {
  const router = useRouter();
  const { albumId } = router.query;

  const [files, setFiles] = useState([])

  const onDrop = async (acceptedFiles) => {
    setFiles(acceptedFiles)

    acceptedFiles.forEach(async (file) => {
      const formData = new FormData()
      formData.append('file', file, file.name)
      formData.append('id', uuidv4())

      try {
        const response = await axios.post('/api/images/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        if (response.status === 200) {
          router.reload()
        }
      } catch (err) {
        console.error(err)
      }
    })

    // router.reload()

  }


  // useEffect(() => {
  //   if (files.length > 0) {
  //     router.reload()
  //   }
  // }, [files])
  
  // const [files, setFiles] = useState([])
  // const [uploadProgress, setUploadProgress] = useState({})
  // const [uploading, setUploading] = useState(false)

  // const { getRootProps, getInputProps } = useDropzone({
    
    // onDrop: acceptedFiles => {
      // setUploading(true)
      // setFiles([...files, ...acceptedFiles])
      // acceptedFiles.forEach( file => {
        // const formData = new FormData()
        // formData.append('image', file)
        // try {
          // const { data } = await axios.post('/api/images', formData, {
          //   headers: { 'Content-Type': 'multipart/form-data' },
          //   onUploadProgress: e => {
          //     if (e.lengthComputable) {
          //       setUploadProgress({ [file.path]: (e.loaded / e.total) * 100 })
          //     }
          //   }
          // })
          // setFiles([...files, file])
        // } catch (error) {
          // console.error(error)
        // }
      // })
      // setUploading(false)
    // }
  // })

  return (
    <div>
      <p>Album Detail page {albumId}</p>

      <Dropzone onDrop={onDrop}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <div className="text-center">
                <FaPlus size={32} className="text-gray-600 mx-auto"/>
                <p>Drag 'n' drop images here, or click to select images to upload</p>
              </div>
            </div>
          </section>
        )}
      </Dropzone>

      {/* <div>
        <p>Upload Images</p>

        <div className="container mx-auto p-10">
          <div {...getRootProps()} className="w-64 h-64 border border-dashed rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer">
            <input {...getInputProps()} />
            <div className="text-center">
              <FaPlus size={32} className="text-gray-600 mx-auto"/>
              <p className="text-gray-600 mt-2">Drag and drop images here, or click to select images to upload</p>
            </div>
          </div>

          <div className="mt-10">
            {files.map(file => (
              <img key={file.path} src={URL.createObjectURL(file)} alt={file.path} className="w-64 h-64 object-cover rounded-lg"/>
            ))}
          </div>


        </div>
      </div> */}

      {/* <div>
        <p>Display uploaded images</p>
        <div className="mt-10">
            {files.map(file => (
              <div key={file.path} className="relative w-64 h-64 rounded-lg overflow-hidden">
                <img src={URL.createObjectURL(file)} alt={file.path} className="w-full h-full object-cover"/>
                {uploadProgress[file.path] && (
                  <div className="absolute inset-0 bg-gray-600 opacity-75">
                    <div className="p-2 text-white text-center">{uploadProgress[file.path].toFixed(2)}%</div>
                  </div>
                )}
              </div>
            ))}
          </div>
      </div> */}
    </div>
  )
}

export default Album;