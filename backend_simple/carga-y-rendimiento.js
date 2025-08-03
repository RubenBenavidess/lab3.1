import http from 'k6/http';
import {sleep, check} from 'k6';

// Configuración de la prueba
export let options = {
    //Definir las etapas de la prueba con el modelo stage
    stages: [
        { duration: '10s', target: 10 }, // Calentamiento: 10 usuarios en 10 segundos
        { duration: '30s', target: 300 }, // Carga sostenida: 50 usuarios en 30 segundos
        { duration: '10s', target: 0 } // Enfriamiento: reducir a 0 usuarios en 10 segundos
    ],
    //Umbrales de rendimiento
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% de las solicitudes deben responder en menos de 500 ms
        http_req_failed: ['rate<0.01'] // Menos del 1% de las solicitudes deben fallar
    }
};

//Función principal de la prueba
export default function () {
    //Enviar la solicitud GET a la ruta /api/hello
    let res = http.get('http://192.168.100.21:3000/api/hello');

    //Verificar que la respuesta sea 200 OK
    check(res, {
        'status 200': (r) => r.status === 200,
        'respuesta en < 500 ms': (r) => r.timings.duration < 500
    });

    //Dormir para simular tiempo entre solicitudes
    sleep(1);
}



