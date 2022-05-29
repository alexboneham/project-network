document.addEventListener('DOMContentLoaded', function() {

    // Like post
    const likeBtns = document.querySelectorAll('#likeBtn');

    likeBtns.forEach(button => {
        button.addEventListener('click', () => {

            // Change icon color
            let color = button.style.color;
            const dataColor = button.dataset.color;
            color === dataColor ? color = 'black' : color = dataColor;
            button.style.color = color;

            // Make update to database like count
            const id = button.dataset.id;
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