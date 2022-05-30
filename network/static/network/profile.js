document.addEventListener('DOMContentLoaded', function() {

    form = document.querySelector('#follow-form');

    // Avoids error when hiding form in DOM 

    if (form) {
        form.onsubmit = () => {

            const name = document.querySelector('#profile-name').value

            // Get CSRF Token
            const csrftoken = Cookies.get('csrftoken');

            // Make fetch request to "/users/user_id/follow"
            fetch(`/users/${name}`, {
                method: 'PUT',
                headers: {'X-CSRFToken': csrftoken},
                mode: 'same-origin',
            })
            .then(response => response.json())
            .then(result => {
    
                // Update the follow button
                if (result.isFollowing) {
                    document.querySelector('#follow-btn').innerHTML = 'Unfollow'
                } else {
                    document.querySelector('#follow-btn').innerHTML = 'Follow'
                }
    
                // Update the followers count
                document.querySelector('#followers').innerHTML = result.count
                
            })
    
            return false
    
        }
    }

})