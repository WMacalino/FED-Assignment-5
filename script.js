/**
 * Front-End Development: Assignment 5
 * Warren Macalino
 * March 18, 2026
 */

// For testing spinner animation by adding a delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to sanitize user input for the API
function formatSearchQuery(input) {
    let formatted = input.toLowerCase();

    // We use \b (word boundaries) so we only replace whole words. 
    // This stops us from accidentally changing a street named "Ravenstree" into "Ravenst"
    formatted = formatted.replace(/\b street\b/g, ' st');
    formatted = formatted.replace(/\b avenue\b/g, ' ave');
    formatted = formatted.replace(/\b drive\b/g, ' dr');
    formatted = formatted.replace(/\b road\b/g, ' rd');
    formatted = formatted.replace(/\b boulevard\b/g, ' blvd');
    formatted = formatted.replace(/\b court\b/g, ' crt');

    return formatted;
}

async function getCollectionDays(searchQuery) {
    try {
        const apiUrl = `https://data.winnipeg.ca/resource/6rcy-9uik.json?` +
                       `$where=lower(combined_address) LIKE lower('%${searchQuery}%')` +
                       `&$order=combined_address ASC` +
                       `&$limit=1000`;

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

const searchBtn = document.getElementById('searchBtn');
const addressInput = document.getElementById('addressInput');
const tableBody = document.getElementById('tableBody');

searchBtn.addEventListener('click', async () => {

    // Grab the value, trim the spaces, and pass it through our formatter
    const rawInput = addressInput.value.trim();
    const query = formatSearchQuery(rawInput);
    
    if (!query) {
        alert("Please enter a street name or address.");
        return;
    }

    tableBody.innerHTML = "<tr><td colspan='4'><div class='spinner'></div></td></tr>";
    // await delay(2000)        // Un-comment to see spinner animation!
    const rawData = await getCollectionDays(query);

    // Clear the loading message
    tableBody.innerHTML = "";

    // Handle the case where the API finds nothing at all
    if (!rawData || rawData.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='4'>No addresses found matching that search.</td></tr>";
        return;
    }

    // QA
    // Create a strict Regex pattern looking for the exact word(s) with word boundaries
    const exactMatchRegex = new RegExp(`\\b${query}\\b`, 'i');
    
    // Filter the raw API data to only keep exact word matches
    const filteredData = rawData.filter(item => {
        // Double check that combined_address exists, then test it against our strict Regex
        return item.combined_address && exactMatchRegex.test(item.combined_address);
    });

    // Handle the case where the API found things, but our strict filter caught them (ex. Searching "Main" includes "St. Germain")
    if (filteredData.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='4'>No exact matches found. Try adding a street number!</td></tr>";
        return;
    }

    filteredData.forEach(item => {
        
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${item.combined_address || 'N/A'}</td>
            <td>${item.garbage_collection_day || 'N/A'}</td>
            <td>${item.recycle_collection_day || 'N/A'}</td>
            <td>${item.yard_waste_collection_day || 'N/A'}</td>
        `;
        
        tableBody.appendChild(row);
    });
});

const clearButton = document.getElementById('clearBtn');

clearButton.addEventListener('click', () => {
    addressInput.value = ""
    tableBody.innerHTML = ""
    addressInput.focus()
});