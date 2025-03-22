// import CustomMasonry from ".";

import CustomMasonry from ".";
import { getPhotos } from "./actions/photos";

// export default async function GetPhotos({ form }) {
//   try {
//     console.log("form", form);
//     const res = await fetch(
//       `https://api.unsplash.com/photos?page=${form?.page ?? 1}&per_page=10`,
//       {
//         headers: {
//           Authorization:
//             "Client-ID Wmbr24wHZbYM2CnAvLdNcJ2LcWirtx6PndVkuIxJn6I",
//         },
//       }
//     );
//     const data = await res.json();

//     const initialImages = data?.data?.map((item, index) => ({
//       img: item?.urls?.regular,
//       height: [150, 400, 100, 150, 250, 200, 180, 100][index % 8],
//       label: (index + 1).toString(),
//     }));

//     return <CustomMasonry initialImages={initialImages} />;
//   } catch (error) {
//     console.error("Error fetching images", error);
//     return <CustomMasonry initialImages={[]} />;
//   }
// }import CustomMasonry from "./components/CustomMasonry";


export default async function Page() {
  const initialImages = await getPhotos(1);
  return <CustomMasonry initialImages={initialImages} />;
}
