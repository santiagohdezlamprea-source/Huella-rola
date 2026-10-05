# Huella Rola 🌱

Calculadora de huella de carbono pensada para alguien que vive en Bogotá.

🔗 **Demo:** https://santiagohdezlamprea-source.github.io/huella-rola/

## De dónde salió

En la universidad trabajamos en equipo una app de huella de carbono (CarbonLess) usando
Extreme Programming. Me quedé con ganas de hacer una versión propia, más corta y
aterrizada a Colombia. Las calculadoras que encontraba eran gringas: preguntaban por
calefacción y millas, y nada de recibo de Enel, gas de Vanti o TransMilenio.

## Qué hace

- Cuestionario de 4 pasos: casa, transporte, comida y vuelos
- Muestra el total en toneladas de CO₂ al año y cuánto pesa cada categoría
- Lo compara con la meta de 2 t por persona para 2050 y con el promedio mundial
- Da un tip según lo que más te pesa
- Botón para copiar el resultado y compartirlo

## Factores que usé (aproximados)

| Qué | Factor | Nota |
|---|---|---|
| Electricidad | 0,13 kg CO₂/kWh | Red de Colombia, mucha hidroeléctrica. El valor oficial lo publica la UPME cada año y cambia según la sequía |
| Gas natural | 1,98 kg CO₂/m³ | |
| Carro / taxi | 0,19 kg/km | Carro a gasolina promedio, 1 ocupante |
| Moto | 0,07 kg/km | |
| TransMilenio / SITP | 0,04 kg/km por pasajero | |
| Comida | 1,2 – 2,5 t/año | Según cuánta carne se come |
| Vuelo nacional i/v | 110 kg | |
| Vuelo internacional i/v | 750 kg | Tipo Bogotá–Miami |

No es un estudio científico, es para darse una idea. Si alguien tiene mejores datos, bienvenido el issue.

## Tecnologías

HTML, CSS y JavaScript puro.

## Lo que aprendí

- Manejar un formulario por pasos sin librerías (mostrar/ocultar `fieldset`)
- Que los factores de emisión cambian muchísimo de país a país: en Colombia la luz contamina mucho menos que en EE. UU.
