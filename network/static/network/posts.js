document.addEventListener('DOMContentLoaded', function() {

    editButtons = document.querySelectorAll('#edit-btn');

    editButtons.forEach(button => {
        button.addEventListener('click', () => {

        // Display the edit form and hide post content
        parent = button.parentElement;
        form = parent.querySelector('form');  
        contentDisplay = parent.querySelector('#post-content');      
        form.classList.toggle('d-none');
        contentDisplay.classList.toggle('d-none');
    
        // Handle form submit
        form.onsubmit = () => {

            // Get new, edited content
            newContent = form['editedContent'].value;
            postId = form['postId'].value;

            // Update database via fetch
            fetch(`/posts/${postId}/edit`, {
                method: 'PUT',
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