document.addEventListener('DOMContentLoaded', function() {

    // Edit post
    const editButtons = document.querySelectorAll('#edit-btn');

    editButtons.forEach(button => {
        button.addEventListener('click', () => {

        // Display the edit form and hide post content
        const parent = button.parentElement;
        const form = parent.querySelector('form');  
        const contentDisplay = parent.querySelector('#post-content');      
        form.classList.toggle('d-none');
        contentDisplay.classList.toggle('d-none');

        const csrftoken = Cookies.get('csrftoken');
    
        // Handle form submit
        form.onsubmit = () => {

            // Get new, edited content
            const newContent = form['editedContent'].value;
            const postId = form['postId'].value;

            // Update database via fetch
            fetch(`/posts/${postId}/edit`, {
                method: 'PUT',
                headers: {'X-CSRFToken': csrftoken},
                mode: 'same-origin',
                body: JSON.stringify({
                    newContent: newContent,
                })
            })
            .then(response => response.json())
            .then(result => {
                console.log(result) 
            })
            
            // Apply new content to post display in DOM
            parent.querySelector('#post-content').innerHTML = newContent;

            // Hide form and display post content
            form.classList.toggle('d-none');
            contentDisplay.classList.toggle('d-none');
            return false
        }

        })
    })  
})