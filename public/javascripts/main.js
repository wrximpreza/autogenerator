$(document).ready(function () {

    $('.boxes .box .description textarea').on('click', function (event) {
        event.stopPropagation();
        if($(this).prop('readonly')){
            showModal('Выберите баннер и сможете его редактировать');
        }

    });

    $('.boxes .box .description textarea').attr("readonly","readonly");


    $('.input-field select, .icons').material_select();
    $('.tooltip').tooltipster({
        theme: 'tooltipster-shadow',
        side: 'right',
        content: $('#tooltip_content'),
        // if you use a single element as content for several tooltips, set this option to true
        contentCloning: false
    });


    $("#check_all").on('change', function () {

        $(".boxes .box input:checkbox").prop('checked', $(this).prop("checked"));

        if ($("#filled-in-box").prop('checked')) {
            $('.boxes .box .description textarea').removeAttr('readonly');
        }
        if (!$("#check_all").prop('checked')) {
            $('.boxes .box .description textarea').attr('readonly', 'readonly');
        }

    });


    $('.boxes .box .filled-in').on('change', function () {

        var box = $(this).parent().parent();

        if ($(this).prop('checked') && $("#filled-in-box").prop('checked')) {
            $(box).find('.description textarea').removeAttr('readonly');
        } else {
            $(box).find('.description textarea').attr('readonly', 'readonly');
        }

    });

    $("#filled-in-box").on('change', function () {
        if ($(this).prop('checked')) {
            $('.banners .has').hide();
            $('.banners .no').show();


            /*$('.boxes .box').each(function (index, value) {
                if ($(this).find('.filled-in').prop('checked')) {
                    $(this).find('.description').addClass('active');
                }
            });*/
            $('.boxes .box .description').addClass('active');

        } else {
            $('.banners .has').show();
            $('.banners .no').hide();

            $('.boxes .box .description').removeClass('active');

        }
    });

    $('#lightbox_click').featherlight({
        targetAttr: 'href',
        afterClose: function () {
            location.href = '/';
        }
    });

    $('#lightbox_click').trigger('click');
    $('.modal').modal({
            dismissible: true, // Modal can be dismissed by clicking outside of the modal
            opacity: .5, // Opacity of modal background
            in_duration: 300, // Transition in duration
            out_duration: 200, // Transition out duration
            starting_top: '4%', // Starting top style attribute
            ending_top: '10%', // Ending top style attribute
            ready: function (modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.

            },
            complete: function () {

            }
        }
    );

    $('.preview').on('click', function (event) {
        event.stopPropagation();

        if (!$('.block_input input[name=app]').val()) {
            showModal('Введите bundle_id приложения,<br/> которое вы ищете');
            return false;
        }

        if ($("#filled-in-box").prop('checked')) {
            if ($(".input_texts input[name=title_text]").val() == '') {
                showModal('Введите название приложения(локализация)');
                return false;
            }
            if ($(".input_texts input[name=button_text]").val() == '') {
                showModal('Введите название кнопки(локализация)');
                return false;
            }
            if ($(".input_texts input[name=rate_text]").val() == '') {
                showModal('Введите рейтинг(локализация)');
                return false;
            }
        }

        var format = $(this).data('format');
        var data = '//' + location.host + '/show?' + $('form.send_form').serialize();
        data += '&single_format=' + format;
        console.log(data);
        var size = format.split('_');
        $.featherlight({
            iframe: data,
            loading: 'Загрузка...',
            iframeWidth: parseInt(size[0]) + 20,
            iframeHeight: parseInt(size[1]) + 20
        });

    })


});


function sendData() {
    if (!$('.block_input input[name=app]').val()) {
        showModal('Введите bundle_id приложения,<br/> которое вы ищете');
        return false;
    }
    if ($(".boxes  .box .filled-in:checked").length == 0) {
        showModal('Выберите баннеры которые<br/> Вы хотите сгенерировать');
        return false;
    }
    if ($("#filled-in-box").prop('checked')) {
        if ($(".input_texts input[name=title_text]").val() == '') {
            showModal('Введите название приложения(локализация)');
            return false;
        }
        if ($(".input_texts input[name=button_text]").val() == '') {
            showModal('Введите название кнопки(локализация)');
            return false;
        }
        if ($(".input_texts input[name=rate_text]").val() == '') {
            showModal('Введите рейтинг(локализация)');
            return false;
        }
    }
    if (!$("#send_mail").prop('checked') && !$("#download").prop('checked')) {
        showModal('Выберите вариант получения баннеров');
        return false;
    }
    if ($("#send_mail").prop('checked')) {
        if ($(".result .email input").val() == '') {
            showModal('Введите почту на которую <br/>отправлять сгенерированные баннеры');
            return false;
        } else if (!validateEmail($(".result .email input").val())) {
            showModal('Введите правильную почту');
            return false;
        }
    }

    $('#preloader').show();
    $('form.send_form').submit();

}
function showModal(text) {
    Materialize.toast(text, 2000);
    /*$('.modal-content p').html(text);
     $('#modal1').modal('open');*/
}
function validateEmail($email) {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test($email);
}
