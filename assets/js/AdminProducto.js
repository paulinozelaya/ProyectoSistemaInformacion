var ParameterJson = "";
var StoreProcedure = "";
var urlApi = 'https://apisublicolor.azurewebsites.net/api/GenericMethodRequest'


$(document).ready(function() {
    BindEvent();
    Init();
  });

  function Init(){
    CargarProducto();
  }

  function bloquearPantalla() {
    $.LoadingOverlay("show");
  }

  function desbloquearPantalla() {
    $.LoadingOverlay("hide");
  }
  
  function BindEvent() {
    $("#btnCatalogoDigital").on('click',function(){
      window.open("/assets/document/Catalogo 2023 Subli Color.pdf",'_blank');
    })

    $(document).on('click', '.editar', function() {
      // Obtener el ID del producto
      var idProducto = $(this).attr('id');
      var nombre,precio,descuento,cantidad,estado;
      ParameterJson = "";
      StoreProcedure = "";
      ParameterJson =  `{"IdProducto":${idProducto}}`
      StoreProcedure = "[Negocio].[prObtenerProductos]";
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
             $('#Nombre').val(response.NombreProducto);
             $('#Precio').val(response.PrecioUnitario);
             $('#Descuento').val(response.DescuentoPorcentaje);
             $('#CantidadDisponible').val(response.CantidadTotal);
             $('#Estado').val(response.EstadoProducto ? '1' : '0');
      
            // Guardar el ID del producto en un atributo data del botón guardar del modal
            $('#btnGuardarModal').attr('data-idproducto', idProducto);
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
        $("#btnGuardarModal").removeAttr('data-idproducto')
      }
    })

    $('#btnCerrarModal').click(function() {
          // Cerrar el modal
          $('#Nombre').val('');
          $('#Precio').val('');
          $('#Descuento').val('');
          $('#CantidadDisponible').val('');
          $('#Estado').val('');
    });
    // Evento click en el botón "Guardar" del modal
    $('#btnGuardarModal').click(function() {
      // Obtener el ID del producto guardado en el atributo data
      var idProducto = $(this).attr('data-idproducto');
      
      // Obtener los valores de los campos del formulario
      var nombre = $('#Nombre').val();
      var precio = $('#Precio').val();
      var descuento = $('#Descuento').val();
      var cantidad = $('#CantidadDisponible').val();
      var estado = $('#Estado').val();
      
      // Construir el objeto JSON a enviar
      var objetoJson = {
        IdProducto: idProducto,
        NombreProducto: nombre,
        PrecioUnitario: precio,
        DescuentoPorcentaje: descuento,
        CantidadProducto: cantidad,
        EstadoProducto: estado,
        EsEditar: true,
      };
      
      // Convertir el objeto JSON a una cadena JSON    
      ParameterJson = "";
      StoreProcedure = "";
      ParameterJson =  JSON.stringify(objetoJson);
      StoreProcedure = "[Negocio].[prGuardarProducto]";
      $.ajax({
        url: `${urlApi}?parameterJson=${ParameterJson}&storeProcedure=${StoreProcedure}`,
        method: "GET",
        dataType: "json",
        beforeSend: function(){
          bloquearPantalla();
        },
        success: function(response) {
            desbloquearPantalla();
            CargarProducto();
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
      $('#Precio').val('');
      $('#Descuento').val('');
      $('#CantidadDisponible').val('');
      $('#Estado').val('');
      $('#agregarModal').modal('hide');
    });
  }

  function CargarProducto(){
    ParameterJson = "";
    StoreProcedure = "";
    ParameterJson =  `{}`
    StoreProcedure = "[Negocio].[prObtenerProductos]";
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
      var tabla = $("#tblProductos tbody");
      var objeto = [];

      tabla.empty();
      datosFila.forEach(element => {
        let row = `<tr id= "${element.IdProducto}">
        <td>${element.NombreProducto}</td>
        <td>${element.PrecioUnitario}</td>
        <td>${element.DescuentoPorcentaje}</td>
        <td>${element.CantidadTotal}</td>
        <td>${element.Estado}</td>
        <td>
        <a id=${element.IdProducto} class="btn btn-info editar" title="Editar"><i class="fa fa-edit" style="color:white"></i></a>
        ${element.EstadoProducto ? 
          `<a id=${element.IdProducto} class="btn btn-danger" title="Inactivar" onclick="ActivarInactivarProducto(0,${element.IdProducto})"><i class="fa fa-x" style="color:white"></i></a>`
         :`<a id=${element.IdProducto} class="btn btn-success" title="Activar" onclick="ActivarInactivarProducto(1,${element.IdProducto})"><i class="fa fa-check" style="color:white"></i></a>`
        }
        </td>
        </tr>  `;
        objeto.push(row);
      });

      tabla.append(objeto);
    }
    
    function ActivarInactivarProducto(estado, idProducto)
    {
      ParameterJson = "";
      StoreProcedure = "";
      var objetoJson = {
        IdProducto: idProducto,
        EstadoProducto :estado,
        EsInactivar: 1
      };
      ParameterJson =  JSON.stringify(objetoJson);
      StoreProcedure = "[Negocio].[prGuardarProducto]";
      $.ajax({
        url: `${urlApi}?parameterJson=${ParameterJson}&storeProcedure=${StoreProcedure}`,
        method: "GET",
        dataType: "json",
        beforeSend: function(){
          bloquearPantalla();
        },
        success: function(response) {
            desbloquearPantalla();
            CargarProducto();
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

    
  