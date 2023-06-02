var ParameterJson = "";
var StoreProcedure = "";
var urlApi = 'https://apisublicolor.azurewebsites.net/api/GenericMethodRequest'


$(document).ready(function() {
    BindEvent();
    Init();
  });

  function Init(){
    CargarCliente();
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
      var idCliente = $(this).attr('id');
      var nombre,telefono,direccion,cedula;
      ParameterJson = "";
      StoreProcedure = "";
      ParameterJson =  `{"IdPersona":${idCliente}}`
      StoreProcedure = "[Negocio].[prObtenerClientes]";
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
      
            // Guardar el ID del producto en un atributo data del botón guardar del modal
            $('#btnGuardarModal').attr('data-idcliente', idCliente);
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
        $("#btnGuardarModal").removeAttr('data-idcliente')
      }
    })

    $('#btnCerrarModal').click(function() {
          // Cerrar el modal
          $('#Nombre').val('');
          $('#Telefono').val('');
          $('#Direccion').val('');
          $('#Cedula').val('');
    });
    // Evento click en el botón "Guardar" del modal
    $('#btnGuardarModal').click(function() {
      // Obtener el ID del producto guardado en el atributo data
      var idCliente = $(this).attr('data-idcliente');
      
      // Obtener los valores de los campos del formulario
      var nombre = $('#Nombre').val();
      var telefono = $('#Telefono').val();
      var direcion = $('#Direccion').val();
      var cedula = $('#Cedula').val();
      
      // Construir el objeto JSON a enviar
      var objetoJson = {
        IdPersona: idCliente,
        NombreCliente: nombre,
        Telefono: telefono,
        Direccion: direcion,
        Cedula: cedula,
        EsEditar: true,
      };
      
      // Convertir el objeto JSON a una cadena JSON    
      ParameterJson = "";
      StoreProcedure = "";
      ParameterJson =  JSON.stringify(objetoJson);
      StoreProcedure = "[Negocio].[prGuardarClientes]";
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
            CargarCliente();
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
      $('#agregarModal').modal('hide');
    });
  }

  function CargarCliente(){
    ParameterJson = "";
    StoreProcedure = "";
    ParameterJson =  `{}`
    StoreProcedure = "[Negocio].[prObtenerClientes]";
    $.ajax({
      url: `${urlApi}?parameterJson=${ParameterJson}&storeProcedure=${StoreProcedure}`,
      method: "GET",
      dataType: "json",
      beforeSend: function(){
        bloquearPantalla();
      },
      success: function(response) {
        if(response)
        {
          desbloquearPantalla();
          CargarFilas(JSON.parse(response))
        }        
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
      var tabla = $("#tblClientes tbody");
      var objeto = [];

      tabla.empty();
      datosFila.forEach(element => {
        let row = `<tr id= "${element.IdPersona}">
        <td>${element.NombreCompleto}</td>
        <td>${element.Contacto}</td>
        <td>${element.Direccion}</td>
        <td>${element.Identificacion}</td>
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
            CargarCliente();
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

    
  