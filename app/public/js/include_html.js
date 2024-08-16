function include_html() {
    const elements = document.querySelectorAll("[component]"); // Get all elements with the attribute "component"
    
    elements.forEach((element) => { // Loop through each element
        const html_file_path = element.getAttribute("component"); // Get the value of the attribute
        if (html_file_path) { // If thgit e value is not empty
            fetch(html_file_path) // Fetch the html file path (/src/file.html)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Page not found");
                    }
                    return response.text(); // Return the response as text
                })
                .then(data => { // Process the data (response.text())
                    element.innerHTML = data; // Include the data in the element
                    element.removeAttribute("component"); // Remove to avoid infinite loop
                    include_html(); // Call again to process nested includes
                })
                .catch(error => {
                    console.error(error); // Log the error
                    element.removeAttribute("component"); // Remove to avoid infinite loop
                });
        }
    });
}

document.addEventListener("DOMContentLoaded", include_html); // Call the function when the document is loaded