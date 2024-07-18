
import 'jquery'; // Asegúrate de importar jQuery

declare global {
  interface JQuery {
    datepicker(options?: any): JQuery;
  }
}
