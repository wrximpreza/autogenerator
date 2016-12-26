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
    //$('.myElement').featherlight();
    $('#lightbox_click').trigger('click');
    $('.modal').modal({
            dismissible: true, // Modal can be dismissed by clicking outside of the modal
            opacity: .5, // Opacity of modal background
            in_duration: 300, // Transition in duration
            out_duration: 200, // Transition out duration
            starting_top: '4%', // Starting top style attribute
            ending_top: '10%', // Ending top style attribute
            ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.

            },
            complete: function() {

                 } // Callback for Modal close
        }
    );
});


function sendData() {
    if(!$('.block_input input[name=app]').val()){
        showModal('Введите bundle_id приложения, которое вы ищете');
        return false;
    }
    if($(".boxes  .box .filled-in:checked").length == 0){
        showModal('Выберите баннеры которые Вы хотите сгенерировать');
        return false;
    }
    if($("#filled-in-box").prop('checked')){
        if($(".input_texts input[name=title_text]").val()==''){
            showModal('Введите название приложения(локализация)');
            return false;
        }
        if($(".input_texts input[name=button_text]").val()==''){
            showModal('Введите название кнопки(локализация)');
            return false;
        }
        if($(".input_texts input[name=rate_text]").val()==''){
            showModal('Введите рейтинг(локализация)');
            return false;
        }
    }

    if($("#send_mail").prop('checked')){
        if($(".result .email input").val()==''){
            showModal('Введите почту на которую отправлять сгенерированные баннеры');
            return false;
        }
    }
    if(!$("#send_mail").prop('checked') && !$("#download").prop('checked')){
        showModal('Выберите вариант получения баннеров');
        return false;
    }

    $('form.send_form').submit();
}
function showModal(text) {

    $('.modal-content p').html(text);
    $('#modal1').modal('open');
}