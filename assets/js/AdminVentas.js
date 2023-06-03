var ParameterJson = "";
var StoreProcedure = "";
var urlApi = 'https://apisublicolor.azurewebsites.net/api/GenericMethodRequest'
var GuardarVenta = "";


$(document).ready(function () {
  BindEvent();
  Init();
});

function Init() {
  CargarProducto();
}

function bloquearPantalla() {
  $.LoadingOverlay("show");
}

function desbloquearPantalla() {
  $.LoadingOverlay("hide");
}

function permitirNumerosPositivos(valor) {
  // Eliminar cualquier carácter que no sea un número
  valor = valor.replace(/[^0-9]/g, '');

  // Convertir a número entero
  const numero = parseInt(valor, 10);

  // Verificar si el número es un entero positivo
  if (!isNaN(numero) && numero >= 0) {
    return numero.toString();
  } else {
    return '';
  }
}

function BindEvent() {



  $("#Fecha").val(new Date().toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }));
  $("#btn-agregar").on("click", function () {
    agregarFila();
  });
  $('#Cantidad').on('input', function () {


    // Obtén el valor actual del campo de entrada
    const valor = $(this).val();
    // const precio = $("#Precio").val()
    // let descuento = $("#Descuento").val()
    // $("#Cantidad").val("1");

    // Llama a la función para permitir solo números positivos y actualiza el valor del campo de entrada
    $(this).val(permitirNumerosPositivos(valor));
    calcularSuntotalFila();

    // //VAMOS A CALCULAR EL TOTAL
    // descuento = parseInt(descuento)

    // let total = parseInt(valor) * parseInt(precio)
    // total = total - (total * descuento)

    // $("#Total").val(total)

  });

  $('#Precio').on('input', function () {

    // Obtén el valor actual del campo de entrada
    const valor = $(this).val();

    // Llama a la función para permitir solo números positivos y actualiza el valor del campo de entrada
    $(this).val(permitirNumerosPositivos(valor));

    calcularSuntotalFila();
  });

  $('#Descuento').on('input', function () {

    // Obtén el valor actual del campo de entrada
    let valor = $(this).val();

    if (permitirNumerosPositivos(valor) > 99) {
      $.ambiance({
        title: "Error!",
        message: "El descuento no puede ser mayor al 100%",
        type: "warning",
        fade: false,
      });

      $(this).val(99)
      calcularSuntotalFila();
      return false;
    }
    // const precio = $("#Precio").val()
    // let cantidad = $("#Cantidad").val()
    // Llama a la función para permitir solo números positivos y actualiza el valor del campo de entrada
    $(this).val(permitirNumerosPositivos(valor));
    calcularSuntotalFila();
    // //VAMOS A CALCULAR EL TOTAL
    // valor = parseInt(valor)
    // valor = valor = 0 ? 1 : valor / 100
    // let total = parseInt(cantidad) * parseInt(precio)
    // total = total - (total * valor)
    // $("#Total").val(total)

  });

  $('#cmbProducto').change(function (e) {
    cambiarCampos(e);
  })

  $("#abrirmodal").click(function () {
    ObtenerProducto();
    obtenerCliente();
  })

  $(document).on('click', '.editar', function () {
    // Obtener el ID del producto
    var idProducto = $(this).attr('id');
    var nombre, precio, descuento, cantidad, estado;
    ParameterJson = "";
    StoreProcedure = "";
    ParameterJson = `{"IdProducto":${idProducto}}`
    StoreProcedure = "[Negocio].[prObtenerProductos]";
    $.ajax({
      url: `${urlApi}?parameterJson=${ParameterJson}&storeProcedure=${StoreProcedure}`,
      method: "GET",
      dataType: "json",
      beforeSend: function () {
        bloquearPantalla();
      },
      success: function (response) {
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
      error: function (xhr, status, error) {
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

  $('#btnCerrarModal').click(function () {
    // Cerrar el modal
    $('#Nombre').val('');
    $('#Precio').val('');
    $('#Descuento').val('');
    $('#CantidadDisponible').val('');
    $('#Estado').val('');
  });
  // Evento click en el botón "Guardar" del modal
  $('#btnGuardarModal').click(function () {
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
    ParameterJson = JSON.stringify(objetoJson);
    StoreProcedure = "[Negocio].[prGuardarProducto]";
    $.ajax({
      url: `${urlApi}?parameterJson=${ParameterJson}&storeProcedure=${StoreProcedure}`,
      method: "GET",
      dataType: "json",
      beforeSend: function () {
        bloquearPantalla();
      },
      success: function (response) {
        desbloquearPantalla();
        CargarProducto();
        response = JSON.parse(response)[0]
        $.ambiance({
          title: response.status == 1 ? "Exito!" : "Error!",
          message: response.message,
          type: response.status == 1 ? "success" : "error",
          fade: false,
        });
      },
      error: function (xhr, status, error) {
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

function CargarProducto() {
  ParameterJson = "";
  StoreProcedure = "";
  ParameterJson = `{}`
  StoreProcedure = "[Negocio].[prObtenerProductos]";
  $.ajax({
    url: `${urlApi}?parameterJson=${ParameterJson}&storeProcedure=${StoreProcedure}`,
    method: "GET",
    dataType: "json",
    beforeSend: function () {
      bloquearPantalla();
    },
    success: function (response) {
      if (response) {
        desbloquearPantalla();
        CargarFilas(JSON.parse(response))
      }
    },
    error: function (xhr, status, error) {
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

function CargarFilas(datosFila) {
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

function ActivarInactivarProducto(estado, idProducto) {
  ParameterJson = "";
  StoreProcedure = "";
  var objetoJson = {
    IdProducto: idProducto,
    EstadoProducto: estado,
    EsInactivar: 1
  };
  ParameterJson = JSON.stringify(objetoJson);
  StoreProcedure = "[Negocio].[prGuardarProducto]";
  $.ajax({
    url: `${urlApi}?parameterJson=${ParameterJson}&storeProcedure=${StoreProcedure}`,
    method: "GET",
    dataType: "json",
    beforeSend: function () {
      bloquearPantalla();
    },
    success: function (response) {
      desbloquearPantalla();
      CargarProducto();
      response = JSON.parse(response)[0]
      $.ambiance({
        title: response.status == 1 ? "Exito!" : "Error!",
        message: response.message,
        type: response.status == 1 ? "success" : "error",
        fade: false,
      });
    },
    error: function (xhr, status, error) {
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

function ObtenerProducto() {
  ParameterJson = "";
  StoreProcedure = "";
  ParameterJson = `{}`
  StoreProcedure = "[Negocio].[prObtenerProductos]";
  $("#cmbProducto").empty();
  $.ajax({
    url: `${urlApi}?parameterJson=${ParameterJson}&storeProcedure=${StoreProcedure}`,
    method: "GET",
    dataType: "json",
    beforeSend: function () {
      bloquearPantalla();
    },
    success: function (response) {
      let options = [];
      response = JSON.parse(response);
      response.forEach(x => {
        let option = "";
        option = `<option value="${x.IdProducto}" data-precio="${x.PrecioUnitario}" data-descuento="${x.DescuentoPorcentaje}" data-cantidad= "${x.CantidadTotal}">${x.NombreProducto}</option>`;
        options.push(option);

      });
      $("#cmbProducto").append(options);
      $("#cmbProducto").val("");
      $("#cmbProducto").select2({
        placeholder: "Seleccione un Producto",
        width: "200px",
        allowClear: true
      });
      desbloquearPantalla();
    },
    error: function (xhr, status, error) {
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


function cambiarCampos(e) {
  let cmbProducto = $('#cmbProducto option:selected')
  if (cmbProducto.val()) {
    let precio = cmbProducto.data("precio")
    let descuento = cmbProducto.data("descuento")
    $("#Cantidad").val(1);
    $("#Precio").val(precio);
    $("#Descuento").val(descuento);

    descuento = descuento ? Number(descuento) / 100 : 0;
    precio = (Number(precio) * 1);
    let total = descuento > 0 ? precio * descuento : precio;
    $("#Total").val(total)
  } else {
    $("#Cantidad").val("");
    $("#Precio").val("");
    $("#Descuento").val("");
    $("#Total").val("");
  }
}

function calcularSuntotalFila() {

  let cantidad = $("#Cantidad").val();
  let precio = $("#Precio").val();
  let descuento = $("#Descuento").val();

  descuento = descuento ? Number(descuento) / 100 : 0;
  precio = precio ? Number(precio) : 0;
  cantidad = cantidad ? Number(cantidad) : 0;
  let subtotal = cantidad * precio;

  let total = descuento > 0 ? subtotal - (subtotal * descuento) : cantidad * precio;
  $("#Total").val(total || 0);
}

function obtenerCliente() {
  ParameterJson = "";
  StoreProcedure = "";
  ParameterJson = `{}`
  StoreProcedure = "[Negocio].[prObtenerClientes]";
  $.ajax({
    url: `${urlApi}?parameterJson=${ParameterJson}&storeProcedure=${StoreProcedure}`,
    method: "GET",
    dataType: "json",
    beforeSend: function () {
      bloquearPantalla();
    },
    success: function (response) {
      let options = [];
      response = JSON.parse(response);
      response.forEach(x => {
        let option = "";
        option = `<option value="${x.IdPersona}" data-nombre="${x.NombreCompleto}" data-cedula="${x.Identificacion}">${x.NombreCompleto}</option>`;
        options.push(option);

      });
      $("#cmbCliente").append(options);
      $("#cmbCliente").val("");
      $("#cmbCliente").select2({
        placeholder: "Seleccione un Cliente",
        width: "100%",
        allowClear: true
      });
      desbloquearPantalla();
    },
    error: function (xhr, status, error) {
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

function agregarFila() {
  let cmbProducto = $('#cmbProducto option:selected')
  let idProducto = cmbProducto.val();
  let producto = cmbProducto.text();
  let cantidad = $("#Cantidad").val();
  let precio = $("#Precio").val();
  let descuento = $("#Descuento").val();
  let total = $("#Total").val();

  let row = `<tr id="${idProducto}" data-idproducto=${idProducto} data-descuento="${descuento}" data-precio=${precio} data-cantidad=${cantidad}>
  <td>${producto}</td>
  <td>${cantidad}</td>
  <td>${precio}</td>
  <td>${descuento}</td>
  <td>${total}</td>
  <td> <a onclick="eliminarRegisro(this)" class="btn btn-danger" title="Eliminar"><i class="fa fa-trash" style="color:white"></i></a></td>
  </tr> `;
  $("#tbl-detalle-productos tbody").append(row);
  limpiarGrilla();
  calcularTotales();
}

function limpiarGrilla() {
  $("#Cantidad").val("");
  $("#Precio").val("");
  $("#Descuento").val("");
  $("#Total").val("");
  $("#cmbProducto").val("").trigger("change");

}

function calcularTotales() {

  let subtotal = 0;
  let descuento = 0;
  let total = 0;
  let rowprecio = 0;
  let rowdescuento = 0;
  let rowcantidad = 0;
  let rowsubtotal = 0;
  let rowtotal = 0;
  let CompraProductos = [];
  if ($("#tbl-detalle-productos tbody tr").length > 0) {
    $("#tbl-detalle-productos tbody tr").each(function (indice, valor) {

      rowprecio = 0;
      rowdescuento = 0;
      rowcantidad = 0;
      rowsubtotal = 0;
      rowtotal = 0;

      rowprecio = Number($(valor).data('precio'));
      rowdescuento = Number($(valor).data('descuento'));
      rowcantidad = Number($(valor).data('cantidad'));
      rowsubtotal = rowcantidad * rowprecio;
      rowdescuento = rowdescuento > 0 ? rowsubtotal * (rowdescuento / 100) : 0;

      rowtotal = rowdescuento > 0 ? rowsubtotal - (rowsubtotal * rowdescuento) : rowsubtotal;

      subtotal += rowsubtotal;
      descuento += rowdescuento;
      total += rowtotal;

      let CompraProducto = ""
      CompraProducto = `{"IdProducto":${Number($(valor).data('idproducto'))},"Cantidad":${Number($(valor).data('cantidad'))},"Descuento":${Number($(valor).data('descuento'))},"Precio":${Number($(valor).data('precio'))},"IdCliente":${$('#cmbCliente option:selected').val()},"Observacion":"${$("#Observacion").val()},"Subtotal":${subtotal},"DescuentoTotal":${descuento},"Total":${total}}`
      CompraProductos.push(CompraProducto)
    });

    $("#txtSubtotal").val(subtotal);
    $("#txtDescuento").val(descuento);
    $("#txtTotal").val(total);
  } else {
    $("#txtSubtotal").val(null);
    $("#txtDescuento").val(null);
    $("#txtTotal").val(null);
  }

  console.log(CompraProductos)
}

function eliminarRegisro(elemento) {
  // Obtener la fila padre del botón presionado
  var fila = $(elemento).closest('tr');

  // Eliminar la fila
  fila.remove();

  calcularTotales();
}