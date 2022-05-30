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

            // Get CSRF Token from cookies
            const csrftoken = Cookies.get('csrftoken');

            // Make update to database like count
            const id = button.dataset.id;
            fetch(`/posts/${id}/like`, {
                method: 'PUT',
                headers: {'X-CSRFToken': csrftoken},
                mode: 'same-origin',
            })
            .then(response => response.json())
            .then(result => {

                // Update like count
                button.parentElement.querySelector('#likeCount').innerHTML = result["count"];

            })            

        })
    })

})