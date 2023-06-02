var ParameterJson = "";
var StoreProcedure = "";
var urlApi = 'https://apisublicolor.azurewebsites.net/api/GenericMethodRequest'


$(document).ready(function() {
    BindEvent();
    Init();
  });

  function Init(){
    CargarUsuario();
  }

  function bloquearPantalla() {
    $.LoadingOverlay("show");
  }

  function desbloquearPantalla() {
    $.LoadingOverlay("hide");
  }
  
  function BindEvent() {
    $(document).on('click', '.editar', function() {
      // Obtener el ID del producto
      var idUsuario = $(this).attr('id');
      var nombre,telefono,direccion,cedula;

      if(idUsuario){
        $(".ocultarPass").hide();
      }

      ParameterJson = "";
      StoreProcedure = "";
      ParameterJson =  `{"IdPersona":${idUsuario}}`
      StoreProcedure = "[Seguridad].[prObtenerUsuarios]";
      $.ajax({
        url: `${urlApi}?parameterJson=${ParameterJson}&storeProcedure=${StoreProcedure}`,
        method: "GET",
        dataType: "json",
        beforeSend: function(){
          bloquearPantalla();
        },
        success: function(response) {
            desbloquearPantalla();
            response = JSON.parse(response)[0];
            // Obtener los datos de la fila correspondiente
            // Asignar los valores a los campos del modal
             $('#Nombre').val(response.NombreCompleto);
             $('#Telefono').val(response.Contacto);
             $('#Direccion').val(response.Direccion);
             $('#Cedula').val(response.Identificacion);
             $('#Usuario').val(response.Usuario);
             var fechaISO = new Date(response.FechaExpiracion).toISOString().split('T')[0];
             $("#FechaExpiracion").val(fechaISO)
      
            // Guardar el ID del producto en un atributo data del botón guardar del modal
            $('#btnGuardarModal').attr('data-idusuario', idUsuario);
        },
        error: function(xhr, status, error) {
          desbloquearPantalla();
          $.ambiance({
            title: "Error!",
            message: "Ocurrio un error, contactar al adminsitrador",
            type: "error",
            fade: false,
          }); 
        }
      });
           
      // Abrir el modal
      $('#agregarModal').modal('show');
    });
  
    $("#abrirmodal").click(function(){
      if(!$('#Nombre').val()){
        $("#btnGuardarModal").removeAttr('data-idusuario')      
      }
    })

    $('#btnCerrarModal').click(function() {
          // Cerrar el modal
          $('#Nombre').val('');
          $('#Telefono').val('');
          $('#Direccion').val('');
          $('#Cedula').val('');
          $('#Usuario').val('');
          $("#Password").val('');
          $('#FechaExpiracion').val('')
    });
    // Evento click en el botón "Guardar" del modal
    $('#btnGuardarModal').click(function() {
      // Obtener el ID del producto guardado en el atributo data
      var idUsuario = $(this).attr('data-idusuario');
      
      // Obtener los valores de los campos del formulario
      var nombre = $('#Nombre').val();
      var telefono = $('#Telefono').val();
      var direcion = $('#Direccion').val();
      var cedula = $('#Cedula').val();
      var usuario = $("#Usuario").val();
      if(!idUsuario){
        var password = $("#Password").val();
        password = CryptoJS.MD5(password).toString();
      }
      var FechaExpiracion = $("#FechaExpiracion").val();
      
      // Construir el objeto JSON a enviar
      var objetoJson = {
        IdPersona: idUsuario,
        NombreCliente: nombre,
        Telefono: telefono,
        Direccion: direcion,
        Cedula: cedula,
        Usuario: usuario,
        Password: password,
        FechaExpiracion: FechaExpiracion,
        EsEditar: true,
      };
      
      // Convertir el objeto JSON a una cadena JSON    
      ParameterJson = "";
      StoreProcedure = "";
      ParameterJson =  JSON.stringify(objetoJson);
      StoreProcedure = "[Seguridad].[prGuardarUsuarios]";
      console.log(`${urlApi}?parameterJson=${ParameterJson}&storeProcedure=${StoreProcedure}`)
      $.ajax({
        url: `${urlApi}?parameterJson=${ParameterJson}&storeProcedure=${StoreProcedure}`,
        method: "GET",
        dataType: "json",
        beforeSend: function(){
          bloquearPantalla();
        },
        success: function(response) {
            desbloquearPantalla();
            CargarUsuario();
            response=JSON.parse(response)[0]
            $.ambiance({
              title: response.status == 1 ? "Exito!":"Error!",
              message: response.message,
              type: response.status == 1 ? "success":"error",
              fade: false,
            }); 
        },
        error: function(xhr, status, error) {
          desbloquearPantalla();
          $.ambiance({
            title: "Error!",
            message: "Ocurrio un error, contactar al adminsitrador",
            type: "error",
            fade: false,
          }); 
        }
      });
      
      // Cerrar el modal
      $('#Nombre').val('');
      $('#Telefono').val('');
      $('#Direccion').val('');
      $('#Cedula').val('');
      $('#Usuario').val('');
      $("#Password").val('');
      $('#FechaExpiracion').val('')
      $('#agregarModal').modal('hide');
    });
  }

  function CargarUsuario(){
    ParameterJson = "";
    StoreProcedure = "";
    ParameterJson =  `{}`
    StoreProcedure = "[Seguridad].[prObtenerUsuarios]";
    $.ajax({
      url: `${urlApi}?parameterJson=${ParameterJson}&storeProcedure=${StoreProcedure}`,
      method: "GET",
      dataType: "json",
      beforeSend: function(){
        bloquearPantalla();
      },
      success: function(response) {
        console.log(response)

        if(response != '{}')
        {
          console.log(response)
          CargarFilas(JSON.parse(response))
        }
        desbloquearPantalla();        
      },
      error: function(xhr, status, error) {
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

    function CargarFilas(datosFila){
      var tabla = $("#tblUsuarios tbody");
      var objeto = [];

      tabla.empty();
      
      datosFila.forEach(element => {
        let fechaformateada = moment(element.FechaExpiracion).format("DD/MM/YYYY")
        let row = `<tr id= "${element.IdPersona}">
        <td>${element.NombreCompleto}</td>
        <td>${element.Contacto}</td>
        <td>${element.Direccion}</td>
        <td>${element.Identificacion}</td>
        <td>${element.Usuario}</td>
        <td>${fechaformateada}</td>
        <td>
        <a id=${element.IdPersona} class="btn btn-info editar" title="Editar"><i class="fa fa-edit" style="color:white"></i></a>    
        </td>
        </tr>  `;
        // ${element.EstadoProducto ? 
        //   `<a id=${element.IdProducto} class="btn btn-danger" title="Inactivar" onclick="ActivarInactivarProducto(0,${element.IdProducto})"><i class="fa fa-x" style="color:white"></i></a>`
        //  :`<a id=${element.IdProducto} class="btn btn-success" title="Activar" onclick="ActivarInactivarProducto(1,${element.IdProducto})"><i class="fa fa-check" style="color:white"></i></a>`
        // }
        objeto.push(row);
      });

      tabla.append(objeto);
    }
    
    function ActivarInactivarProducto(estado, idCliente)
    {
      ParameterJson = "";
      StoreProcedure = "";
      var objetoJson = {
        IdCliente: idProducto,
        EstadoProducto :estado,
        EsInactivar: 1
      };
      ParameterJson =  JSON.stringify(objetoJson);
      StoreProcedure = "[Negocio].[prGuardarCliente]";
      $.ajax({
        url: `${urlApi}?parameterJson=${ParameterJson}&storeProcedure=${StoreProcedure}`,
        method: "GET",
        dataType: "json",
        beforeSend: function(){
          bloquearPantalla();
        },
        success: function(response) {
            desbloquearPantalla();
            CargarUsuario();
            response=JSON.parse(response)[0]
            $.ambiance({
              title: response.status == 1 ? "Exito!":"Error!",
              message: response.message,
              type: response.status == 1 ? "success":"error",
              fade: false,
            }); 
        },
        error: function(xhr, status, error) {
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

    
  