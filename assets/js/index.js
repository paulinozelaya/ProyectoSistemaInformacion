(function ($) {
    "use strict";
    localStorage.removeItem("UsuarioLogueado")
    var urlApi = 'https://apisublicolor.azurewebsites.net/api/GenericMethodRequest'
     /*==================================================================
    [ Focus input ]*/
    $('.input100').each(function(){
        $(this).on('blur', function(){
            if($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })    
    })
  
  
    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    // $('.validate-form').on('submit',function(){
    //     var check = true;

    //     for(var i=0; i<input.length; i++) {
    //         if(validate(input[i]) == false){
    //             showValidate(input[i]);
    //             check=false;
    //         }
    //     }

    //     return check;
    // });

    $("#btnAcceder").on('click',function(){

        if(validateForm()){
            let user = $("#username").val();
            let pass = $("#password").val();
            pass = CryptoJS.MD5(pass).toString();
            let StoreProcedure = '[Seguridad].[prIniciarSesion]';
            let ParameterJson = `{"User":"${user}","Pass":"${pass}"}`;
            bloquearPantalla()
           $.ajax({
                // url: urlApi + "?parameterJson="+ParameterJson+"&storeProcedure="+StoreProcedure,
                url: `${urlApi}?parameterJson=${ParameterJson}&storeProcedure=${StoreProcedure}`,
                method: "GET",
                dataType: "json",
                success: function(response) {
                    desbloquearPantalla();
                    response = JSON.parse(response);

                  if(response.status == "success" || response.status){
                    $.ambiance({
                        title: "Exito!",
                        message: response.message,
                        type: "success",
                        fade: false,
                      }); 

                      localStorage.setItem("UsuarioLogueado",true);

                      setTimeout(function() {
                        window.location.pathname = window.location.pathname+'dashboard.html'                                             
                      }, 800);
                  }else if(!response.status){
                    $.ambiance({
                        title: "Error!",
                        message: response.message,
                        type: "warning",
                        fade: false,
                      }); 
                      
                      
                  }
                   else{
                    $.ambiance({
                        title: "Error!",
                        message: "Ocurrio un error, contactar al adminsitrador",
                        type: "error",
                        fade: false,
                      });                
                    }
                },
                error: function(xhr, status, error) {
                  // Ha ocurrido un error durante la solicitud
                  desbloquearPantalla();
                  $.ambiance({
                    title: "Error!",
                    message: "Ocurrio un error, contactar al adminsitrador",
                    type: "error",
                    fade: false,
                  }); 
                }
              });
              
        }
    })

    function validateForm (){
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }

        return check;
    }

    function bloquearPantalla() {
        $.LoadingOverlay("show");
        // window.location.pathname = '/login2.html'
      }
    
      // Desbloquear la pantalla
      function desbloquearPantalla() {
        $.LoadingOverlay("hide");
      }


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }
    
    

})(jQuery);