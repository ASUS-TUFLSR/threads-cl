import { useState } from "react";
import useShowToast from "./useShowToast";

const usePreviewImg = () => {
	const [imgUrl, setImgUrl] = useState(null);
	const showToast = useShowToast();

	const handleImageChange = (e) => {
	
		const file = e.target.files[0];
	  
		if(!file) return;


		if (!file.type.startsWith("image/")) {
         showToast("Error", "Please select an image file", "error");
         return;
        }

        if (file.size > 2 * 1024 * 1024) {
         showToast("Error", "Image must be under 2MB", "error");
         return;
        }

        const reader = new FileReader();

         reader.onloadend = () => {
         setImgUrl(reader.result);
        };

        reader.readAsDataURL(file);
	};
	return { handleImageChange, imgUrl, setImgUrl };
};

export default usePreviewImg;