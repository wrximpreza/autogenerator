$(document).ready(function() {
    $('.input-field select, .icons').material_select();
    $('.tooltip').tooltipster({
        theme: 'tooltipster-shadow',
        side: 'right',
        content: $('#tooltip_content'),
        // if you use a single element as content for several tooltips, set this option to true
        contentCloning: false
    });

    $('.boxes .box').hover(function () {
        console.log(this);
        $(this).find('.description').addClass('active');
    }, function () {
        $(this).find('.description').removeClass('active');
    });

    $("#check_all").on('change', function () {
        $(".boxes .box input:checkbox").prop('checked', $(this).prop("checked"));
    });

    $("#filled-in-box").on('change', function () {
        if($(this).prop('checked')){
            $('.banners .has').hide();
            $('.banners .no').show();
        }else{
            $('.banners .has').show();
            $('.banners .no').hide();
        }
    });
        


});

function sendData() {
    $('form.send_form').submit();
}