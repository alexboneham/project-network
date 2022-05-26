document.addEventListener('DOMContentLoaded', function() {

    
    document.querySelector('#follow-form').onsubmit = () => {

        const id = document.querySelector('#profile-id').value

        // Make fetch request to "/users/user_id/follow"
        fetch(`/users/${id}/follow`)
        .then(response => console.log(response))

        return false
        
        





        // Toggle button text depending on previous status (maybe do through API response instead)
        // const btn = document.querySelector('#follow-btn');
        // const choices = ['Follow', 'Unfollow'];

        // if (btn.innerHTML === choices[0]) {
        //     btn.innerHTML = choices[1];
        // } else {
        //     btn.innerHTML = choices[0];
        // }

    }

})