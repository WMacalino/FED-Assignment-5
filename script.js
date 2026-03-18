/**
 * Front-End Development: Assignment 5
 * Warren Macalino
 * March 18, 2026
 */

async function getTransitInfo(date) {
    try{
        const response = await fetch(`https://api.winnipegtransit.com/v4/stops/10064/schedule.json?api-key=YmLmf_jqBiMjxLkALJm-`);

        if(!response.ok) {
            throw new Error(`HTTP Exception has occurred. Status: ${response.status}`);
        }

        return await response.json();
    } catch(error){
        console.error("Failed to retrieve data.", error.message);
    }
}

getTransitInfo().then((data) => console.log(data));