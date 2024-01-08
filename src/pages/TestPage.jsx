import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";

export default function TestPage() {
  const [files, setFiles] = useState([]);
    const onDrop = useCallback(
      (acceptedFiles) => {
        setFiles(
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          )
        );

        const form = new FormData();

        form.append("fileUpload", acceptedFiles[0]);


        fetch("http://localhost:3000/upload", {
          method: "POST",
          body: form,
        });

      },
      [setFiles]
    );

  useEffect(
    () => () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/*",
    onDrop
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
      <div>
        {files.map((file, index) => (
          <div key={file.name}>
            <img
              src={file.preview}
              style={{ width: "100px", height: "100px" }}
              alt=""
            />
          </div>
        ))}
      </div>
    </div>
  );
}
