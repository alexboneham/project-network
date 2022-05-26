document.addEventListener('DOMContentLoaded', function() {

    form = document.querySelector('#follow-form');

    // Avoids error when hiding form in DOM 

    if (form) {
        form.onsubmit = () => {

            const id = document.querySelector('#profile-id').value
    
            // Make fetch request to "/users/user_id/follow"
            fetch(`/users/${id}/follow`, {
                method: 'PUT'
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