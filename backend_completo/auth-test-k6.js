import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuración del test largo
// export const options = {
//   scenarios: {
//     soak_test: {
//       executor: 'constant-vus',     
//       vus: 20,                      
//       duration: '30m',            
//       gracefulStop: '5m',           
//     },
//   },

//   thresholds: {
//     http_req_duration: ['p(95)<800'],
//     http_req_failed: ['rate<0.01'], // < 1 % de errores en toda la prueba
//   },

//   // alargar timeout HTTP porque la prueba es larga
//   ext: { http: { timeout: '60s' } },
// };

//Configuracion del test spike
export const options = {
  stages: [
    { duration: '30s', target: 5 },   // calentamiento
    { duration: '10s', target: 100 }, // spike
    { duration: '10s', target: 5 },   // descompresión
    { duration: '10s', target: 0 },   // apagado
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], 
    http_req_failed: ['rate<0.05'],               
  },
  ext: { http: { timeout: '60s' } },
};

function generarCorreo() {
    return `user_${__VU}_${__ITER}}@test.com`;
}

// Funcion que se ejecuta por cada usuario virtual(VU) en cada iteracion
export default function () {
    //1. Generar un correo único para cada usuario virtual

    const correo = generarCorreo();
    const contrasenia = `123456`;

    //2. Intentar el registro de usuario
    let resRegister = http.post('http://192.168.100.21:3000/api/auth/register', JSON.stringify({
        correo: correo,
        contraseña: contrasenia
    })
    , {
        headers: { 'Content-Type': 'application/json' }
    });

    //verificar que la respuesta sea un 201 (creado)
    check(resRegister, {
        'Registro exitoso': (res) => res.status === 201
    });

    //3. Realizamos el login de usuario registrado en la misma iteración
    let resLogin = http.post('http://192.168.100.21:3000/api/auth/login', JSON.stringify({
        correo: correo,
        contraseña: contrasenia
    })
    , {
        headers: { 'Content-Type': 'application/json' }
    });
    //verificar que la respuesta sea un 200 (ok)
    check(resLogin, {
        'Login exitoso': (res) => res.status === 200 && res.json('token') !== undefined,
        'token presente': (res) => !!res.json('token')
    });
    
    // Probar con POST y GET CONCURRENTES 

    const token = resLogin.json('token');
    const params = {
        headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        },
    };
    
    const [resPost, resGet] = http.batch([
        [
        'POST',
        'http://192.168.100.21:3000/api/reservas',
        JSON.stringify({ fecha: '2025-07-31', sala: 'B', hora: '11:00 PM' }),
            { 
                ...params, 
                tags: { tipo: 'post' } 
            },
        ],
        [
        'GET',
        'http://192.168.100.21:3000/api/reservas',
        null,
        { ...params, tags: { tipo: 'get' } },
        ],
    ]);

    check(resPost, { 'POST 201': r => r.status === 201 });
    check(resGet,  { 'GET 200' : r => r.status === 200 });

    //4. esperar 1 segundo antes de recibir
    sleep(1);
}
