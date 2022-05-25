document.addEventListener('DOMContentLoaded', () => {

    button = document.querySelector('#new-post-btn');

    button.onclick = () => {
        document.querySelector('#new-post').style.display = 'block';
        button.style.display = 'none';
    }

})




    