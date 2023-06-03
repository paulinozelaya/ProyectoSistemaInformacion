$(document).ready(function () {

    let EstaLogueado = localStorage.getItem("UsuarioLogueado")

    if(!EstaLogueado){
        if(window.location.href.includes("localhost") || window.location.href.includes("127.0.0.1")){
            window.location.href = window.location.origin
        }else{
            window.location.href = 'https://paulinozelaya.github.io/ProyectoSistemaInformacion/'
        }
        return false;
    }

    $("#btnCerrarSesion").click(function(){
        if(window.location.href.includes("localhost") || window.location.href.includes("127.0.0.1")){
            window.location.href = window.location.origin
        }else{
            window.location.href = 'https://paulinozelaya.github.io/ProyectoSistemaInformacion/'
        }
    })

    if($("#mainContent").html() == ''){
        loadPage("pages/home.html")
    }

  $('.solo-numero').bind('keypress', function (e) {
      var regex = new RegExp("^[0-9]+$");
      var key = String.fromCharCode(!event.CharCode ? event.which : event.CharCode)
      if (!regex.test(key)) {
          event.preventDefault();
          return false;
      }
  });

  $('.solo-letras').bind('keypress', function (e) {
      var regex = new RegExp("^[a-zA-Z]+$");
      var key = String.fromCharCode(!event.CharCode ? event.which : event.CharCode)
      if (!regex.test(key)) {
          event.preventDefault();
          return false;
      }
  });

  $('.letrasYnumeros').bind('keypress', function (e) {
      var regex = new RegExp("^[a-zA-Z0-9]+$");
      var key = String.fromCharCode(!event.CharCode ? event.which : event.CharCode)
      if (!regex.test(key)) {
          event.preventDefault();
          return false;
      }
  });

  $("#rptEmpleado").on('click', function () {
      $("#Home").hide();
      document.getElementById("rpt").innerHTML = '<embed src="/Reportes/rptEmpleados" class="w-100" style="min-height:100vh;"/>'
  });

  $("#rptEstudiante").on('click', function () {
      $("#Home").hide();
      document.getElementById("rpt").innerHTML = '<embed src="/Reportes/rptEstudiantes" class="w-100" style="min-height:100vh;"/>'
  });

  $("#lblNombreUsuario").html($.cookie('Usuario'));
  $("#lblCargo").html($.cookie('Cargo'));

  if ($('.sidevar.active').prop('margin-left', '0')) {
      $('#sidebarCollapse_').hide();
  } else {
      $('#sidebarCollapse_').show();
  }

  $('.Reducido').hide();

  $("#sidebar").mCustomScrollbar({
      theme: "minimal"
  });

  $('#sidebarCollapse').on('click', function () {

      $('#sidebar, #content').toggleClass('active');
      $('.collapse.in').toggleClass('in');
      $('a[aria-expanded=true]').attr('aria-expanded', 'false');


      if (($('#sidebar').hasClass('active'))) {
          $('.sidebar-header').hide();
          $('.Reducido').show();
          $('#sidebarCollapse_').show();
      } else {
          $('.sidebar-header').show();
          $('.Reducido').hide();
          $('#sidebarCollapse_').hide();
      }
  });

  $('#sidebarCollapse_1').on('click', function () {

      $('#sidebar, #content').toggleClass('active');
      $('.collapse.in').toggleClass('in');
      $('a[aria-expanded=true]').attr('aria-expanded', 'false');


      if (($('#sidebar').hasClass('active'))) {
          $('.sidebar-header').hide();
          $('.Reducido').show();
          //$('#sidebarCollapse_').show();
      } else {
          $('.sidebar-header').show();
          $('.Reducido').hide();
          //$('#sidebarCollapse_').hide();
      }
  });

  $('#sidebarCollapse_').on('click', function () {

      $('#sidebar, #content').toggleClass('active');
      $('.collapse.in').toggleClass('in');
      $('a[aria-expanded=true]').attr('aria-expanded', 'false');


      if (($('#sidebar').hasClass('active'))) {
          $('.sidebar-header').hide();
          $('.Reducido').show();
          $('#sidebarCollapse_').show();
      } else {
          $('.sidebar-header').show();
          $('.Reducido').hide();
          $('#sidebarCollapse_').hide();
      }
  });

});

function loadPage(page) {
  $('#mainContent').load(page);
}

