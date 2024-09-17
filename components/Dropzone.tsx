"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { db, auth, storage } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import DropzoneComponent from "react-dropzone";
import { useSession } from "next-auth/react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,  
} from
 "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Dropzone = () => {
  const { data: session } = useSession();
  // if (session) {
  //   alert(session?.user?.id);
  // }

  const [loading, setLoading] = useState(false);
  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = async () => {
        // Do whatever you want with the file contents
        await uploadPost(file);
      };
      reader.readAsArrayBuffer(file);
    });
  };
  const uploadPost = async (selectedFile: File) => {
    if (loading) return;
    if (!session?.user) return;
    setLoading(true);
    // do what needs to be done
    // addDoc -> users/user1231/files
    const docRef = await addDoc(
      collection(db, "users", session?.user?.id, "files"),
      {
        userId: session?.user?.id,
        filename: selectedFile.name,
        fullName: session?.user.name,
        profileImg: session?.user?.image,
        timestamp: serverTimestamp(),
        type: selectedFile.type,
        size: selectedFile.size,
      }
    );
    //uploading the image to firebase storage
    const imageRef = ref(
      storage,
      `users/${session?.user?.id}/files/${docRef.id}`
    );

    await uploadBytes(imageRef, selectedFile).then(async (snapshot) => {
      const downloadURL = await getDownloadURL(imageRef);

      await updateDoc(doc(db, "users", session?.user?.id, "files", docRef.id), {
        downloadURL: downloadURL,
      });
    });

    setLoading(false);
  };

  //max file size 20mb
  const maxSize = 20971520;

  return (
    <DropzoneComponent minSize={0} maxSize={maxSize} onDrop={onDrop}>
      {({
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject,
        fileRejections,
      }) => {
        const isFileTooLarge =
          fileRejections.length > 0 && fileRejections[0].file.size > maxSize;

        return (
          <section>
            <div
              {...getRootProps()}
              className={cn(
                "w-full h-52 flex justify-center items-center p-5 border border-dashed rounded-lg text-center cursor-pointer",
                isDragActive
                  ? "bg-[#035FFE] text-white animate-pulse"
                  : "bg-slate-100/50 dark:bg-slate-800/80 text-slate-400"
              )}
            >
              <input {...getInputProps()} />
              {!isDragActive && "Click here or drop a file to upload!"}
              {isDragActive && !isDragReject && "Drop to upload this file!"}
              {isDragReject && "File type not accepted, sorry!"}
              {isFileTooLarge && (
                <div className="text-danger mt-2">File is too large.</div>
              )}
            </div>
          </section>
        );
      }}
    </DropzoneComponent>
  );
};

export default Dropzone;
