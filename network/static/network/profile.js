document.addEventListener('DOMContentLoaded', () => {

    choices = ['Follow', 'Unfollow'];

    button = document.querySelector('#follow-btn');
    button.onclick = () => {
        if (button.innerHTML === choices[0]) {
            button.innerHTML = choices[1];
        } else {
            button.innerHTML = choices[0];
        }
    }

})