function permisos() {
  //ESTUDIANTE
  (localStorage.permisos.includes("AggEst")) ? ($(".AggEst").show()) : ($(".AggEst").remove());
  (localStorage.permisos.includes("ElimEst")) ? ($(".ElimEst").show()) : ($(".ElimEst").remove());
  (localStorage.permisos.includes("EdiEst")) ? ($(".EdiEst").show()) : ($(".EdiEst").remove());
  (localStorage.permisos.includes("ListEst")) ? ($(".ListEst").show()) : ($(".ListEst").remove());
  (localStorage.permisos.includes("Estudiante")) ? ($(".Estudiante").show()) : ($(".Estudiante").remove());


  //EMPLEADO
  (localStorage.permisos.includes("ElimEmp")) ? ($(".ElimEmp").show()) : ($(".ElimEmp").remove());
  (localStorage.permisos.includes("EdiEmp")) ? ($(".EdiEmp").show()) : ($(".EdiEmp").remove());
  (localStorage.permisos.includes("ListEmp")) ? ($(".ListEmp").show()) : ($(".ListEmp").remove());
  (localStorage.permisos.includes("AggEmp")) ? ($(".AggEmp").show()) : ($(".AggEmp").remove());
  (localStorage.permisos.includes("Empleado")) ? ($(".Empleado").show()) : ($(".Empleado").remove());

  //ASIGNATURA
  (localStorage.permisos.includes("AggAsig")) ? ($(".AggAsig").show()) : ($(".AggAsig").remove());
  (localStorage.permisos.includes("ElimAsig")) ? ($(".ElimAsig").show()) : ($(".ElimAsig").remove());
  (localStorage.permisos.includes("EdiAsig")) ? ($(".EdiAsig").show()) : ($(".EdiAsig").remove());
  (localStorage.permisos.includes("ListAsig")) ? ($(".ListAsig").show()) : ($(".ListAsig").remove());
  (localStorage.permisos.includes("Asignatura")) ? ($(".Asignatura").show()) : ($(".Asignatura").remove());

  //PAGOS
  (localStorage.permisos.includes("AggPag")) ? ($(".AggPag").show()) : ($(".AggPag").remove());
  (localStorage.permisos.includes("ElimPag")) ? ($(".ElimPag").show()) : ($(".ElimPag").remove());
  (localStorage.permisos.includes("EdiPag")) ? ($(".EdiPag").show()) : ($(".EdiPag").remove());
  (localStorage.permisos.includes("ListPag")) ? ($(".ListPag").show()) : ($(".ListPag").remove());
  (localStorage.permisos.includes("Pagos")) ? ($(".Pagos").show()) : ($(".Pagos").remove());

  //TIPOPAGO
  (localStorage.permisos.includes("AggTP")) ? ($(".AggTP").show()) : ($(".AggTP").remove());
  (localStorage.permisos.includes("ElimTP")) ? ($(".ElimTP").show()) : ($(".ElimTP").remove());
  (localStorage.permisos.includes("EdiTP")) ? ($(".EdiTP").show()) : ($(".EdiTP").remove());
  (localStorage.permisos.includes("ListTP")) ? ($(".ListTP").show()) : ($(".ListTP").remove());
  (localStorage.permisos.includes("Pagos")) ? ($(".Pagos").show()) : ($(".Pagos").remove());

  //CARGO
  (localStorage.permisos.includes("AggCarg")) ? ($(".AggCarg").show()) : ($(".AggCarg").remove());
  (localStorage.permisos.includes("ElimCarg")) ? ($(".ElimCarg").show()) : ($(".ElimCarg").remove());
  (localStorage.permisos.includes("EdiCarg")) ? ($(".EdiCarg").show()) : ($(".EdiCarg").remove());
  (localStorage.permisos.includes("ListCarg")) ? ($(".ListCarg").show()) : ($(".ListCarg").remove());
  (localStorage.permisos.includes("Cargos")) ? ($(".Cargos").show()) : ($(".Cargos").remove());

  //CUENTAUSUARIO
  (localStorage.permisos.includes("AggCuen")) ? ($(".AggCuen").show()) : ($(".AggCuen").remove());
  (localStorage.permisos.includes("ElimCuen")) ? ($(".ElimCuen").show()) : ($(".ElimCuen").remove());
  (localStorage.permisos.includes("EdiCuen")) ? ($(".EdiCuen").show()) : ($(".EdiCuen").remove());
  (localStorage.permisos.includes("ListCuen")) ? ($(".ListCuen").show()) : ($(".ListCuen").remove());
  (localStorage.permisos.includes("CuentaUsuario")) ? ($(".CuentaUsuario").show()) : ($(".CuentaUsuario").remove());

  //CUENTAUSUARIO
  (localStorage.permisos.includes("ListRep")) ? ($(".ListRep").show()) : ($(".ListRep").remove());
  (localStorage.permisos.includes("Reporte")) ? ($(".Reporte").show()) : ($(".Reporte").remove());

  //MODULOS
  $("#liCatalogo li").length === 0 ? $("#liCatalogo").remove() : ""
  $("#liAdministracion li").length === 0 ? $("#liAdministracion").remove() : ""
  $("#liReportes li").length === 0 ? $("#liReportes").remove() : ""

}