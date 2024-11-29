$(document).ready(function(){
    $('.eye').click(function(){
        $(this).toggleClass('open');
        $(this).children('i').toggleClass('fa-eye-slash fa-eye');  
        // Chọn input password
        var input = $(this).closest('.input-group').find('input[type="password"], input[type="text"]');
        if($(this).hasClass('open')){
            input.attr('type', 'text'); // Hiện mật khẩu
        } else {
            input.attr('type', 'password'); // Ẩn mật khẩu
        }
    });
});

const signUpBtnLink = document.querySelector('.signUpBtn-link');
const signInBtnLink = document.querySelector('.signInBtn-link');
const wrapper = document.querySelector('.wrapper');

signUpBtnLink.addEventListener('click', () => {
    wrapper.classList.toggle('active');
});

signInBtnLink.addEventListener('click', () => {
    wrapper.classList.toggle('active');
});

