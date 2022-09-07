import React, { useState } from 'react'

const UploadPhoto = ( ) => {
    const [image, setImage] = useState({})

    const fileOnChange = (e) => {
        setImage(e.target.files[0])
        console.log(image)
    }

    const sendImage = async () => {
        try {

            let formData = new FormData()

            formData.append("my-image", image)

            const newImage = await fetch(`http://localhost:8000/upload`, {
                method: "POST",
                body: formData
            })

            
            
        } catch (error) {
            console.log(error.message)
        }
    }



    return (
        <div>
            <input type="file" onChange={fileOnChange}></input>
            <button className="button-upload btn btn-light" onClick={sendImage}>Upload</button>
        </div>
    )
}

export default UploadPhoto