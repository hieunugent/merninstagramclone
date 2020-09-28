import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import {storage, db} from "./firebase";
import firebase from "firebase";
import "./ImageUpload.css";
function ImageUpload({username}) {
     const [image, setImage] = useState(null);
     const [ url, setUrl] = useState("");
     const [progress, setProgress] = useState(0);
     const [caption, setCaption] = useState('');

     const handleChange=(e) => {
         if (e.target.files[0]){
             setImage(e.target.files[0]);
         }

     };
     const handleUpload =() => {
         const uploadTask = storage.ref(`images/${image.name}`).put(image);
         uploadTask.on(
             "state_changed",
             (snapshot)=> {
                 //progess logic
                 const progess = Math.round(
                    (snapshot.bytesTransferred/snapshot.totalBytes)* 100
                 );
                 setProgress(progess)
             }, (error) => {
                 console.log(error);
                 alert(error.message);
             },
             ()=> {
                 // complete function ...
                 storage
                 .ref("images")
                 .child(image.name)
                 .getDownloadURL()
                 .then((url) => {
                     setUrl(url);
                     // post image inside database
                     db.collection("posts").add({
                        imageUrl: url,
                        caption: caption,
                        username: username,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                     });

                     setProgress(0);
                     setCaption('');
                     setImage(null)
                 })

             }
         )
     }
    return (
      <div className="imageUpload">
        {/*need */}
        {/* capptions input */}
        {/* file picker */}
        {/* post button */}
        <progress className="imageUpload__progress" value={progress} max="100"/>
        <input type ="text" placeholder='Enter a Caption' onChange={(e)=> setCaption(e.target.value)} value={caption}/>
        <input type="file" onChange={handleChange}/>
        <Button onClick={handleUpload}>
            Upload
        </Button>
      </div>
    );
}

export default ImageUpload
