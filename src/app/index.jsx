// "use client";
// import { CircularProgress, Paper, styled } from "@mui/material";
// import * as React from "react";
// import Masonry from "@mui/lab/Masonry";
// import { useState, useEffect, useRef } from "react";
// import { debounce } from "lodash";
// import GetPhotos from "./page";

// const Label = styled(Paper)(({ theme }) => ({
//   backgroundColor: "#fff",
//   ...theme.typography.body2,
//   padding: theme.spacing(0.5),
//   textAlign: "center",
//   color: theme.palette.text.secondary,
//   borderBottomLeftRadius: 0,
//   borderBottomRightRadius: 0,
// }));
// const initialState = {
//   message: "",
//   page: 2,
// };
// export default function CustomMasonry({ initialImages }) {
//   const [images, setImages] = useState(initialImages);
//   const [page, setPage] = useState(2);
//   const loaderRef = useRef(null);
//   const isFetchingRef = useRef(false);
//   const formRef = useRef(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const getPhotosForm = GetPhotos.bind(null, {
//     page: page,
//   });
//   const [state, formAction] = React.useActionState(getPhotosForm, initialState);

//   console.log(state);
//   const handleScroll = debounce(() => {
//     if (loaderRef.current && !isLoading) {
//       const loader = loaderRef.current;
//       const rect = loader.getBoundingClientRect();
//       if (rect.top <= window.innerHeight) {
//         fetchMoreImages();
//       }
//     }
//   }, 300);

//   const fetchMoreImages = async () => {
//     if (isFetchingRef.current) return;
//     setIsLoading(true);
//     isFetchingRef.current = true;
//     try {
//       formRef.current.requestSubmit();
//       setImages((prevImages) => [
//         ...prevImages,
//         ...data.map((item, index) => ({
//           img: item?.urls?.regular,
//           height: [150, 400, 100, 150, 250, 200, 180, 100][index % 8],
//           label: (prevImages.length + index + 1).toString(),
//         })),
//       ]);

//       setPage(page + 1);
//     } catch (error) {
//       console.error("Hata oluştu:", error);
//     } finally {
//       isFetchingRef.current = false;
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       window.addEventListener("scroll", handleScroll);
//     }

//     return () => {
//       if (typeof window !== "undefined") {
//         window.removeEventListener("scroll", handleScroll);
//       }
//     };
//   }, [isLoading]);

//   return (
//     <form
//       action={formAction}
//       ref={formRef}
//       style={{ width: 800, minHeight: 829 }}
//     >
//       <Masonry
//         columns={3}
//         spacing={2}
//         defaultHeight={450}
//         defaultColumns={3}
//         defaultSpacing={2}
//       >
//         {images?.map((item, index) => (
//           <div
//             key={index}
//             className="border-[0.5px] border-gray-400"
//             style={{ height: "auto" }}
//           >
//             <Label className="bg-white text-black shadow-md">
//               {item.label}
//             </Label>
//             <img
//               srcSet={`${item.img}`}
//               src={`${item.img}`}
//               alt={`Image ${item.label}`}
//               loading="lazy"
//               style={{
//                 width: "100%",
//                 height: item?.height,
//                 objectFit: "cover",
//               }}
//             />
//           </div>
//         ))}
//       </Masonry>
//       {isLoading && (
//         <div
//           style={{ display: "flex", justifyContent: "center", marginTop: 2 }}
//         >
//           <CircularProgress />
//         </div>
//       )}
//       <div ref={loaderRef} className="h-10" />
//     </form>
//   );
// }
"use client";
import { CircularProgress, Paper, styled } from "@mui/material";
import * as React from "react";
import Masonry from "@mui/lab/Masonry";
import { useState, useEffect, useRef } from "react";
import { debounce } from "lodash";
import { getPhotos } from "./actions/photos";
import ImageLoad from "@/components/ImageLoad";

const Label = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(0.5),
  textAlign: "center",
  color: theme.palette.text.secondary,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
}));

export default function CustomMasonry({ initialImages }) {
  const [images, setImages] = useState(initialImages || []);
  const [currentPage, setCurrentPage] = useState(2); // İlk sayfa zaten yüklendi
  const loaderRef = useRef(null);
  const isFetchingRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleScroll = debounce(() => {
    if (loaderRef.current && !isLoading && !isFetchingRef.current) {
      const loader = loaderRef.current;
      const rect = loader.getBoundingClientRect();
      if (rect.top <= window.innerHeight) {
        fetchMoreImages();
      }
    }
  }, 300);

  const fetchMoreImages = async () => {
    if (isFetchingRef.current) return;
    setIsLoading(true);
    isFetchingRef.current = true;
    
    try {
      // Server action'ı çağır
      const newImages = await getPhotos(currentPage);
      
      // Yeni resimleri ekle
      setImages((prevImages) => [...prevImages, ...newImages]);
      
      // Sayfa numarasını arttır
      setCurrentPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error("Hata oluştu:", error);
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isLoading]);

  return (
    <div className="sm:w-[800px] w-full min-h-[829px] px-8">
      <Masonry
       columns={{ xs: 2, sm: 3 }}
        spacing={2}
        defaultHeight={450}
        defaultColumns={3}
        defaultSpacing={2}
      >
        {images?.map((item, index) => (
          <div
            key={index}
            className="border-[0.5px] border-gray-400"
            style={{ height: "auto" }}
          >
            <Label className="bg-white text-black shadow-md">
              {item.label}
            </Label>
            <ImageLoad
              src={`${item.img}`}
              alt={`Image ${item.label}`}
              style={{
                width: "100%",
                height: item?.height,
                objectFit: "cover",
              }}
            />
          </div>
        ))}
      </Masonry>
      {isLoading && (
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 2 }}
        >
          <CircularProgress />
        </div>
      )}
      <div ref={loaderRef} className="h-10" />
    </div>
  );
}