/**
 * Front-End Development: Assignment 5
 * Warren Macalino
 * March 18, 2026
 */

async function getCollectionDays(searchQuery) {
    try {
        const apiUrl = `https://data.winnipeg.ca/resource/6rcy-9uik.json?` +
                       `$where=lower(combined_address) LIKE lower('%${searchQuery}%')` +
                       `&$order=combined_address ASC` +
                       `&$limit=50`;

        const encodedURL = encodeURI(apiUrl);

        const response = await fetch(encodedURL);

        if (!response.ok) {
            throw new Error(`HTTP Exception has occurred. Status: ${response.status}`);
        }

        const data = await response.json();
        
        return data;

    } catch (error) {
        console.error("Failed to retrieve collection data:", error.message);
    }
}

getCollectionDays('Main').then(data => {
    console.log("Collection Schedule Results:", data);
});