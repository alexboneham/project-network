document.addEventListener('DOMContentLoaded', function() {

    // Edit post
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

    // Like post
    likeBtns = document.querySelectorAll('#likeBtn');

    likeBtns.forEach(button => {
        button.addEventListener('click', () => {

            // Change icon color
            color = button.style.color;
            dataColor = button.dataset.color;
            color === dataColor ? color = 'black' : color = dataColor;
            button.style.color = color;

            // Make update to database like count
            id = button.dataset.id;
            fetch(`/posts/${id}/like`, {
                method: 'PUT'
            })
            .then(response => response.json())
            .then(result => {

                // Update like count
                button.parentElement.querySelector('#likeCount').innerHTML = result["count"];

            })            

        })
    })


})