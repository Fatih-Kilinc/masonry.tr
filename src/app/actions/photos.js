"use server";

// Retry mekanizması için yardımcı fonksiyon
async function fetchWithRetry(url, options, retries = 3, delay = 1000) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      // Rate limit hatası mı kontrol et (429)
      if (response.status === 429) {
        console.log("Rate limit exceeded, waiting longer before retry...");
        await new Promise(resolve => setTimeout(resolve, 5000)); // Daha uzun bekle
        return fetchWithRetry(url, options, retries - 1, delay * 2);
      }
      
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    if (retries <= 0) {
      console.error("Max retries reached:", error);
      throw error;
    }
    
    console.log(`Fetch failed, retrying in ${delay}ms...`, error);
    await new Promise(resolve => setTimeout(resolve, delay));
    return fetchWithRetry(url, options, retries - 1, delay * 2);
  }
}

export async function getPhotos(page = 1) {
  try {
    console.log("Fetching page:", page);
    
    // Daha sağlam API isteği
    const data = await fetchWithRetry(
      `https://api.unsplash.com/photos?page=${page}&per_page=10`,
      {
        headers: {
          Authorization: "Client-ID Wmbr24wHZbYM2CnAvLdNcJ2LcWirtx6PndVkuIxJn6I",
          "Accept-Version": "v1", // API versiyonunu belirt
        },
        // Zaman aşımını ayarla (5 saniye)
        signal: AbortSignal.timeout(5000),
      }
    );

    // API yanıtı kontrolü
    if (!Array.isArray(data)) {
      console.error("Unexpected API response:", data);
      return [];
    }

    return data.map((item, index) => ({
      img: item?.urls?.regular,
      height: [150, 400, 100, 150, 250, 200, 180, 100][index % 8],
      label: (page * 10 - 10 + index + 1).toString(),
    }));
  } catch (error) {
    console.error("Error fetching images:", error);
    // Hata durumunda boş dizi döndür, ancak UI'da hata mesajı gösterilebilir
    return [];
  }
}