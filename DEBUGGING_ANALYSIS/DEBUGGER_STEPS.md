# Debugging Analysis: City of Winnipeg Waste Collection API

## 1. Logical Breakpoint 1: Before the API Request
* **Where:** Paused inside the `searchBtn.addEventListener`, right before the data fetch.
* **Why this point:** This is a critical state to verify that the user's input was properly captured and sanitized by the `formatSearchQuery()` helper function before it is sent to the Socrata API.
* **Debugger State Change:** Paused right before the API fetch, verifying that the raw user input was successfully captured and sanitized into the `query` variable.

## 2. Logical Breakpoint 2: The HTTP Response
* **Where:** Paused inside the `getCollectionDays()` function, immediately after the `fetch` resolves.
* **Why this point:** This verifies that the API call was successful (Status 200) before the program attempts to parse the payload.
* **Debugger State Change:** Paused immediately after the network request resolves, showing the raw, successful HTTP `Response` object returned by the Socrata servers.

## 3. Logical Breakpoint 3: Parsing the API Response
* **Where:** Paused at the same location as Step 2, but utilizing the DevTools Console interface.
* **Why this point:** To prove the raw JSON payload has been successfully translated into a usable JavaScript array of objects in the browser's memory, bypassing the Scope panel's optimization quirks.
* **Debugger State Change:** Utilizing the Console drawer to prove the JSON payload was successfully downloaded and parsed into a local JavaScript array of objects.

## 4. Logical Breakpoint 4: Dynamically Updating the DOM
* **Where:** Paused inside the `filteredData.forEach(item => { ... })` loop.
* **Why this point:** This demonstrates the exact moment the client-side logic merges with the API data to manipulate the DOM, evaluating each address for the dynamic "Today" highlight class.
* **Debugger State Change:** Paused inside the rendering loop, demonstrating an individual `item` data object being evaluated right before dynamically generating the HTML table row.

## Critical State Investigation
**Investigating Breakpoint 1 (Input Sanitization):**
This state reveals a critical piece of program logic: handling user unpredictability. By pausing right after the input is captured, I confirmed that if a user uses full words like "Street" instead of abbreviations, the regex filtering and sanitization logic intercepts it. The program is behaving exactly as expected here; without this state, the Open Data API would return an empty array due to formatting mismatches. This state dictates the success of all subsequent steps, as an improperly formatted query string will guarantee a failed database search.
