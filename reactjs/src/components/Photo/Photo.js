import React , { useState, useEffect, useRef } from "react";
import './Photo.css'


function Photo(){
    const videoRef = useRef(null)
    const photoRef = useRef(null);

    const [hasPhoto, setHasPhoto] = useState(false);

    const getVideo = () => {
        navigator.mediaDevices
        .getUserMedia({
            video: true
        })
        .then(stream =>{
            let video = videoRef.current;
            video.srcObject = stream;
            video.play();
        })
        .catch(err => {
            console.error(err);
        })
    }

    useEffect(() => {
        getVideo()
    },  [videoRef]);
    


    const takePhoto = () => {
        const width = 414;
        const height = width / (16/9);

        let video = videoRef.current;
        let photo = photoRef.current;

        photo.width = width;
        photo.height = height;

        let ctx = photo.getContext('2d');
        ctx.drawImage(video, 0, 0, width, height);

        setHasPhoto(true);

    }

    const closePhoto = () => {
        let photo = photoRef.current;
        let ctx = photo.getContext('2d')

        ctx.clearRect(0,0,photo.width, photo.height);

        setHasPhoto(false)
    }


    return<>
        <div className="camera">
            <video ref={videoRef}></video>
        
        </div>
        <div>
            <button  className="button12" onClick={takePhoto}>Snap!</button>
        </div>
        <div className="portrait">
            <div className={'result' + (hasPhoto ? 'hasPhoto' : '')}>
                <canvas ref={photoRef}></canvas>
                <button  className="button12" onClick={closePhoto}>Close!</button>
            </div>
        </div>
    </>
       
    };
export default Photo;