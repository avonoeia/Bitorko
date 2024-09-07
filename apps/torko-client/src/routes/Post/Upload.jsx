import React from "react";
import { Button } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

export default function Upload(props) {
    const { image, setImage, imageFile, setImageFile } = props

    const handleImage = (e) => {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.onloadend = () => {
            setImage(reader.result)
            setImageFile(file)
        }
        reader.readAsDataURL(file)
    }

    return (
        <>  
            {image.length ? <Button onClick={e => setImage("")} variant="contained" sx={{mt: 2}} endIcon={<CancelIcon/>}  color="warning"> Remove</Button> : ""}
            {image.length ? <img src={image} alt="preview" style={{ width: "100%", "margin": "20px 0px" }} /> : ""}
            {!image.length? <input
                type="file"
                id="file"
                name="post_image_content"
                style={{ width: "50%", marginTop: "20px", "background": "transparent" }}
                onChange={handleImage}
            /> : ""}
        </>
    );
}
