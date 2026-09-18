// ============================================================
// CLASE PRINCIPAL - SimuladorLogisticoApp
// ============================================================

// ============================================================
// VISOR 3D SIMPLIFICADO Y FUNCIONAL
// ============================================================

console.log("DEBUG: About to define SimuladorLogisticoApp class");
var SimuladorLogisticoApp = class SimuladorLogisticoApp {
    constructor() {
        // --- Estado 3D ---
        this.escena = null;
        this.camara = null;
        this.renderizador = null;
        this.controlesOrbita = null;
        this.controlesArrastre = null;
        this.meshesArrastrables = [];
        this.listaContenedores = [];
        this.idContenedorActivo = 0;
        this.nextPalletId = 1;
        this.inicializado = false;
        this.mallaContenedor = null;
        this.lineasContenedor = null;
        this.datosPalletSeleccionado = null;
        this.meshResaltadoContorno = null;
        this.raycaster = null;
        this.mouse = null;
        
        // --- Paleta de colores ---
        this.coloresPaleta = [0x2980b9, 0x27ae60, 0xe67e22, 0x8e44ad, 0xf1c40f, 0x16a085, 0xe74c3c, 0x3498db, 0x2c3e50, 0x1abc9c];
        
        // --- Catálogos de unidades ---
        this.catalogosUnidades = {
            AEREO: [
                { texto: "ULD AKE LD3 (Max: 1,588 kg)", val: "1.56|1.53|1.60|1588|AKE LD3" },
                { texto: "ULD AAP LD9 (Max: 4,626 kg)", val: "3.17|2.23|1.62|4626|AAP LD9" },
                { texto: "Paleta PMC P6P (Max: 5,000 kg)", val: "3.17|2.44|2.44|5000|PMC P6P" },
                { texto: "Paleta PAG AMA (Max: 5,443 kg)", val: "3.17|2.44|2.44|5443|PAG AMA" },
                { texto: "Paleta PLA L-7 (Max: 3,175 kg)", val: "2.23|1.53|1.62|3175|PLA L-7" },
                { texto: "Contenedor AAU A-2 (Max: 4,600 kg)", val: "1.56|1.53|1.62|4600|AAU A-2" }
            ],
            MARITIMO: [
                { texto: "Contenedor 20' Dry Van (Max: 28,000 kg)", val: "5.90|2.35|2.39|28000|20ft DV" },
                { texto: "Contenedor 20' Open Top (Max: 24,000 kg)", val: "5.90|2.35|2.39|24000|20ft OT" },
                { texto: "Contenedor 20' Reefer (Max: 21,000 kg)", val: "5.45|2.29|2.27|21000|20ft Reefer" },
                { texto: "Contenedor 20' Flat Rack (Max: 25,000 kg)", val: "5.65|2.20|2.20|25000|20ft FR" },
                { texto: "Contenedor 40' Dry Van (Max: 28,500 kg)", val: "12.03|2.35|2.39|28500|40ft DV" },
                { texto: "Contenedor 40' High Cube (Max: 28,600 kg)", val: "12.03|2.35|2.69|28600|40ft HC" },
                { texto: "Contenedor 40' Open Top (Max: 26,500 kg)", val: "12.03|2.35|2.39|26500|40ft OT" },
                { texto: "Contenedor 40' Reefer (Max: 24,000 kg)", val: "11.59|2.29|2.50|24000|40ft Reefer" },
                { texto: "Contenedor 40' Flat Rack (Max: 35,000 kg)", val: "11.65|2.20|2.20|35000|40ft FR" },
                { texto: "Contenedor 45' Pallet Wide (Max: 24,000 kg)", val: "13.56|2.47|2.70|24000|45ft PW" }
            ],
            SIN_CONTENEDOR: [
                { texto: "Suelo Terrestre / Libre (Sin Límite)", val: "10.00|8.00|4.00|999999|Zona Libre" },
                { texto: "Almacén Pequeño (6×4×3 m)", val: "6.00|4.00|3.00|999999|Almacén P" },
                { texto: "Almacén Mediano (12×6×4 m)", val: "12.00|6.00|4.00|999999|Almacén M" },
                { texto: "Almacén Grande (20×10×6 m)", val: "20.00|10.00|6.00|999999|Almacén G" }
            ]
        };
        
        // --- Tipos de carga ---
        this.tiposCarga = {
            caja: { nombre: 'Caja', largo: 1.20, ancho: 0.80, alto: 1.00 },
            pallet_europeo: { nombre: 'Pallet Europeo', largo: 1.20, ancho: 0.80, alto: 1.00 },
            pallet_americano: { nombre: 'Pallet Americano', largo: 1.20, ancho: 1.00, alto: 1.20 },
            bidon: { nombre: 'Bidón', largo: 0.60, ancho: 0.60, alto: 0.90 },
            saco: { nombre: 'Saco', largo: 0.80, ancho: 0.60, alto: 0.50 },
            tubo: { nombre: 'Tubo', largo: 3.00, ancho: 0.30, alto: 0.30 },
            personalizado: { nombre: 'Personalizado', largo: 1.00, ancho: 0.80, alto: 0.60 }
        };
        
        // --- Países completo (todos los UN reconocidos) ---
        this.paisesCatalogo = {
            'AF': { nombre: 'Afganistán', continente: 'Asia', moneda: 'AFN', arancelBase: 10 },
            'AL': { nombre: 'Albania', continente: 'Europa', moneda: 'ALL', arancelBase: 5 },
            'DE': { nombre: 'Alemania', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'AD': { nombre: 'Andorra', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'AO': { nombre: 'Angola', continente: 'África', moneda: 'AOA', arancelBase: 12 },
            'AG': { nombre: 'Antigua y Barbuda', continente: 'América', moneda: 'XCD', arancelBase: 10 },
            'SA': { nombre: 'Arabia Saudita', continente: 'Asia', moneda: 'SAR', arancelBase: 5 },
            'AR': { nombre: 'Argentina', continente: 'América', moneda: 'ARS', arancelBase: 15 },
            'AM': { nombre: 'Armenia', continente: 'Asia', moneda: 'AMD', arancelBase: 5 },
            'AU': { nombre: 'Australia', continente: 'Oceanía', moneda: 'AUD', arancelBase: 5 },
            'AT': { nombre: 'Austria', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'AZ': { nombre: 'Azerbaiyán', continente: 'Asia', moneda: 'AZN', arancelBase: 8 },
            'BS': { nombre: 'Bahamas', continente: 'América', moneda: 'BSD', arancelBase: 10 },
            'BH': { nombre: 'Baréin', continente: 'Asia', moneda: 'BHD', arancelBase: 5 },
            'BD': { nombre: 'Bangladés', continente: 'Asia', moneda: 'BDT', arancelBase: 15 },
            'BB': { nombre: 'Barbados', continente: 'América', moneda: 'BBD', arancelBase: 10 },
            'BE': { nombre: 'Bélgica', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'BZ': { nombre: 'Belice', continente: 'América', moneda: 'BZD', arancelBase: 10 },
            'BJ': { nombre: 'Benín', continente: 'África', moneda: 'XOF', arancelBase: 12 },
            'BY': { nombre: 'Bielorrusia', continente: 'Europa', moneda: 'BYN', arancelBase: 8 },
            'MM': { nombre: 'Birmania', continente: 'Asia', moneda: 'MMK', arancelBase: 12 },
            'BO': { nombre: 'Bolivia', continente: 'América', moneda: 'BOB', arancelBase: 10 },
            'BA': { nombre: 'Bosnia y Herzegovina', continente: 'Europa', moneda: 'BAM', arancelBase: 5 },
            'BW': { nombre: 'Botsuana', continente: 'África', moneda: 'BWP', arancelBase: 10 },
            'BR': { nombre: 'Brasil', continente: 'América', moneda: 'BRL', arancelBase: 15 },
            'BN': { nombre: 'Brunéi', continente: 'Asia', moneda: 'BND', arancelBase: 5 },
            'BG': { nombre: 'Bulgaria', continente: 'Europa', moneda: 'BGN', arancelBase: 0 },
            'BF': { nombre: 'Burkina Faso', continente: 'África', moneda: 'XOF', arancelBase: 12 },
            'BI': { nombre: 'Burundi', continente: 'África', moneda: 'BIF', arancelBase: 15 },
            'BT': { nombre: 'Bután', continente: 'Asia', moneda: 'BTN', arancelBase: 12 },
            'CV': { nombre: 'Cabo Verde', continente: 'África', moneda: 'CVE', arancelBase: 10 },
            'KH': { nombre: 'Camboya', continente: 'Asia', moneda: 'KHR', arancelBase: 12 },
            'CM': { nombre: 'Camerún', continente: 'África', moneda: 'XAF', arancelBase: 12 },
            'CA': { nombre: 'Canadá', continente: 'América', moneda: 'CAD', arancelBase: 3 },
            'QA': { nombre: 'Catar', continente: 'Asia', moneda: 'QAR', arancelBase: 5 },
            'TD': { nombre: 'Chad', continente: 'África', moneda: 'XAF', arancelBase: 15 },
            'CL': { nombre: 'Chile', continente: 'América', moneda: 'CLP', arancelBase: 8 },
            'CN': { nombre: 'China', continente: 'Asia', moneda: 'CNY', arancelBase: 15 },
            'CY': { nombre: 'Chipre', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'CO': { nombre: 'Colombia', continente: 'América', moneda: 'COP', arancelBase: 10 },
            'KM': { nombre: 'Comoras', continente: 'África', moneda: 'KMF', arancelBase: 12 },
            'KP': { nombre: 'Corea del Norte', continente: 'Asia', moneda: 'KPW', arancelBase: 15 },
            'KR': { nombre: 'Corea del Sur', continente: 'Asia', moneda: 'KRW', arancelBase: 8 },
            'CI': { nombre: 'Costa de Marfil', continente: 'África', moneda: 'XOF', arancelBase: 12 },
            'CR': { nombre: 'Costa Rica', continente: 'América', moneda: 'CRC', arancelBase: 8 },
            'HR': { nombre: 'Croacia', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'CU': { nombre: 'Cuba', continente: 'América', moneda: 'CUP', arancelBase: 15 },
            'DK': { nombre: 'Dinamarca', continente: 'Europa', moneda: 'DKK', arancelBase: 0 },
            'DM': { nombre: 'Dominica', continente: 'América', moneda: 'XCD', arancelBase: 10 },
            'EC': { nombre: 'Ecuador', continente: 'América', moneda: 'USD', arancelBase: 10 },
            'EG': { nombre: 'Egipto', continente: 'África', moneda: 'EGP', arancelBase: 15 },
            'SV': { nombre: 'El Salvador', continente: 'América', moneda: 'USD', arancelBase: 8 },
            'AE': { nombre: 'Emiratos Árabes Unidos', continente: 'Asia', moneda: 'AED', arancelBase: 5 },
            'ER': { nombre: 'Eritrea', continente: 'África', moneda: 'ERN', arancelBase: 15 },
            'SK': { nombre: 'Eslovaquia', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'SI': { nombre: 'Eslovenia', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'ES': { nombre: 'España', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'US': { nombre: 'Estados Unidos', continente: 'América', moneda: 'USD', arancelBase: 5 },
            'EE': { nombre: 'Estonia', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'ET': { nombre: 'Etiopía', continente: 'África', moneda: 'ETB', arancelBase: 15 },
            'PH': { nombre: 'Filipinas', continente: 'Asia', moneda: 'PHP', arancelBase: 10 },
            'FI': { nombre: 'Finlandia', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'FJ': { nombre: 'Fiyi', continente: 'Oceanía', moneda: 'FJD', arancelBase: 8 },
            'FR': { nombre: 'Francia', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'GA': { nombre: 'Gabón', continente: 'África', moneda: 'XAF', arancelBase: 12 },
            'GM': { nombre: 'Gambia', continente: 'África', moneda: 'GMD', arancelBase: 12 },
            'GE': { nombre: 'Georgia', continente: 'Asia', moneda: 'GEL', arancelBase: 5 },
            'GH': { nombre: 'Ghana', continente: 'África', moneda: 'GHS', arancelBase: 12 },
            'GD': { nombre: 'Granada', continente: 'América', moneda: 'XCD', arancelBase: 10 },
            'GR': { nombre: 'Grecia', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'GT': { nombre: 'Guatemala', continente: 'América', moneda: 'GTQ', arancelBase: 8 },
            'GN': { nombre: 'Guinea', continente: 'África', moneda: 'GNF', arancelBase: 12 },
            'GQ': { nombre: 'Guinea Ecuatorial', continente: 'África', moneda: 'XAF', arancelBase: 12 },
            'GW': { nombre: 'Guinea-Bisáu', continente: 'África', moneda: 'XOF', arancelBase: 12 },
            'GY': { nombre: 'Guyana', continente: 'América', moneda: 'GYD', arancelBase: 10 },
            'HT': { nombre: 'Haití', continente: 'América', moneda: 'HTG', arancelBase: 10 },
            'HN': { nombre: 'Honduras', continente: 'América', moneda: 'HNL', arancelBase: 8 },
            'HU': { nombre: 'Hungría', continente: 'Europa', moneda: 'HUF', arancelBase: 0 },
            'IN': { nombre: 'India', continente: 'Asia', moneda: 'INR', arancelBase: 18 },
            'ID': { nombre: 'Indonesia', continente: 'Asia', moneda: 'IDR', arancelBase: 12 },
            'IQ': { nombre: 'Irak', continente: 'Asia', moneda: 'IQD', arancelBase: 8 },
            'IR': { nombre: 'Irán', continente: 'Asia', moneda: 'IRR', arancelBase: 15 },
            'IE': { nombre: 'Irlanda', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'IS': { nombre: 'Islandia', continente: 'Europa', moneda: 'ISK', arancelBase: 3 },
            'IL': { nombre: 'Israel', continente: 'Asia', moneda: 'ILS', arancelBase: 5 },
            'IT': { nombre: 'Italia', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'JM': { nombre: 'Jamaica', continente: 'América', moneda: 'JMD', arancelBase: 10 },
            'JP': { nombre: 'Japón', continente: 'Asia', moneda: 'JPY', arancelBase: 5 },
            'JO': { nombre: 'Jordania', continente: 'Asia', moneda: 'JOD', arancelBase: 8 },
            'KZ': { nombre: 'Kazajistán', continente: 'Asia', moneda: 'KZT', arancelBase: 5 },
            'KE': { nombre: 'Kenia', continente: 'África', moneda: 'KES', arancelBase: 12 },
            'KG': { nombre: 'Kirguistán', continente: 'Asia', moneda: 'KGS', arancelBase: 5 },
            'KI': { nombre: 'Kiribati', continente: 'Oceanía', moneda: 'AUD', arancelBase: 8 },
            'KW': { nombre: 'Kuwait', continente: 'Asia', moneda: 'KWD', arancelBase: 5 },
            'LA': { nombre: 'Laos', continente: 'Asia', moneda: 'LAK', arancelBase: 10 },
            'LS': { nombre: 'Lesoto', continente: 'África', moneda: 'LSL', arancelBase: 10 },
            'LV': { nombre: 'Letonia', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'LB': { nombre: 'Líbano', continente: 'Asia', moneda: 'LBP', arancelBase: 8 },
            'LR': { nombre: 'Liberia', continente: 'África', moneda: 'LRD', arancelBase: 12 },
            'LY': { nombre: 'Libia', continente: 'África', moneda: 'LYD', arancelBase: 12 },
            'LI': { nombre: 'Liechtenstein', continente: 'Europa', moneda: 'CHF', arancelBase: 3 },
            'LT': { nombre: 'Lituania', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'LU': { nombre: 'Luxemburgo', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'MG': { nombre: 'Madagascar', continente: 'África', moneda: 'MGA', arancelBase: 12 },
            'MY': { nombre: 'Malasia', continente: 'Asia', moneda: 'MYR', arancelBase: 8 },
            'MW': { nombre: 'Malaui', continente: 'África', moneda: 'MWK', arancelBase: 12 },
            'MV': { nombre: 'Maldivas', continente: 'Asia', moneda: 'MVR', arancelBase: 10 },
            'ML': { nombre: 'Mali', continente: 'África', moneda: 'XOF', arancelBase: 12 },
            'MT': { nombre: 'Malta', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'MA': { nombre: 'Marruecos', continente: 'África', moneda: 'MAD', arancelBase: 12 },
            'MH': { nombre: 'Islas Marshall', continente: 'Oceanía', moneda: 'USD', arancelBase: 8 },
            'MU': { nombre: 'Mauricio', continente: 'África', moneda: 'MUR', arancelBase: 10 },
            'MR': { nombre: 'Mauritania', continente: 'África', moneda: 'MRU', arancelBase: 12 },
            'DZ': { nombre: 'Argelia', continente: 'África', moneda: 'DZD', arancelBase: 15 },
            'MX': { nombre: 'México', continente: 'América', moneda: 'MXN', arancelBase: 8 },
            'FM': { nombre: 'Micronesia', continente: 'Oceanía', moneda: 'USD', arancelBase: 8 },
            'MD': { nombre: 'Moldavia', continente: 'Europa', moneda: 'MDL', arancelBase: 5 },
            'MC': { nombre: 'Mónaco', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'MN': { nombre: 'Mongolia', continente: 'Asia', moneda: 'MNT', arancelBase: 8 },
            'ME': { nombre: 'Montenegro', continente: 'Europa', moneda: 'EUR', arancelBase: 5 },
            'MZ': { nombre: 'Mozambique', continente: 'África', moneda: 'MZN', arancelBase: 12 },
            'NA': { nombre: 'Namibia', continente: 'África', moneda: 'NAD', arancelBase: 10 },
            'NR': { nombre: 'Nauru', continente: 'Oceanía', moneda: 'AUD', arancelBase: 8 },
            'NP': { nombre: 'Nepal', continente: 'Asia', moneda: 'NPR', arancelBase: 12 },
            'NI': { nombre: 'Nicaragua', continente: 'América', moneda: 'NIO', arancelBase: 8 },
            'NE': { nombre: 'Níger', continente: 'África', moneda: 'XOF', arancelBase: 12 },
            'NG': { nombre: 'Nigeria', continente: 'África', moneda: 'NGN', arancelBase: 15 },
            'NO': { nombre: 'Noruega', continente: 'Europa', moneda: 'NOK', arancelBase: 3 },
            'NZ': { nombre: 'Nueva Zelanda', continente: 'Oceanía', moneda: 'NZD', arancelBase: 5 },
            'OM': { nombre: 'Omán', continente: 'Asia', moneda: 'OMR', arancelBase: 5 },
            'NL': { nombre: 'Países Bajos', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'PK': { nombre: 'Pakistán', continente: 'Asia', moneda: 'PKR', arancelBase: 15 },
            'PW': { nombre: 'Palaos', continente: 'Oceanía', moneda: 'USD', arancelBase: 8 },
            'PA': { nombre: 'Panamá', continente: 'América', moneda: 'PAB', arancelBase: 8 },
            'PG': { nombre: 'Papúa Nueva Guinea', continente: 'Oceanía', moneda: 'PGK', arancelBase: 8 },
            'PY': { nombre: 'Paraguay', continente: 'América', moneda: 'PYG', arancelBase: 10 },
            'PE': { nombre: 'Perú', continente: 'América', moneda: 'PEN', arancelBase: 8 },
            'PL': { nombre: 'Polonia', continente: 'Europa', moneda: 'PLN', arancelBase: 0 },
            'PT': { nombre: 'Portugal', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'GB': { nombre: 'Reino Unido', continente: 'Europa', moneda: 'GBP', arancelBase: 0 },
            'CF': { nombre: 'República Centroafricana', continente: 'África', moneda: 'XAF', arancelBase: 12 },
            'CG': { nombre: 'República del Congo', continente: 'África', moneda: 'XAF', arancelBase: 12 },
            'CD': { nombre: 'República Democrática del Congo', continente: 'África', moneda: 'CDF', arancelBase: 15 },
            'CZ': { nombre: 'República Checa', continente: 'Europa', moneda: 'CZK', arancelBase: 0 },
            'MK': { nombre: 'Macedonia del Norte', continente: 'Europa', moneda: 'MKD', arancelBase: 5 },
            'DO': { nombre: 'República Dominicana', continente: 'América', moneda: 'DOP', arancelBase: 10 },
            'RW': { nombre: 'Ruanda', continente: 'África', moneda: 'RWF', arancelBase: 12 },
            'RO': { nombre: 'Rumania', continente: 'Europa', moneda: 'RON', arancelBase: 0 },
            'RU': { nombre: 'Rusia', continente: 'Asia', moneda: 'RUB', arancelBase: 8 },
            'WS': { nombre: 'Samoa', continente: 'Oceanía', moneda: 'WST', arancelBase: 8 },
            'KN': { nombre: 'San Cristóbal y Nieves', continente: 'América', moneda: 'XCD', arancelBase: 10 },
            'SM': { nombre: 'San Marino', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'VC': { nombre: 'San Vicente y las Granadinas', continente: 'América', moneda: 'XCD', arancelBase: 10 },
            'LC': { nombre: 'Santa Lucía', continente: 'América', moneda: 'XCD', arancelBase: 10 },
            'ST': { nombre: 'Santo Tomé y Príncipe', continente: 'África', moneda: 'STN', arancelBase: 12 },
            'SN': { nombre: 'Senegal', continente: 'África', moneda: 'XOF', arancelBase: 12 },
            'RS': { nombre: 'Serbia', continente: 'Europa', moneda: 'RSD', arancelBase: 5 },
            'SC': { nombre: 'Seychelles', continente: 'África', moneda: 'SCR', arancelBase: 10 },
            'SL': { nombre: 'Sierra Leona', continente: 'África', moneda: 'SLL', arancelBase: 12 },
            'SG': { nombre: 'Singapur', continente: 'Asia', moneda: 'SGD', arancelBase: 5 },
            'SY': { nombre: 'Siria', continente: 'Asia', moneda: 'SYP', arancelBase: 12 },
            'SO': { nombre: 'Somalia', continente: 'África', moneda: 'SOS', arancelBase: 15 },
            'LK': { nombre: 'Sri Lanka', continente: 'Asia', moneda: 'LKR', arancelBase: 12 },
            'SZ': { nombre: 'Suazilandia', continente: 'África', moneda: 'SZL', arancelBase: 10 },
            'ZA': { nombre: 'Sudáfrica', continente: 'África', moneda: 'ZAR', arancelBase: 12 },
            'SD': { nombre: 'Sudán', continente: 'África', moneda: 'SDG', arancelBase: 15 },
            'SS': { nombre: 'Sudán del Sur', continente: 'África', moneda: 'SSP', arancelBase: 15 },
            'SE': { nombre: 'Suecia', continente: 'Europa', moneda: 'SEK', arancelBase: 0 },
            'CH': { nombre: 'Suiza', continente: 'Europa', moneda: 'CHF', arancelBase: 3 },
            'SR': { nombre: 'Surinam', continente: 'América', moneda: 'SRD', arancelBase: 10 },
            'TH': { nombre: 'Tailandia', continente: 'Asia', moneda: 'THB', arancelBase: 10 },
            'TZ': { nombre: 'Tanzania', continente: 'África', moneda: 'TZS', arancelBase: 12 },
            'TJ': { nombre: 'Tayikistán', continente: 'Asia', moneda: 'TJS', arancelBase: 8 },
            'TL': { nombre: 'Timor Oriental', continente: 'Asia', moneda: 'USD', arancelBase: 10 },
            'TG': { nombre: 'Togo', continente: 'África', moneda: 'XOF', arancelBase: 12 },
            'TO': { nombre: 'Tonga', continente: 'Oceanía', moneda: 'TOP', arancelBase: 8 },
            'TT': { nombre: 'Trinidad y Tobago', continente: 'América', moneda: 'TTD', arancelBase: 10 },
            'TN': { nombre: 'Túnez', continente: 'África', moneda: 'TND', arancelBase: 12 },
            'TM': { nombre: 'Turkmenistán', continente: 'Asia', moneda: 'TMT', arancelBase: 8 },
            'TR': { nombre: 'Turquía', continente: 'Asia', moneda: 'TRY', arancelBase: 8 },
            'TV': { nombre: 'Tuvalu', continente: 'Oceanía', moneda: 'AUD', arancelBase: 8 },
            'UA': { nombre: 'Ucrania', continente: 'Europa', moneda: 'UAH', arancelBase: 5 },
            'UG': { nombre: 'Uganda', continente: 'África', moneda: 'UGX', arancelBase: 12 },
            'UY': { nombre: 'Uruguay', continente: 'América', moneda: 'UYU', arancelBase: 10 },
            'UZ': { nombre: 'Uzbekistán', continente: 'Asia', moneda: 'UZS', arancelBase: 8 },
            'VU': { nombre: 'Vanuatu', continente: 'Oceanía', moneda: 'VUV', arancelBase: 8 },
            'VA': { nombre: 'Ciudad del Vaticano', continente: 'Europa', moneda: 'EUR', arancelBase: 0 },
            'VE': { nombre: 'Venezuela', continente: 'América', moneda: 'VES', arancelBase: 15 },
            'VN': { nombre: 'Vietnam', continente: 'Asia', moneda: 'VND', arancelBase: 12 },
            'YE': { nombre: 'Yemen', continente: 'Asia', moneda: 'YER', arancelBase: 12 },
            'DJ': { nombre: 'Yibuti', continente: 'África', moneda: 'DJF', arancelBase: 12 },
            'ZM': { nombre: 'Zambia', continente: 'África', moneda: 'ZMW', arancelBase: 12 },
            'ZW': { nombre: 'Zimbabue', continente: 'África', moneda: 'ZWL', arancelBase: 15 },
            'XK': { nombre: 'Kosovo', continente: 'Europa', moneda: 'EUR', arancelBase: 5 }
        };
        
        // --- Bind de métodos ---
        this.init = this.init.bind(this);
        this.cambiarModalidad = this.cambiarModalidad.bind(this);
        this.agregarContenedor = this.agregarContenedor.bind(this);
        this.seleccionarContenedor = this.seleccionarContenedor.bind(this);
        this.actualizarUnidadActiva = this.actualizarUnidadActiva.bind(this);
        this.crearCarga = this.crearCarga.bind(this);
        this.eliminarUltimaCarga = this.eliminarUltimaCarga.bind(this);
        this.actualizarCostos = this.actualizarCostos.bind(this);
        this.actualizarInterfazGlobal = this.actualizarInterfazGlobal.bind(this);
        this.actualizarTablaPacking = this.actualizarTablaPacking.bind(this);
        this.guardarEstado = this.guardarEstado.bind(this);
        this.cargarEstado = this.cargarEstado.bind(this);
        this.cambiarVista = this.cambiarVista.bind(this);
        this.cargarTipoPredefinido = this.cargarTipoPredefinido.bind(this);
        this.actualizarPreviewDimension = this.actualizarPreviewDimension.bind(this);
        this.guardarMaterial = this.guardarMaterial.bind(this);
        this.verificarInvasiones = this.verificarInvasiones.bind(this);
        this.exportarCSV = this.exportarCSV.bind(this);
        this.exportarPDF = this.exportarPDF.bind(this);
        this.cargarPaisesEnSelectores = this.cargarPaisesEnSelectores.bind(this);
        this.cargarMaterialesEnSelector = this.cargarMaterialesEnSelector.bind(this);
        this.renderizarMaterialesDelPalletActivo = this.renderizarMaterialesDelPalletActivo.bind(this);
        this.eliminarMaterialDePallet = this.eliminarMaterialDePallet.bind(this);
        this.seleccionarPalletPorId = this.seleccionarPalletPorId.bind(this);
        this.eliminarMaterialDesdePacking = this.eliminarMaterialDesdePacking.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.animate = this.animate.bind(this);
        this.onClick = this.onClick.bind(this);
        this.seleccionarPalletPorMesh = this.seleccionarPalletPorMesh.bind(this);
        this.deseleccionarPallet = this.deseleccionarPallet.bind(this);
        this.verificarEstadoVisor = this.verificarEstadoVisor.bind(this);
    }

    // ============================================================
    // INICIALIZACIÓN PRINCIPAL
    // ============================================================
    
    init() {
        if (this.inicializado) return;
        this.inicializado = true;
        
        console.log(" Inicializando simulador 3D...");
        
        if (typeof THREE === 'undefined') {
            console.error(" Three.js no está disponible");
            const container = document.getElementById('canvas3d-container');
            if (container) {
                container.innerHTML = `
                    <div style="display:flex; align-items:center; justify-content:center; height:100%; background:#1a1a2e; color:white; flex-direction:column; padding:20px;">
                        <div style="font-size:48px; margin-bottom:16px;"></div>
                        <h3>Three.js no está cargado</h3>
                        <p style="color:#888; text-align:center;">Revisa tu conexión a internet y recarga la página.</p>
                        <button onclick="location.reload()" style="margin-top:16px; padding:10px 24px; background:#007AFF; color:white; border:none; border-radius:8px; cursor:pointer;">Recargar</button>
                    </div>
                `;
            }
            return;
        }
        
        try {
            this.cargarPaisesEnSelectores();
            this.cargarMaterialesEnSelector();
            this.init3D();
            this.cambiarModalidad();
            this.cargarTipoPredefinido();
            this.actualizarCostos();

            if (typeof proyecto !== 'undefined' && proyecto) {
                if (proyecto.logistica) {
                    this.cargarEstado();
                } else {
                    const localData = localStorage.getItem('simuladorLogistico');
                    if (localData) {
                        try {
                            const estado = JSON.parse(localData);
                            proyecto.logistica = estado;
                            this.cargarEstado();
                        } catch (e) {
                            console.warn('Error migrando datos logísticos:', e);
                        }
                    }
                }
            }

            if (this.listaContenedores.length === 0) {
                this.agregarContenedor();
            }
            
            document.getElementById('logIncoterm')?.addEventListener('change', () => this.actualizarCostos());
            document.getElementById('logPaisOrigen')?.addEventListener('change', () => this.actualizarCostos());
            document.getElementById('logPaisDestino')?.addEventListener('change', () => this.actualizarCostos());
            document.getElementById('logValorMercancia')?.addEventListener('input', () => this.actualizarCostos());
            document.getElementById('logTipoCarga')?.addEventListener('change', () => this.cargarTipoPredefinido());
            
            console.log(" Simulador 3D listo");
        } catch (e) {
            console.error(" Error al inicializar simulador 3D:", e);
            this.inicializado = false;
            mostrarToast(" Error 3D: " + e.message, 'error');
        }
    }

    // ============================================================
    // INICIALIZACIÓN 3D
    // ============================================================
    
    init3D() {
    const contenedorVisor = document.getElementById('canvas3d-container');
    if (!contenedorVisor) {
        console.error(" No se encuentra el contenedor 3D");
        return;
    }
    
    //  FORZAR TAMAÑO COMPLETO
    contenedorVisor.style.width = '100%';
    contenedorVisor.style.height = '100%';
    contenedorVisor.style.minHeight = '500px';
    contenedorVisor.style.position = 'relative';
    contenedorVisor.style.overflow = 'hidden';
    
    // Limpiar contenedor
    while (contenedorVisor.firstChild) {
        contenedorVisor.removeChild(contenedorVisor.firstChild);
    }
    
    // Obtener dimensiones REALES del contenedor
    const w = contenedorVisor.clientWidth || 500;
    const h = contenedorVisor.clientHeight || 450;
    
    console.log(` Dimensiones del visor: ${w}x${h}`);
    
    // Crear escena
    this.escena = new THREE.Scene();
    this.escena.background = new THREE.Color(0x1a1a2e);

    // Crear cámara con aspect ratio correcto
    this.camara = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    this.camara.position.set(7, 5, 9);
    this.camara.lookAt(0, 1, 0);

    // Crear renderizador
    this.renderizador = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: false,
        powerPreference: "high-performance"
    });
    this.renderizador.setSize(w, h);
    this.renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderizador.shadowMap.enabled = true;
    this.renderizador.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderizador.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderizador.toneMappingExposure = 1.2;
    this.renderizador.outputEncoding = THREE.sRGBEncoding;
    
    //  Asegurar que el canvas ocupa todo el contenedor
    this.renderizador.domElement.style.width = '100%';
    this.renderizador.domElement.style.height = '100%';
    this.renderizador.domElement.style.display = 'block';
    
    contenedorVisor.appendChild(this.renderizador.domElement);

    // Controles Orbita
    this.controlesOrbita = new THREE.OrbitControls(this.camara, this.renderizador.domElement);
    this.controlesOrbita.enableDamping = true;
    this.controlesOrbita.dampingFactor = 0.1;
    this.controlesOrbita.target.set(0, 1, 0);
    this.controlesOrbita.minDistance = 2;
    this.controlesOrbita.maxDistance = 30;
    this.controlesOrbita.maxPolarAngle = Math.PI / 2.1;
    this.controlesOrbita.update();

    // Luces
    const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x1a1a2e, 0.6);
    this.escena.add(hemisphereLight);
    
    const dirLight = new THREE.DirectionalLight(0xffeedd, 2.0);
    dirLight.position.set(8, 15, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 50;
    dirLight.shadow.camera.left = -15;
    dirLight.shadow.camera.right = 15;
    dirLight.shadow.camera.top = 15;
    dirLight.shadow.camera.bottom = -15;
    this.escena.add(dirLight);
    
    const fillLight = new THREE.DirectionalLight(0x4488ff, 0.5);
    fillLight.position.set(-8, 5, -6);
    this.escena.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.6);
    rimLight.position.set(-5, 3, 10);
    this.escena.add(rimLight);

    // Suelo
    const gridHelper = new THREE.GridHelper(20, 24, 0x4a6fa5, 0x2c3e50);
    gridHelper.position.y = 0.01;
    this.escena.add(gridHelper);

    // Raycaster
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Evento de clic para selección
    this.renderizador.domElement.addEventListener('click', this.onClick);
    // Evento de hover para tooltip
    this.renderizador.domElement.addEventListener('mousemove', (e) => { this.onHover(e); });

    //  Evento de resize con actualización completa
    window.addEventListener('resize', () => {
        this.onWindowResize();
    });

    //  También observar cambios en el contenedor (para cuando se muestra/oculta)
    if (window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(() => {
            this.onWindowResize();
        });
        resizeObserver.observe(contenedorVisor);
        this._resizeObserver = resizeObserver;
    }

    // Tecla R para rotar
    window.addEventListener('keydown', (e) => {
        if ((e.key === 'r' || e.key === 'R') && this.datosPalletSeleccionado) {
            const mesh = this.datosPalletSeleccionado.mesh;
            mesh.rotation.y += Math.PI / 2;
            mesh.rotation.y = mesh.rotation.y % (Math.PI * 2);
            if (this.meshResaltadoContorno) {
                this.meshResaltadoContorno.rotation.copy(mesh.rotation);
            }
            this.actualizarInterfazGlobal();
            this.guardarEstado();
            mostrarToast(' Carga rotada 90°', 'success');
        }
    });

    // Configurar Drag Controls
    this.configurarDragControls();

    // Iniciar animación
    this.animate();
    
    console.log(" Entorno 3D inicializado con tamaño:", w, "x", h);
    
}
// ============================================================
// CALCULAR PESO TOTAL POR PALLET
// ============================================================
    
calcularPesoPallet(bulto) {
    let pesoTotal = 0;
    if (bulto.materiales && bulto.materiales.length > 0) {
        bulto.materiales.forEach(mat => {
            pesoTotal += mat.peso || 0;
        });
    }
    return pesoTotal;
}

// ============================================================
// OBTENER HS CODE DE UN MATERIAL
// ============================================================
    
obtenerHsCode(materialId) {
    if (!materialId) return 'N/A';
    const material = proyecto.materiales?.find(m => m.id === materialId);
    if (material) {
        // Buscar en diferentes campos donde pueda estar el HS Code
        return material.hsCode || material.partNumber || material.codigo || 'N/A';
    }
    return 'N/A';
}

// ============================================================
// CALCULAR COSTE DEL EQUIPAMIENTO (CONTENEDOR/ULD)
// ============================================================
    
calcularCosteEquipamiento(contenedor) {
    if (!contenedor) return 0;
    
    // Coste base según tipo de contenedor
    let costeBase = 0;
    const modo = document.getElementById('logModalidad')?.value || 'AEREO';
    
    if (modo === 'AEREO') {
        // ULD: coste por alquiler
        costeBase = 150 + (contenedor.L * contenedor.A * 0.5);
    } else if (modo === 'MARITIMO') {
        // Contenedor marítimo: coste por día
        costeBase = 200 + (contenedor.L * 0.8);
    } else {
        // Suelo/Almacén: coste por m²
        costeBase = 50 + (contenedor.L * contenedor.A * 2);
    }
    
    // Añadir coste por peso utilizado
    const pesoTotal = contenedor.bultos.reduce((acc, b) => acc + this.calcularPesoPallet(b), 0);
    const porcentajeUso = contenedor.maxPeso > 0 ? Math.min(100, (pesoTotal / contenedor.maxPeso) * 100) : 0;
    const costePorPeso = (porcentajeUso / 100) * 300; // Coste adicional por uso
    
    return Math.round(costeBase + costePorPeso);
}

// ============================================================
// ACTUALIZAR PACKING LIST MEJORADO
// ============================================================
    
actualizarTablaPacking() {
    const tbody = document.getElementById('logPackingBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (this.listaContenedores.length === 0) {
        tbody.innerHTML = '<tr><td colspan="13" style="text-align: center; padding: 20px; color: #666;">No hay contenedores. Crea uno para comenzar.</td></tr>';
        return;
    }

    let totalGeneralPeso = 0;
    let totalGeneralCosto = 0;
    let totalGeneralMateriales = 0;

    this.listaContenedores.forEach(c => {
        // Calcular coste del equipamiento para este contenedor
        const costeEquipamiento = this.calcularCosteEquipamiento(c);
        totalGeneralCosto += costeEquipamiento;
        
        // Si no tiene bultos, mostrar fila vacía
        if (c.bultos.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><span style="background:#34495e; color:white; padding:2px 8px; border-radius:4px; font-size:0.7rem;">${c.nombre.split(' (')[0]}</span></td>
                <td colspan="11" style="text-align: center; color: #666;">Sin cargas</td>
                <td style="text-align: right; font-weight: bold;">${costeEquipamiento.toFixed(2)}</td>
            `;
            tbody.appendChild(tr);
            return;
        }
        
        c.bultos.forEach(b => {
            const alturaSuelo = (b.mesh.position.y - b.alto / 2).toFixed(2);
            const contenedorNombre = c.nombre.split(' (')[0];
            const colorHex = '#' + b.colorOriginal.toString(16).padStart(6, '0');
            const pesoPallet = this.calcularPesoPallet(b);
            totalGeneralPeso += pesoPallet;
            
            // Calcular coste del pallet (proporcional al peso que ocupa)
            const pesoTotalContenedor = c.bultos.reduce((acc, p) => acc + this.calcularPesoPallet(p), 0);
            const porcentajePallet = pesoTotalContenedor > 0 ? (pesoPallet / pesoTotalContenedor) : 0;
            const costePallet = costeEquipamiento * porcentajePallet;
            
            if (b.materiales.length > 0) {
                b.materiales.forEach((m, matIndex) => {
                    const hsCode = this.obtenerHsCode(m.materialId);
                    totalGeneralMateriales += m.cantidad;
                    
                    const tr = document.createElement('tr');
                    tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
                    tr.innerHTML = `
                        <td><span style="background:#34495e; color:white; padding:2px 8px; border-radius:4px; font-size:0.7rem;">${contenedorNombre}</span></td>
                        <td><strong>PL-${b.id}</strong></td>
                        <td>${b.tag}</td>
                        <td><span style="display:inline-block; width:12px; height:12px; background:${colorHex}; border-radius:2px;"></span> ${b.tipo || 'Carga'}</td>
                        <td>${b.largo.toFixed(2)}×${b.ancho.toFixed(2)}×${b.alto.toFixed(2)}</td>
                        <td>${alturaSuelo} m</td>
                        <td>${m.nombre}</td>
                        <td><span style="background:rgba(0,122,255,0.2); padding:2px 6px; border-radius:4px; font-size:10px; font-family: monospace;">${hsCode}</span></td>
                        <td style="text-align: center;">${m.cantidad}</td>
                        <td style="text-align: center; font-weight: bold;">${m.peso.toFixed(1)}</td>
                        <td style="text-align: center; font-size: 10px; color: #888;">
                            ${matIndex === 0 ? `<span style="font-weight: bold; color: #f1c40f;">${pesoPallet.toFixed(1)} kg</span>` : ''}
                        </td>
                        <td style="text-align: right; font-size: 11px;">
                            ${matIndex === 0 ? `<span style="font-weight: bold; color: #FF8C00;">$${costePallet.toFixed(2)}</span>` : ''}
                        </td>
                        <td style="text-align: center;">
                            <button class="btn btn-secondary btn-small" style="font-size: 9px; padding: 2px 6px;" onclick="window.appLogistica?.seleccionarPalletPorId(${b.id})"></button>
                            <button class="btn btn-danger btn-small" style="font-size: 9px; padding: 2px 6px;" onclick="window.appLogistica?.eliminarMaterialDesdePacking(${c.id}, ${b.id}, ${matIndex})"></button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            } else {
                // Bulto sin materiales
                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
                tr.innerHTML = `
                    <td><span style="background:#34495e; color:white; padding:2px 8px; border-radius:4px; font-size:0.7rem;">${contenedorNombre}</span></td>
                    <td><strong>PL-${b.id}</strong></td>
                    <td>${b.tag}</td>
                    <td><span style="display:inline-block; width:12px; height:12px; background:${colorHex}; border-radius:2px;"></span> ${b.tipo || 'Carga'}</td>
                    <td>${b.largo.toFixed(2)}×${b.ancho.toFixed(2)}×${b.alto.toFixed(2)}</td>
                    <td>${alturaSuelo} m</td>
                    <td colspan="3" style="color:var(--text-muted); text-align: center;">Sin inventario</td>
                    <td style="text-align: center;">0</td>
                    <td style="text-align: center; font-size: 10px; color: #888;">0 kg</td>
                    <td style="text-align: right; font-size: 11px;">$0.00</td>
                    <td style="text-align: center;">
                        <button class="btn btn-secondary btn-small" style="font-size: 9px; padding: 2px 6px;" onclick="window.appLogistica?.seleccionarPalletPorId(${b.id})"></button>
                    </td>
                `;
                tbody.appendChild(tr);
            }
        });
    });

    // Añadir fila de totales
    if (this.listaContenedores.length > 0) {
        const trTotal = document.createElement('tr');
        trTotal.style.background = 'rgba(0,122,255,0.15)';
        trTotal.style.fontWeight = 'bold';
        trTotal.innerHTML = `
            <td colspan="9" style="padding: 12px; text-align: right; font-size: 13px;"> TOTALES GENERALES:</td>
            <td style="padding: 12px; text-align: center; font-size: 13px; color: #f1c40f;">${totalGeneralPeso.toFixed(1)} kg</td>
            <td style="padding: 12px; text-align: center; font-size: 12px; color: #888;">-</td>
            <td style="padding: 12px; text-align: right; font-size: 13px; color: #FF8C00; font-weight: bold;">$${totalGeneralCosto.toFixed(2)}</td>
            <td style="padding: 12px; text-align: center; font-size: 11px; color: #888;">${totalGeneralMateriales} materiales</td>
        `;
        tbody.appendChild(trTotal);
    }
}

// ============================================================
// EXPORTAR CSV MEJORADO CON TODOS LOS DATOS
// ============================================================
    
exportarCSV() {
    if (this.listaContenedores.length === 0) {
        mostrarToast('No hay datos para exportar', 'warning');
        return;
    }

    let csv = "Unidad,ID Carga,Etiqueta,Tipo,Largo (m),Ancho (m),Alto (m),Altura Suelo (m),Material,HS Code,Cantidad,Peso Material (kg),Peso Pallet (kg),Coste Pallet ($),Coste Equipamiento ($)\n";
    
    this.listaContenedores.forEach(c => {
        const costeEquipamiento = this.calcularCosteEquipamiento(c);
        const pesoTotalContenedor = c.bultos.reduce((acc, p) => acc + this.calcularPesoPallet(p), 0);
        
        c.bultos.forEach(b => {
            const alturaSuelo = (b.mesh.position.y - b.alto / 2).toFixed(2);
            const pesoPallet = this.calcularPesoPallet(b);
            const porcentajePallet = pesoTotalContenedor > 0 ? (pesoPallet / pesoTotalContenedor) : 0;
            const costePallet = costeEquipamiento * porcentajePallet;
            
            if (b.materiales.length > 0) {
                b.materiales.forEach(m => {
                    const hsCode = this.obtenerHsCode(m.materialId);
                    csv += `${c.nombre.split(' (')[0]},PL-${b.id},${b.tag},${b.tipo || 'Carga'},${b.largo.toFixed(2)},${b.ancho.toFixed(2)},${b.alto.toFixed(2)},${alturaSuelo},${m.nombre},${hsCode},${m.cantidad},${m.peso},${pesoPallet.toFixed(1)},${costePallet.toFixed(2)},${costeEquipamiento.toFixed(2)}\n`;
                });
            } else {
                csv += `${c.nombre.split(' (')[0]},PL-${b.id},${b.tag},${b.tipo || 'Carga'},${b.largo.toFixed(2)},${b.ancho.toFixed(2)},${b.alto.toFixed(2)},${alturaSuelo},VACÍO,N/A,0,0,${pesoPallet.toFixed(1)},${costePallet.toFixed(2)},${costeEquipamiento.toFixed(2)}\n`;
            }
        });
    });

    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `packing_list_completo_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    mostrarToast(' Packing List completo exportado a CSV', 'success');
}

// ============================================================
// EXPORTAR PDF MEJORADO
// ============================================================
    
exportarPDF() {
    if (this.listaContenedores.length === 0) {
        mostrarToast('No hay datos para exportar a PDF', 'warning');
        return;
    }

    const ventana = window.open('', '_blank');
    if (!ventana) {
        mostrarToast(' No se pudo abrir la ventana. Permite popups.', 'error');
        return;
    }

    let tablaHtml = '';
    let totalGeneralPeso = 0;
    let totalGeneralCosto = 0;

    this.listaContenedores.forEach(c => {
        const costeEquipamiento = this.calcularCosteEquipamiento(c);
        const pesoTotalContenedor = c.bultos.reduce((acc, p) => acc + this.calcularPesoPallet(p), 0);
        
        c.bultos.forEach(b => {
            const pesoPallet = this.calcularPesoPallet(b);
            totalGeneralPeso += pesoPallet;
            const porcentajePallet = pesoTotalContenedor > 0 ? (pesoPallet / pesoTotalContenedor) : 0;
            const costePallet = costeEquipamiento * porcentajePallet;
            totalGeneralCosto += costePallet;
            
            if (b.materiales.length > 0) {
                b.materiales.forEach(m => {
                    const hsCode = this.obtenerHsCode(m.materialId);
                    tablaHtml += `
                        <tr>
                            <td>${c.nombre.split(' (')[0]}</td>
                            <td>PL-${b.id}</td>
                            <td>${b.tag}</td>
                            <td>${m.nombre}</td>
                            <td>${hsCode}</td>
                            <td style="text-align:center;">${m.cantidad}</td>
                            <td style="text-align:center;">${m.peso.toFixed(1)}</td>
                            <td style="text-align:center; font-weight:bold;">${pesoPallet.toFixed(1)}</td>
                            <td style="text-align:right; font-weight:bold; color:#FF8C00;">$${costePallet.toFixed(2)}</td>
                            <td style="text-align:right; color:#666;">$${costeEquipamiento.toFixed(2)}</td>
                        </tr>
                    `;
                });
            } else {
                tablaHtml += `
                    <tr>
                        <td>${c.nombre.split(' (')[0]}</td>
                        <td>PL-${b.id}</td>
                        <td>${b.tag}</td>
                        <td colspan="2" style="text-align:center; color:#888;">VACÍO</td>
                        <td style="text-align:center;">0</td>
                        <td style="text-align:center;">0</td>
                        <td style="text-align:center; font-weight:bold;">${pesoPallet.toFixed(1)}</td>
                        <td style="text-align:right; font-weight:bold; color:#FF8C00;">$${costePallet.toFixed(2)}</td>
                        <td style="text-align:right; color:#666;">$${costeEquipamiento.toFixed(2)}</td>
                    </tr>
                `;
            }
        });
    });

    ventana.document.write(`
        <html>
        <head>
            <title>Packing List Completo</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; background: #fff; }
                h1 { color: #007AFF; text-align: center; }
                .subtitle { text-align: center; color: #666; margin-bottom: 30px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; }
                th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; }
                th { background: #007AFF; color: white; font-weight: bold; }
                .total-row { background: #f0f7ff; font-weight: bold; }
                .total-row td { border-top: 2px solid #007AFF; }
                .footer { margin-top: 30px; text-align: center; color: #888; font-size: 11px; border-top: 1px solid #eee; padding-top: 20px; }
                .right { text-align: right; }
                .center { text-align: center; }
                .badge { background: #007AFF; color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px; }
                .summary { display: flex; justify-content: space-around; background: #f8f9fa; padding: 16px; border-radius: 8px; margin: 20px 0; }
                .summary-item { text-align: center; }
                .summary-item .label { font-size: 11px; color: #666; }
                .summary-item .value { font-size: 20px; font-weight: bold; color: #007AFF; }
            </style>
        </head>
        <body>
            <h1> PACKING LIST COMPLETO</h1>
            <p class="subtitle">Generado: ${new Date().toLocaleString('es-ES')} | Proyecto: ${proyecto?.nombre || 'Sin proyecto'}</p>
            
            <div class="summary">
                <div class="summary-item">
                    <div class="label"> Total Contenedores</div>
                    <div class="value">${this.listaContenedores.length}</div>
                </div>
                <div class="summary-item">
                    <div class="label"> Total Cargas</div>
                    <div class="value">${this.listaContenedores.reduce((acc, c) => acc + c.bultos.length, 0)}</div>
                </div>
                <div class="summary-item">
                    <div class="label"> Peso Total</div>
                    <div class="value">${totalGeneralPeso.toFixed(1)} kg</div>
                </div>
                <div class="summary-item">
                    <div class="label"> Coste Total</div>
                    <div class="value" style="color: #FF8C00;">$${totalGeneralCosto.toFixed(2)}</div>
                </div>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Unidad</th>
                        <th>ID</th>
                        <th>Etiqueta</th>
                        <th>Material</th>
                        <th>HS Code</th>
                        <th style="text-align:center;">Cant.</td>
                        <th style="text-align:center;">Peso Mat. (kg)</td>
                        <th style="text-align:center;">Peso Pallet (kg)</td>
                        <th style="text-align:right;">Coste Pallet</td>
                        <th style="text-align:right;">Coste Equip.</td>
                    </tr>
                </thead>
                <tbody>
                    ${tablaHtml}
                </tbody>
                <tfoot>
                    <tr class="total-row">
                        <td colspan="7" style="text-align:right; font-size:13px;">TOTALES:</td>
                        <td style="text-align:center; font-size:13px;">${totalGeneralPeso.toFixed(1)} kg</td>
                        <td style="text-align:right; font-size:13px; color:#FF8C00;">$${totalGeneralCosto.toFixed(2)}</td>
                        <td style="text-align:right; font-size:12px; color:#666;">-</td>
                    </tr>
                </tfoot>
            </table>
            
            <div class="footer">
                <p>Documento generado por PMI Mind - Simulador Logístico 3D</p>
                <p style="font-size:10px;">* Los costes son estimados según el tipo de contenedor y el peso utilizado</p>
            </div>
            
            <script>
                window.onload = function() {
                    setTimeout(function() {
                        window.print();
                        setTimeout(function() { window.close(); }, 1000);
                    }, 500);
                };
            <\/script>
        </body>
        </html>
    `);
    ventana.document.close();
    ventana.focus();
}

    // ============================================================
    // CONFIGURAR DRAG CONTROLS
    // ============================================================
    
    configurarDragControls() {
        if (this.controlesArrastre) {
            this.controlesArrastre.dispose();
        }
        
        this.controlesArrastre = new THREE.DragControls(
            this.meshesArrastrables, 
            this.camara, 
            this.renderizador.domElement
        );
        
        this.controlesArrastre.addEventListener('dragstart', (event) => {
            this.controlesOrbita.enabled = false;
        });
        
        this.controlesArrastre.addEventListener('drag', (event) => {
            this.limitarMovimiento(event.object);
            if (this.meshResaltadoContorno && this.datosPalletSeleccionado) {
                this.meshResaltadoContorno.position.copy(event.object.position);
                this.meshResaltadoContorno.rotation.copy(event.object.rotation);
            }
        });
        
        this.controlesArrastre.addEventListener('dragend', (event) => {
            this.controlesOrbita.enabled = true;
            this.resolverSolapes(event.object);
            this.verificarInvasiones();
            this.actualizarInterfazGlobal();
            this._persistirEstado();
        });
    }

    // ============================================================
    // LIMITAR MOVIMIENTO
    // ============================================================
    
    limitarMovimiento(mesh) {
        const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
        if (!contActual) return;
        
        const datosBulto = contActual.bultos.find(b => b.mesh === mesh);
        if (!datosBulto) return;
        
        const angulo = mesh.rotation.y;
        const esGiro90 = Math.abs(Math.sin(angulo)) > 0.1;
        
        const anchoEfectivo = esGiro90 ? datosBulto.largo : datosBulto.ancho;
        const largoEfectivo = esGiro90 ? datosBulto.ancho : datosBulto.largo;
        
        const semilargo = largoEfectivo / 2;
        const semiancho = anchoEfectivo / 2;
        const semiAlto = datosBulto.alto / 2;
        
        mesh.position.x = Math.max(-contActual.L / 2 + semilargo, Math.min(contActual.L / 2 - semilargo, mesh.position.x));
        mesh.position.z = Math.max(-contActual.A / 2 + semiancho, Math.min(contActual.A / 2 - semiancho, mesh.position.z));
        mesh.position.y = Math.max(semiAlto, Math.min(contActual.H - semiAlto, mesh.position.y));
    }

    // ============================================================
    // CLICK PARA SELECCIÓN
    // ============================================================
    
    onClick(event) {
        console.log(" Click en el visor 3D");
        
        if (!this.renderizador || !this.raycaster) return;
        
        const rect = this.renderizador.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camara);
        const intersecciones = this.raycaster.intersectObjects(this.meshesArrastrables);
        
        if (intersecciones.length > 0) {
            console.log(" Objeto seleccionado:", intersecciones[0].object);
            this.seleccionarPalletPorMesh(intersecciones[0].object);
        } else {
            console.log(" No se seleccionó ningún objeto");
            this.deseleccionarPallet();
        }
    }

    // ============================================================
    // HOVER TOOLTIP
    // ============================================================

    onHover(event) {
        const rect = this.renderizador.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camara);
        const intersecciones = this.raycaster.intersectObjects(this.meshesArrastrables);
        const tooltip = document.getElementById('log3dTooltip');
        if (!tooltip) return;
        if (intersecciones.length > 0) {
            const mesh = intersecciones[0].object;
            const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
            const bulto = contActual?.bultos.find(b => b.mesh === mesh);
            if (bulto) {
                let html = `<strong style="color:#f1c40f;"> PL-${bulto.id}</strong><br>`;
                html += `<span style="color:#aaa;">${bulto.tag}</span><br>`;
                html += `<span style="color:#888;font-size:11px;">${(bulto.largo).toFixed(2)}×${(bulto.ancho).toFixed(2)}×${(bulto.alto).toFixed(2)} m</span>`;
                if (bulto.materiales.length > 0) {
                    html += `<hr style="border-color:rgba(255,255,255,0.08); margin:6px 0;">`;
                    html += `<span style="color:#888;font-size:10px;">CONTENIDO:</span><br>`;
                    bulto.materiales.forEach(m => {
                        html += `<span style="font-size:11px;"> ${m.nombre} <span style="color:#888;">x${m.cantidad} (${m.peso} kg)</span></span><br>`;
                    });
                } else {
                    html += `<br><span style="color:#555;font-size:11px;">Vacío</span>`;
                }
                tooltip.innerHTML = html;
                tooltip.style.display = 'block';
                const visorRect = this.renderizador.domElement.getBoundingClientRect();
                let tx = event.clientX - visorRect.left + 15;
                let ty = event.clientY - visorRect.top - 10;
                if (tx + 290 > visorRect.width) tx = event.clientX - visorRect.left - 290;
                if (ty + 150 > visorRect.height) ty = visorRect.height - 160;
                if (ty < 0) ty = 5;
                tooltip.style.left = tx + 'px';
                tooltip.style.top = ty + 'px';
                this.renderizador.domElement.style.cursor = 'pointer';
                return;
            }
        }
        tooltip.style.display = 'none';
        this.renderizador.domElement.style.cursor = 'default';
    }

    // ============================================================
    // SELECCIÓN DE PALLET
    // ============================================================
    
    seleccionarPalletPorMesh(mesh) {
    console.log(" Seleccionando pallet...");
    
    const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
    if (!contActual) {
        console.warn(" No hay contenedor activo");
        return;
    }
    
    const bultoFound = contActual.bultos.find(b => b.mesh === mesh);
    if (!bultoFound) {
        console.warn(" Bulto no encontrado en el contenedor activo");
        return;
    }
    
    console.log(` Bulto seleccionado: PL-${bultoFound.id} (${bultoFound.tag})`);
    this.datosPalletSeleccionado = bultoFound;
    
    // Eliminar resaltado anterior
    if (this.meshResaltadoContorno && this.escena) {
        this.escena.remove(this.meshResaltadoContorno);
        this.meshResaltadoContorno = null;
    }
    
    // Crear nuevo resaltado
    try {
        const geomContorno = mesh.geometry.clone();
        const matContorno = new THREE.MeshBasicMaterial({ 
            color: 0xf1c40f, 
            wireframe: true,
            transparent: true,
            opacity: 0.9
        });
        this.meshResaltadoContorno = new THREE.Mesh(geomContorno, matContorno);
        this.meshResaltadoContorno.position.copy(mesh.position);
        this.meshResaltadoContorno.rotation.copy(mesh.rotation);
        this.meshResaltadoContorno.scale.set(1.05, 1.05, 1.05);
        this.escena.add(this.meshResaltadoContorno);
    } catch(e) {
        console.warn("Error al crear contorno:", e);
    }

    //  ACTUALIZAR EL PANEL DE MATERIALES
    const panel = document.getElementById('logSeccionMateriales');
    if (panel) {
        panel.style.opacity = "1";
        panel.style.pointerEvents = "auto";
        panel.style.background = 'rgba(0,122,255,0.05)';
        panel.style.border = '1px solid #007AFF';
    }
    
    const titulo = document.getElementById('logTituloMateriales');
    if (titulo) {
        titulo.innerHTML = `4. Materiales en: PL-${bultoFound.id} (${bultoFound.tag})`;
    }
    
    // Cargar materiales en el selector
    this.cargarMaterialesEnSelector();
    this.renderizarMaterialesDelPalletActivo();
    
    //  ACTUALIZAR EL RESUMEN DE MERCANCÍA
    this.actualizarResumenMercanciaUI();
    
    // Mostrar feedback visual
    mostrarToast(` Pallet PL-${bultoFound.id} seleccionado`, 'success');
}

    deseleccionarPallet() {
        if (this.meshResaltadoContorno && this.escena) {
            this.escena.remove(this.meshResaltadoContorno);
            this.meshResaltadoContorno = null;
        }
        this.datosPalletSeleccionado = null;
        
        const panel = document.getElementById('logSeccionMateriales');
        if (panel) {
            panel.style.opacity = "0.5";
            panel.style.pointerEvents = "none";
            panel.style.background = '';
            panel.style.border = '';
        }
        
        const titulo = document.getElementById('logTituloMateriales');
        if (titulo) {
            titulo.innerHTML = '4. Materiales de: Ninguno Seleccionado';
        }
        
        const lista = document.getElementById('logListaMateriales');
        if (lista) {
            lista.innerHTML = '<span style="color:var(--text-muted); font-size:0.8rem;">Selecciona una carga en el visor 3D</span>';
        }
    }

    // ============================================================
    // FUNCIONES DE CONTENEDORES
    // ============================================================
    
    cambiarModalidad() {
        const modo = document.getElementById('logModalidad').value;
        const selector = document.getElementById('logTipoUnidad');
        
        selector.innerHTML = '';
        this.catalogosUnidades[modo].forEach(item => {
            const opt = document.createElement('option');
            opt.value = item.val;
            opt.innerText = item.texto;
            selector.appendChild(opt);
        });

        this.listaContenedores = [];
        this.idContenedorActivo = 0;
        this.nextPalletId = 1;
        this.agregarContenedor();
        this._persistirEstado();
    }

    agregarContenedor() {
        const info = document.getElementById('logTipoUnidad').value.split('|');
        const modo = document.getElementById('logModalidad').value;
        
        let prefijo = "Unidad";
        if (modo === 'AEREO') prefijo = "ULD";
        else if (modo === 'MARITIMO') prefijo = "Contenedor";
        else prefijo = "Suelo Terrestre";

        const nuevoId = this.listaContenedores.length > 0 ? 
            Math.max(...this.listaContenedores.map(c => c.id)) + 1 : 1;

        this.listaContenedores.push({
            id: nuevoId,
            tipoNombre: info[4],
            nombre: `${prefijo} #${nuevoId} (${info[4]})`,
            L: parseFloat(info[0]),
            A: parseFloat(info[1]),
            H: parseFloat(info[2]),
            maxPeso: parseFloat(info[3]),
            bultos: []
        });
        
        this.seleccionarContenedor(nuevoId);
        mostrarToast(`Nueva unidad creada: ${prefijo} #${nuevoId}`, 'success');
    }

    seleccionarContenedor(id) {
    const contPrevio = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
    if (contPrevio) {
        contPrevio.bultos.forEach(b => {
            if (this.escena) this.escena.remove(b.mesh);
        });
    }
    if (this.meshResaltadoContorno && this.escena) {
        this.escena.remove(this.meshResaltadoContorno);
        this.meshResaltadoContorno = null;
    }

    this.idContenedorActivo = id;
    const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
    if (!contActual) return;
    
    this.dibujarEstructuraContenedor(contActual.L, contActual.A, contActual.H);

    this.meshesArrastrables = [];
    contActual.bultos.forEach(b => {
        if (this.escena) this.escena.add(b.mesh);
        this.meshesArrastrables.push(b.mesh);
    });

    this.configurarDragControls();
    this.deseleccionarPallet();
    this.verificarInvasiones();
    this.actualizarInterfazGlobal();
    
    //  ACTUALIZAR EL RESUMEN DE MERCANCÍA
    this.actualizarResumenMercanciaUI();
}

    actualizarUnidadActiva() {
        const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
        if (!contActual) return;

        const info = document.getElementById('logTipoUnidad').value.split('|');
        const modo = document.getElementById('logModalidad').value;
        
        let prefijo = "Unidad";
        if (modo === 'AEREO') prefijo = "ULD";
        else if (modo === 'MARITIMO') prefijo = "Contenedor";
        else prefijo = "Suelo Terrestre";

        contActual.tipoNombre = info[4];
        contActual.nombre = `${prefijo} #${contActual.id} (${info[4]})`;
        contActual.L = parseFloat(info[0]);
        contActual.A = parseFloat(info[1]);
        contActual.H = parseFloat(info[2]);
        contActual.maxPeso = parseFloat(info[3]);

        this.dibujarEstructuraContenedor(contActual.L, contActual.A, contActual.H);
        this.verificarInvasiones();
        this.actualizarInterfazGlobal();
    }

    dibujarEstructuraContenedor(L, A, H) {
        if (!this.escena) return;
        
        if (this.mallaContenedor) {
            this.escena.remove(this.mallaContenedor);
            this.mallaContenedor = null;
        }
        if (this.lineasContenedor) {
            this.escena.remove(this.lineasContenedor);
            this.lineasContenedor = null;
        }

        const modoGlobal = document.getElementById('logModalidad').value;
        const geometria = new THREE.BoxGeometry(L, H, A);
        
        const opacidad = modoGlobal === 'SIN_CONTENEDOR' ? 0.0 : 0.08;
        let colorLinea = 0x4a6fa5;
        if (modoGlobal === 'MARITIMO') colorLinea = 0xe74c3c;
        else if (modoGlobal === 'SIN_CONTENEDOR') colorLinea = 0x27ae60;

        this.mallaContenedor = new THREE.Mesh(geometria, new THREE.MeshPhysicalMaterial({
            color: 0x88aacc,
            transparent: true,
            opacity: opacidad,
            depthWrite: false,
            side: THREE.DoubleSide
        }));
        this.mallaContenedor.position.set(0, H / 2, 0);
        this.escena.add(this.mallaContenedor);

        const edges = new THREE.EdgesGeometry(geometria);
        this.lineasContenedor = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: colorLinea, transparent: true, opacity: 0.6 })
        );
        this.lineasContenedor.position.copy(this.mallaContenedor.position);
        this.escena.add(this.lineasContenedor);
    }

    // ============================================================
    // CREAR CARGA
    // ============================================================
    
    crearCarga() {
        const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
        if (!contActual) {
            mostrarToast('Primero crea una unidad de transporte', 'warning');
            return;
        }

        const tipo = document.getElementById('logTipoCarga').value;
        const tag = document.getElementById('logCargaTag').value.trim() || 'Carga';
        const cantidad = parseInt(document.getElementById('logCargaCantidad').value) || 1;
        const orientacion = parseInt(document.getElementById('logCargaOrientacion').value) || 0;
        
        let largo = parseFloat(document.getElementById('logCargaLargo').value) || 0;
        let ancho = parseFloat(document.getElementById('logCargaAncho').value) || 0;
        let alto = parseFloat(document.getElementById('logCargaAlto').value) || 0;

        if (largo <= 0 || ancho <= 0 || alto <= 0) {
            mostrarToast(' Las dimensiones deben ser mayores a 0', 'error');
            return;
        }

        const tipoNombre = this.tiposCarga[tipo]?.nombre || 'Personalizado';

        for (let i = 0; i < cantidad; i++) {
            const totalBultos = this.listaContenedores.reduce((sum, c) => sum + c.bultos.length, 0);
            const cPick = this.coloresPaleta[totalBultos % this.coloresPaleta.length];
            
            const geom = new THREE.BoxGeometry(largo, alto, ancho);
            const mat = new THREE.MeshPhysicalMaterial({ 
                color: cPick, 
                roughness: 0.4,
                metalness: 0.1,
                transparent: true,
                opacity: 0.95
            });
            const meshCaja = new THREE.Mesh(geom, mat);
            meshCaja.castShadow = true;
            meshCaja.receiveShadow = true;
            
            //  Añadir datos para identificación
            meshCaja.userData = {
                esCarga: true,
                id: this.nextPalletId,
                index: i
            };
            
            const edges = new THREE.EdgesGeometry(geom);
            const lineMat = new THREE.LineBasicMaterial({ color: 0x1c2833, transparent: true, opacity: 0.2 });
            const wireframe = new THREE.LineSegments(edges, lineMat);
            meshCaja.add(wireframe);

            const pos = this.encontrarPosicionLibre(largo, ancho, alto, contActual, null, orientacion === 90 ? Math.PI / 2 : 0);
            if (pos) {
                meshCaja.position.set(pos.x, pos.y, pos.z);
            } else {
                const spacing = 0.15;
                const col = i % 3;
                const row = Math.floor(i / 3);
                const xPos = -contActual.L / 2 + largo / 2 + spacing + col * (largo + spacing);
                const zPos = -contActual.A / 2 + ancho / 2 + spacing + row * (ancho + spacing);
                meshCaja.position.set(
                    Math.min(xPos, contActual.L / 2 - largo / 2),
                    alto / 2,
                    Math.min(zPos, contActual.A / 2 - ancho / 2)
                );
            }
            
            if (orientacion === 90) {
                meshCaja.rotation.y = Math.PI / 2;
            }

            if (this.escena) this.escena.add(meshCaja);
            this.meshesArrastrables.push(meshCaja);

            const nuevaCarga = {
                id: this.nextPalletId++,
                tag: `${tag}${cantidad > 1 ? ` #${i+1}` : ''}`,
                tipo: tipoNombre,
                largo: largo,
                ancho: ancho,
                alto: alto,
                mesh: meshCaja,
                colorOriginal: cPick,
                materiales: [],
                orientacion: orientacion
            };

            contActual.bultos.push(nuevaCarga);
        }

        this.configurarDragControls();
        this.resolverSolapes();
        this.verificarInvasiones();
        this.actualizarInterfazGlobal();
        this._persistirEstado();
        mostrarToast(` ${cantidad} carga(s) "${tipoNombre}" ubicada(s)`, 'success');
    }

    // ============================================================
    // ELIMINAR CARGA
    // ============================================================
    
    eliminarUltimaCarga() {
        const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
        if (!contActual || contActual.bultos.length === 0) {
            mostrarToast('No hay cargas para eliminar', 'warning');
            return;
        }

        const ultimo = contActual.bultos[contActual.bultos.length - 1];
        
        if (confirm(`¿Eliminar la carga PL-${ultimo.id} (${ultimo.tag})?`)) {
            contActual.bultos.pop();
            if (this.escena) this.escena.remove(ultimo.mesh);
            
            if (this.datosPalletSeleccionado === ultimo) {
                this.deseleccionarPallet();
            }

            const idx = this.meshesArrastrables.indexOf(ultimo.mesh);
            if (idx > -1) this.meshesArrastrables.splice(idx, 1);
            
            this.configurarDragControls();
            this.verificarInvasiones();
            this.actualizarInterfazGlobal();
            this._persistirEstado();
            mostrarToast(`Carga PL-${ultimo.id} eliminada`, 'warning');
        }
    }

    // ============================================================
    // AUTO-PLACEMENT: ENCONTRAR POSICIÓN LIBRE
    // ============================================================

    cajasSolapan(x1, z1, y1, l1, a1, h1, b2, rotacionY1) {
        const m2 = b2.mesh;
        const ang2 = m2.rotation.y;
        const esGiro2 = Math.abs(Math.sin(ang2)) > 0.1;
        const l2 = esGiro2 ? b2.ancho : b2.largo;
        const a2 = esGiro2 ? b2.largo : b2.ancho;
        const ang1 = rotacionY1 || 0;
        const esGiro1 = Math.abs(Math.sin(ang1)) > 0.1;
        const l1e = esGiro1 ? a1 : l1;
        const a1e = esGiro1 ? l1 : a1;
        const dx = Math.abs(x1 - m2.position.x);
        const dy = Math.abs(y1 - m2.position.y);
        const dz = Math.abs(z1 - m2.position.z);
        return dx < (l1e + l2) / 2 && dy < (h1 + b2.alto) / 2 && dz < (a1e + a2) / 2;
    }

    encontrarPosicionLibre(largo, ancho, alto, contActual, excluirMesh, rotacionY, cercaDe) {
        const spacing = 0.05;
        const ang = rotacionY || 0;
        const esGiro = Math.abs(Math.sin(ang)) > 0.1;
        const lEf = esGiro ? ancho : largo;
        const aEf = esGiro ? largo : ancho;
        const stepX = lEf + spacing;
        const stepZ = aEf + spacing;
        const stepY = alto + spacing;
        const maxCols = Math.max(1, Math.floor((contActual.L - lEf) / stepX) + 1);
        const maxRows = Math.max(1, Math.floor((contActual.A - aEf) / stepZ) + 1);
        const maxLayers = Math.max(1, Math.floor((contActual.H - alto) / stepY) + 1);
        const startX = -contActual.L / 2 + lEf / 2;
        const startZ = -contActual.A / 2 + aEf / 2;
        const posiciones = [];
        for (let layer = 0; layer < maxLayers; layer++) {
            for (let row = 0; row < maxRows; row++) {
                for (let col = 0; col < maxCols; col++) {
                    const x = startX + col * stepX;
                    const z = startZ + row * stepZ;
                    const y = alto / 2 + layer * stepY;
                    let solapa = false;
                    for (const b of contActual.bultos) {
                        if (excluirMesh && b.mesh === excluirMesh) continue;
                        if (this.cajasSolapan(x, z, y, lEf, aEf, alto, b, ang)) {
                            solapa = true;
                            break;
                        }
                    }
                    if (!solapa) {
                        const dist = cercaDe ? Math.sqrt((x-cercaDe.x)**2 + (y-cercaDe.y)**2 + (z-cercaDe.z)**2) : 0;
                        posiciones.push({ x, y, z, dist });
                    }
                }
            }
        }
        if (posiciones.length === 0) return null;
        posiciones.sort((a, b) => a.dist - b.dist);
        return posiciones[0];
    }

    resolverSolapes(excluirMesh) {
        const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
        if (!contActual) return;
        for (let iter = 0; iter < 50; iter++) {
            let haySolape = false;
            for (let i = 0; i < contActual.bultos.length; i++) {
                for (let j = i + 1; j < contActual.bultos.length; j++) {
                    const bA = contActual.bultos[i];
                    const bB = contActual.bultos[j];
                    if (bA.mesh === excluirMesh && bB.mesh === excluirMesh) continue;
                    const angA = bA.mesh.rotation.y;
                    const angB = bB.mesh.rotation.y;
                    const esGA = Math.abs(Math.sin(angA)) > 0.1;
                    const esGB = Math.abs(Math.sin(angB)) > 0.1;
                    const lA = esGA ? bA.ancho : bA.largo;
                    const aA = esGA ? bA.largo : bA.ancho;
                    const lB = esGB ? bB.ancho : bB.largo;
                    const aB = esGB ? bB.largo : bB.ancho;
                    const dx = Math.abs(bA.mesh.position.x - bB.mesh.position.x);
                    const dy = Math.abs(bA.mesh.position.y - bB.mesh.position.y);
                    const dz = Math.abs(bA.mesh.position.z - bB.mesh.position.z);
                    if (dx < (lA + lB) / 2 && dy < (bA.alto + bB.alto) / 2 && dz < (aA + aB) / 2) {
                        haySolape = true;
                        let mover = bB;
                        if (excluirMesh && bB.mesh === excluirMesh) mover = bB;
                        else if (excluirMesh && bA.mesh === excluirMesh) mover = bA;
                        else if (dy < (bA.alto + bB.alto) / 2 - 0.01) mover = bB;
                        else mover = bB;
                        const angM = mover.mesh.rotation.y;
                        const esGM = Math.abs(Math.sin(angM)) > 0.1;
                        const lM = esGM ? mover.ancho : mover.largo;
                        const aM = esGM ? mover.largo : mover.ancho;
                        const cercaDe = { x: mover.mesh.position.x, y: mover.mesh.position.y, z: mover.mesh.position.z };
                        const pos = this.encontrarPosicionLibre(lM, aM, mover.alto, contActual, excluirMesh ? undefined : bA.mesh, angM, cercaDe);
                        if (pos) {
                            mover.mesh.position.set(pos.x, pos.y, pos.z);
                            if (this.meshResaltadoContorno && mover.mesh === this.datosPalletSeleccionado?.mesh) {
                                this.meshResaltadoContorno.position.copy(mover.mesh.position);
                            }
                        }
                        break;
                    }
                }
                if (haySolape) break;
            }
            if (!haySolape) break;
        }
    }

    // ============================================================
    // AUTO-ORDENAR Y MOVER SELECCIÓN
    // ============================================================

    autoOrdenarCarga() {
        const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
        if (!contActual || contActual.bultos.length === 0) {
            mostrarToast('No hay cargas para ordenar', 'warning');
            return;
        }
        const bultos = [...contActual.bultos].sort((a, b) => {
            const volA = a.largo * a.ancho * a.alto;
            const volB = b.largo * b.ancho * b.alto;
            return volB - volA;
        });
        const colocados = [];
        bultos.forEach(b => {
            const ang = b.mesh.rotation.y;
            const esGiro = Math.abs(Math.sin(ang)) > 0.1;
            const lEf = esGiro ? b.ancho : b.largo;
            const aEf = esGiro ? b.largo : b.ancho;
            const spacing = 0.05;
            const stepX = lEf + spacing;
            const stepZ = aEf + spacing;
            const stepY = b.alto + spacing;
            const maxCols = Math.max(1, Math.floor((contActual.L - lEf) / stepX) + 1);
            const maxRows = Math.max(1, Math.floor((contActual.A - aEf) / stepZ) + 1);
            const maxLayers = Math.max(1, Math.floor((contActual.H - b.alto) / stepY) + 1);
            const startX = -contActual.L / 2 + lEf / 2;
            const startZ = -contActual.A / 2 + aEf / 2;
            let colocado = false;
            for (let layer = 0; layer < maxLayers && !colocado; layer++) {
                for (let row = 0; row < maxRows && !colocado; row++) {
                    for (let col = 0; col < maxCols && !colocado; col++) {
                        const x = startX + col * stepX;
                        const z = startZ + row * stepZ;
                        const y = b.alto / 2 + layer * stepY;
                        let solapa = false;
                        for (const c of colocados) {
                            const dcx = Math.abs(x - c.x);
                            const dcy = Math.abs(y - c.y);
                            const dcz = Math.abs(z - c.z);
                            const angC = c.rot;
                            const esGC = Math.abs(Math.sin(angC)) > 0.1;
                            const lC = esGC ? c.ancho : c.largo;
                            const aC = esGC ? c.largo : c.ancho;
                            if (dcx < (lEf + lC) / 2 && dcy < (b.alto + c.alto) / 2 && dcz < (aEf + aC) / 2) {
                                solapa = true;
                                break;
                            }
                        }
                        if (!solapa) {
                            b.mesh.position.set(x, y, z);
                            colocados.push({ x, y, z, largo: lEf, ancho: aEf, alto: b.alto, rot: ang });
                            colocado = true;
                        }
                    }
                }
            }
            if (!colocado) {
                b.mesh.position.set(-contActual.L / 2 + lEf / 2, b.alto / 2, -contActual.A / 2 + aEf / 2);
                colocados.push({ x: b.mesh.position.x, y: b.mesh.position.y, z: b.mesh.position.z, largo: lEf, ancho: aEf, alto: b.alto, rot: ang });
            }
        });
        if (this.meshResaltadoContorno && this.datosPalletSeleccionado) {
            this.meshResaltadoContorno.position.copy(this.datosPalletSeleccionado.mesh.position);
            this.meshResaltadoContorno.rotation.copy(this.datosPalletSeleccionado.mesh.rotation);
        }
        this.verificarInvasiones();
        this.actualizarInterfazGlobal();
        this.guardarEstado();
        mostrarToast(' Cargas auto-ordenadas sin solapes', 'success');
    }

    moverSeleccion(direccion) {
        if (!this.datosPalletSeleccionado) {
            mostrarToast('Primero selecciona una carga', 'warning');
            return;
        }
        const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
        if (!contActual) return;
        const bulto = this.datosPalletSeleccionado;
        const mesh = bulto.mesh;
        const paso = 0.1;
        const oldX = mesh.position.x, oldY = mesh.position.y, oldZ = mesh.position.z;
        const ang = mesh.rotation.y;
        const esGiro = Math.abs(Math.sin(ang)) > 0.1;
        const lEf = esGiro ? bulto.ancho : bulto.largo;
        const aEf = esGiro ? bulto.largo : bulto.ancho;
        switch (direccion) {
            case 'izquierda': mesh.position.x -= paso; break;
            case 'derecha': mesh.position.x += paso; break;
            case 'adelante': mesh.position.z -= paso; break;
            case 'atras': mesh.position.z += paso; break;
            case 'subir': mesh.position.y += paso; break;
            case 'bajar': mesh.position.y -= paso; break;
            case 'suelo': mesh.position.y = bulto.alto / 2; break;
        }
        mesh.position.x = Math.max(-contActual.L / 2 + lEf / 2, Math.min(contActual.L / 2 - lEf / 2, mesh.position.x));
        mesh.position.z = Math.max(-contActual.A / 2 + aEf / 2, Math.min(contActual.A / 2 - aEf / 2, mesh.position.z));
        mesh.position.y = Math.max(bulto.alto / 2, Math.min(contActual.H - bulto.alto / 2, mesh.position.y));
        let solapa = false;
        for (const otro of contActual.bultos) {
            if (otro.mesh === mesh) continue;
            if (this.cajasSolapan(mesh.position.x, mesh.position.z, mesh.position.y, lEf, aEf, bulto.alto, otro, ang)) {
                solapa = true;
                break;
            }
        }
        if (solapa) {
            mesh.position.set(oldX, oldY, oldZ);
            mostrarToast(' No puedes mover aquí, hay otra carga', 'warning');
            return;
        }
        if (this.meshResaltadoContorno) {
            this.meshResaltadoContorno.position.copy(mesh.position);
        }
        this.verificarInvasiones();
        this.actualizarInterfazGlobal();
        this._persistirEstado();
    }

    // ============================================================
    // VERIFICACIÓN DE INVASIONES
    // ============================================================
    
    verificarInvasiones() {
        const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
        if (!contActual) return;

        contActual.bultos.forEach(b => {
            b.mesh.material.color.setHex(b.colorOriginal);
        });

        for (let i = 0; i < contActual.bultos.length; i++) {
            const bA = contActual.bultos[i];
            for (let j = i + 1; j < contActual.bultos.length; j++) {
                const bB = contActual.bultos[j];
                
                const dx = Math.abs(bA.mesh.position.x - bB.mesh.position.x);
                const dy = Math.abs(bA.mesh.position.y - bB.mesh.position.y);
                const dz = Math.abs(bA.mesh.position.z - bB.mesh.position.z);
                
                const anguloA = bA.mesh.rotation.y;
                const anguloB = bB.mesh.rotation.y;
                const esGiroA = Math.abs(Math.sin(anguloA)) > 0.1;
                const esGiroB = Math.abs(Math.sin(anguloB)) > 0.1;
                
                const lA = esGiroA ? bA.ancho : bA.largo;
                const aA = esGiroA ? bA.largo : bA.ancho;
                const lB = esGiroB ? bB.ancho : bB.largo;
                const aB = esGiroB ? bB.largo : bB.ancho;
                
                const distX = (lA + lB) / 2;
                const distY = (bA.alto + bB.alto) / 2;
                const distZ = (aA + aB) / 2;
                
                if (dx < distX && dy < distY && dz < distZ) {
                    bA.mesh.material.color.setHex(0xe74c3c);
                    bB.mesh.material.color.setHex(0xe74c3c);
                }
            }
        }

        const pesoTotal = contActual.bultos.reduce((acc, p) => 
            acc + p.materiales.reduce((sm, m) => sm + (m.peso || 0), 0), 0);
        const errorPeso = pesoTotal > contActual.maxPeso;

        const banner = document.getElementById('logBannerAlerta');
        if (banner) {
            let hayError = false;
            contActual.bultos.forEach(b => {
                if (b.mesh.material.color.getHex() === 0xe74c3c) hayError = true;
            });
            banner.style.display = (hayError || errorPeso) ? 'block' : 'none';
            
            if (hayError && errorPeso) {
                banner.innerHTML = ' ¡INVASIÓN FÍSICA Y SOBREPESO DETECTADOS!';
                banner.style.background = 'rgba(255,59,48,0.3)';
            } else if (hayError) {
                banner.innerHTML = ' ¡INVASIÓN FÍSICA DETECTADA! Reorganiza la carga.';
                banner.style.background = 'rgba(255,59,48,0.2)';
            } else if (errorPeso) {
                banner.innerHTML = ` SOBREPESO: ${pesoTotal.toFixed(0)} kg / ${contActual.maxPeso.toFixed(0)} kg`;
                banner.style.background = 'rgba(255,140,0,0.2)';
            }
        }

        const pesoElement = document.getElementById('logMPeso');
        if (pesoElement) {
            if (contActual.maxPeso > 500000) {
                pesoElement.innerText = `${pesoTotal.toLocaleString()} kg / Libre`;
                pesoElement.style.color = pesoTotal > 0 ? '#00A859' : '#888';
            } else {
                const porcentaje = (pesoTotal / contActual.maxPeso) * 100;
                let color = '#00A859';
                if (porcentaje > 90) color = '#FF3B30';
                else if (porcentaje > 70) color = '#FF8C00';
                pesoElement.innerText = `${pesoTotal.toLocaleString()} / ${contActual.maxPeso.toLocaleString()} kg`;
                pesoElement.style.color = color;
            }
        }
    }

    // ============================================================
    // CARGAR MATERIALES EN SELECTOR
    // ============================================================
    
    cargarMaterialesEnSelector() {
        const select = document.getElementById('logMatSelector');
        if (!select) return;

        select.innerHTML = '<option value="">-- Seleccionar material --</option>';

        if (!proyecto || !proyecto.materiales || proyecto.materiales.length === 0) {
            select.innerHTML = '<option value=""> No hay materiales registrados</option>';
            return;
        }

        const asignados = new Set();
        this.listaContenedores.forEach(c => {
            c.bultos.forEach(b => {
                b.materiales.forEach(m => asignados.add(String(m.materialId)));
            });
        });

        proyecto.materiales.forEach(m => {
            const yaAsignado = asignados.has(String(m.id));
            const option = document.createElement('option');
            option.value = m.id;
            let texto = `${yaAsignado ? ' ' : ''}${m.nombre}`;
            if (m.proveedor) texto += ` (${m.proveedor})`;
            if (m.partNumber) texto += ` - ${m.partNumber}`;
            if (m.costeUnitario) texto += ` - ${m.costeUnitario} ${m.moneda}/ud`;
            if (m.cantidad !== undefined) texto += ` [Stock: ${m.cantidad}]`;
            if (yaAsignado) texto += ' (ya asignado)';
            option.textContent = texto;
            if (yaAsignado) option.disabled = true;
            select.appendChild(option);
        });
    }

    // ============================================================
    // RENDERIZAR MATERIALES DEL PALLET
    // ============================================================
    
    renderizarMaterialesDelPalletActivo() {
        const contenedor = document.getElementById('logListaMateriales');
        if (!contenedor) return;
        
        contenedor.innerHTML = '';

        if (!this.datosPalletSeleccionado || this.datosPalletSeleccionado.materiales.length === 0) {
            contenedor.innerHTML = '<span style="color:var(--text-muted); font-size:0.8rem;">Vacío. Selecciona materiales del desplegable.</span>';
            return;
        }

        this.datosPalletSeleccionado.materiales.forEach((m, index) => {
            const div = document.createElement('div');
            div.className = 'logistica-material-item';
            div.style.cssText = 'display:flex; justify-content:space-between; padding:8px; background:rgba(0,0,0,0.2); border-radius:8px; margin-bottom:4px;';
            div.innerHTML = `
                <div>
                     <strong>${m.nombre}</strong> 
                    <span style="background:rgba(0,122,255,0.2); padding:2px 6px; border-radius:4px; font-size:10px;">${m.hsCode || 'N/A'}</span>
                    (x${m.cantidad}) - ${m.peso} kg
                </div>
                <div>
                    <button class="btn btn-danger btn-small" onclick="window.appLogistica.eliminarMaterialDePallet(${index})"></button>
                </div>
            `;
            contenedor.appendChild(div);
        });
    }

    // ============================================================
    // GUARDAR MATERIAL
    // ============================================================
    
    guardarMaterial() {
        if (!this.datosPalletSeleccionado) {
            mostrarToast(' Primero selecciona una carga en el visor 3D', 'warning');
            return;
        }

        const materialSelect = document.getElementById('logMatSelector');
        const cantidad = parseInt(document.getElementById('logMatCant').value);
        const materialId = parseInt(materialSelect.value);

        if (!materialId || isNaN(cantidad) || cantidad < 1) {
            mostrarToast('Selecciona un material y una cantidad válida', 'error');
            return;
        }

        const material = proyecto.materiales.find(m => m.id === materialId);
        if (!material) {
            mostrarToast('Material no encontrado', 'error');
            return;
        }

        const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
        
        const pesoUnitario = material.pesoUnitario || 1;
        const pesoTotal = cantidad * pesoUnitario;

        const pesoTotalULD = contActual.bultos.reduce((acc, p) => 
            acc + p.materiales.reduce((sm, m) => sm + (m.peso || 0), 0), 0);
            
        if (pesoTotalULD + pesoTotal > contActual.maxPeso) {
            mostrarToast(' Excede la capacidad máxima del contenedor', 'error');
            return;
        }

        const materialData = {
            materialId: material.id,
            nombre: material.nombre,
            hsCode: material.hsCode || material.partNumber || 'N/A',
            cantidad: cantidad,
            peso: pesoTotal
        };

        this.datosPalletSeleccionado.materiales.push(materialData);

        this.cargarMaterialesEnSelector();
        this.renderizarMaterialesDelPalletActivo();
        this.verificarInvasiones();
        this.actualizarInterfazGlobal();
        mostrarToast(` ${cantidad} unidad(es) de "${material.nombre}" asignadas`, 'success');
        this.actualizarValorMercanciaUI();
        this.actualizarCostos();
        this.actualizarResumenMercanciaUI();
        this.actualizarCostos();
        this._persistirEstado();
    }

    // ============================================================
    // ELIMINAR MATERIAL DEL PALLET
    // ============================================================
    
    eliminarMaterialDePallet(index) {
    if (!this.datosPalletSeleccionado) return;
    
    const nombre = this.datosPalletSeleccionado.materiales[index].nombre;
    if (confirm(`¿Eliminar "${nombre}" de la carga?`)) {
        this.datosPalletSeleccionado.materiales.splice(index, 1);
        this.cargarMaterialesEnSelector();
        this.renderizarMaterialesDelPalletActivo();
        this.verificarInvasiones();
        this.actualizarInterfazGlobal();
        this._persistirEstado();
        mostrarToast(`Material "${nombre}" eliminado`, 'warning');
        
        //  ACTUALIZAR EL RESUMEN DE MERCANCÍA
        this.actualizarResumenMercanciaUI();
        this.actualizarCostos();
    }
}

    // ============================================================
    // SELECCIONAR PALLET POR ID
    // ============================================================
    
    seleccionarPalletPorId(id) {
        const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
        if (!contActual) return;
        
        const bulto = contActual.bultos.find(b => b.id === id);
        if (bulto && bulto.mesh) {
            this.seleccionarPalletPorMesh(bulto.mesh);
        }
    }

    // ============================================================
    // ELIMINAR MATERIAL DESDE PACKING
    // ============================================================
    
    eliminarMaterialDesdePacking(contenedorId, palletId, materialIndex) {
        const contenedor = this.listaContenedores.find(c => c.id === contenedorId);
        if (!contenedor) return;
        
        const pallet = contenedor.bultos.find(b => b.id === palletId);
        if (!pallet || !pallet.materiales[materialIndex]) return;
        
        const nombre = pallet.materiales[materialIndex].nombre;
        
        if (confirm(`¿Eliminar "${nombre}" de la carga PL-${palletId}?`)) {
            pallet.materiales.splice(materialIndex, 1);
            
            if (this.datosPalletSeleccionado && this.datosPalletSeleccionado.id === palletId) {
                this.cargarMaterialesEnSelector();
                this.renderizarMaterialesDelPalletActivo();
            }
            this.verificarInvasiones();
            this.actualizarInterfazGlobal();
            mostrarToast(`Material "${nombre}" eliminado`, 'warning');
        }
    }

// ============================================================
// CÁLCULO DE COSTOS (ACTUALIZADO CON VALOR REAL DE MATERIALES)
// ============================================================
    
actualizarCostos() {
    const modo = document.getElementById('logModalidad').value;
    const incoterm = document.getElementById('logIncoterm').value;
    const origenCod = document.getElementById('logPaisOrigen').value;
    const destinoCod = document.getElementById('logPaisDestino').value;
    
    //  CALCULAR VALOR REAL DE LA MERCANCÍA desde los materiales asignados
    let valorMercancia = 0;
    const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
    
    if (contActual) {
        contActual.bultos.forEach(bulto => {
            bulto.materiales.forEach(mat => {
                // Buscar el material original en el proyecto para obtener su coste unitario
                const materialOriginal = proyecto.materiales.find(m => m.id === mat.materialId);
                if (materialOriginal) {
                    // El valor es: cantidad × coste unitario (convertido a la moneda base)
                    const costeUnitario = convertirMoneda(materialOriginal.costeUnitario, materialOriginal.moneda);
                    valorMercancia += mat.cantidad * costeUnitario;
                } else {
                    // Si no se encuentra el material original, usar un valor estimado
                    // (1€ por kg como aproximación)
                    valorMercancia += mat.peso * 1;
                }
            });
        });
    }
    
    // Si no hay materiales asignados, usar el valor manual como respaldo
    if (valorMercancia === 0) {
        valorMercancia = parseFloat(document.getElementById('logValorMercancia').value) || 0;
        mostrarToast(' Usando valor manual. Asigna materiales para cálculo automático.', 'info');
    } else {
        // Actualizar el campo de valor con el cálculo real (para transparencia)
        const valorInput = document.getElementById('logValorMercancia');
        if (valorInput) {
            valorInput.value = valorMercancia.toFixed(2);
            valorInput.style.background = 'rgba(0,168,89,0.15)';
            valorInput.style.border = '1px solid #00A859';
        }
    }

    if (!contActual) return;

    const origenInfo = this.paisesCatalogo[origenCod];
    const destinoInfo = this.paisesCatalogo[destinoCod];
    const origenNombre = origenInfo ? origenInfo.nombre : 'Desconocido';
    const destinoNombre = destinoInfo ? destinoInfo.nombre : 'Desconocido';

    const pesoTotalKilos = contActual.bultos.reduce((acc, p) => 
        acc + p.materiales.reduce((sm, m) => sm + (m.peso || 0), 0), 0);
    const volumenMetrosCubicos = contActual.bultos.reduce((acc, b) => 
        acc + (b.largo * b.ancho * b.alto), 0);

    // Cálculo de flete
    let precioFleteFijo = 0;
    const pesoVolumetrico = Math.max(pesoTotalKilos, volumenMetrosCubicos * 167);
    
    if (modo === "MARITIMO") {
        precioFleteFijo = 1500 + (volumenMetrosCubicos * 35) + (pesoTotalKilos * 0.05);
    } else if (modo === "AEREO") {
        precioFleteFijo = 300 + (pesoVolumetrico * 2.5) + (volumenMetrosCubicos * 200);
    } else {
        precioFleteFijo = 200 + (volumenMetrosCubicos * 40) + (pesoTotalKilos * 0.1);
    }

    // Aranceles basados en el valor REAL de la mercancía
    let arancelImpuesto = 0;
    let arancelPorcentaje = 0;
    if (origenCod && destinoCod && origenCod !== destinoCod) {
        if (destinoInfo && destinoInfo.arancelBase > 0) {
            arancelPorcentaje = destinoInfo.arancelBase;
            arancelImpuesto = valorMercancia * (arancelPorcentaje / 100);
        } else {
            arancelPorcentaje = 10;
            arancelImpuesto = valorMercancia * 0.10;
        }
    }

    const costoSeguro = Math.max(valorMercancia * 0.0075, 50);
    const gastosLocalesDestino = 250 + (pesoTotalKilos * 0.025);
    const costeTotalBase = precioFleteFijo + arancelImpuesto + costoSeguro + gastosLocalesDestino;

    let costoParaElVendedor = 0;
    let desgloseTexto = "";
    let desgloseDetallado = [];

    switch(incoterm) {
        case "DDP":
            costoParaElVendedor = costeTotalBase;
            desgloseDetallado = [
                { label: ` DDP: Vendedor paga Flete`, value: precioFleteFijo },
                { label: ` DDP: Vendedor paga Arancel (${arancelPorcentaje}%)`, value: arancelImpuesto },
                { label: ` DDP: Vendedor paga Seguro`, value: costoSeguro },
                { label: ` DDP: Vendedor paga Gastos Locales`, value: gastosLocalesDestino }
            ];
            desgloseTexto = ` Vendedor asume TODOS los costes: $${costoParaElVendedor.toFixed(2)}`;
            break;
        case "CIF":
            costoParaElVendedor = precioFleteFijo + costoSeguro;
            desgloseDetallado = [
                { label: ` CIF: Vendedor paga Flete`, value: precioFleteFijo },
                { label: ` CIF: Vendedor paga Seguro`, value: costoSeguro }
            ];
            desgloseTexto = ` Vendedor paga: Flete: $${precioFleteFijo.toFixed(2)} | Seguro: $${costoSeguro.toFixed(2)} | Comprador paga: Arancel: $${arancelImpuesto.toFixed(2)} | Locales: $${gastosLocalesDestino.toFixed(2)}`;
            break;
        default:
            costoParaElVendedor = 0;
            desgloseDetallado = [{ label: ` ${incoterm}: Comprador asume costes`, value: 0 }];
            desgloseTexto = ` Comprador paga: Flete: $${precioFleteFijo.toFixed(2)} | Arancel: $${arancelImpuesto.toFixed(2)} | Seguro: $${costoSeguro.toFixed(2)} | Locales: $${gastosLocalesDestino.toFixed(2)}`;
    }

    // Actualizar DOM
    const costosElement = document.getElementById('logMCostos');
    if (costosElement) {
        costosElement.innerText = `$${costoParaElVendedor.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} USD`;
        costosElement.style.color = costoParaElVendedor > 0 ? '#FF8C00' : '#007AFF';
    }
    
    const desgloseElement = document.getElementById('logMDesglose');
    if (desgloseElement) {
        let desgloseHtml = `<div style="font-size: 10px; margin-bottom: 4px;"> ${origenNombre} → ${destinoNombre}</div>`;
        desgloseHtml += `<div style="font-size: 11px; color: #00A859; margin-bottom: 4px;"> Valor mercancía: $${valorMercancia.toFixed(2)}</div>`;
        desgloseHtml += desgloseTexto;
        
        if (desgloseDetallado.length > 0) {
            const detalles = desgloseDetallado.map(d => 
                `<span style="display: inline-block; margin-right: 8px;">${d.label}: $${d.value.toFixed(2)}</span>`
            ).join('');
            desgloseHtml += `<div style="font-size: 9px; color: #888; margin-top: 4px;">${detalles}</div>`;
        }
        
        desgloseElement.innerHTML = desgloseHtml;
    }
}
// ============================================================
// MOSTRAR VALOR DE MERCANCÍA EN LA INTERFAZ
// ============================================================
    
actualizarValorMercanciaUI() {
    const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
    if (!contActual) return;
    
    let valorMercancia = 0;
    let totalMateriales = 0;
    let totalPeso = 0;
    
    contActual.bultos.forEach(bulto => {
        bulto.materiales.forEach(mat => {
            totalMateriales += mat.cantidad;
            totalPeso += mat.peso || 0;
            const materialOriginal = proyecto.materiales.find(m => m.id === mat.materialId);
            if (materialOriginal) {
                const costeUnitario = convertirMoneda(materialOriginal.costeUnitario, materialOriginal.moneda);
                valorMercancia += mat.cantidad * costeUnitario;
            } else {
                valorMercancia += mat.peso * 1; // Estimación
            }
        });
    });
    
    // Actualizar el campo de valor
    const valorInput = document.getElementById('logValorMercancia');
    if (valorInput) {
        if (valorMercancia > 0) {
            valorInput.value = valorMercancia.toFixed(2);
            valorInput.style.background = 'rgba(0,168,89,0.15)';
            valorInput.style.border = '1px solid #00A859';
            valorInput.title = ` Calculado desde ${totalMateriales} materiales (${totalPeso.toFixed(1)} kg)`;
        } else {
            valorInput.style.background = '';
            valorInput.style.border = '';
            valorInput.title = 'No hay materiales asignados';
        }
    }
    
    // Mostrar resumen en la interfaz
    const infoDiv = document.getElementById('infoEvolucionMoneda') || document.createElement('div');
    if (infoDiv.id === 'infoEvolucionMoneda') {
        // Si es el div de información de monedas, añadir el resumen
        const resumenHtml = `
            <div style="margin-top: 8px; padding: 8px; background: rgba(0,168,89,0.1); border-radius: 8px; font-size: 11px;">
                 <strong>Resumen de carga:</strong> ${totalMateriales} materiales | ${totalPeso.toFixed(1)} kg | 
                 Valor: $${valorMercancia.toFixed(2)}
            </div>
        `;
        // Insertar después del contenido existente
        infoDiv.insertAdjacentHTML('beforeend', resumenHtml);
    }
}
// ============================================================
// MOSTRAR VALOR DE MERCANCÍA EN LA INTERFAZ
// ============================================================
    
actualizarResumenMercanciaUI() {
    console.log(" Actualizando resumen de mercancía...");
    
    const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
    if (!contActual) {
        console.warn(" No hay contenedor activo");
        this.mostrarResumenVacio();
        return;
    }
    
    let valorMercancia = 0;
    let totalMateriales = 0;
    let totalPeso = 0;
    let detalleMateriales = [];
    
    // Recorrer todos los bultos del contenedor activo
    contActual.bultos.forEach(bulto => {
        if (bulto.materiales && bulto.materiales.length > 0) {
            bulto.materiales.forEach(mat => {
                totalMateriales += mat.cantidad;
                totalPeso += mat.peso || 0;
                
                // Buscar el material original en el proyecto para obtener su coste unitario
                const materialOriginal = proyecto?.materiales?.find(m => m.id === mat.materialId);
                if (materialOriginal) {
                    // Convertir el coste unitario a la moneda base
                    const costeUnitario = convertirMoneda(materialOriginal.costeUnitario, materialOriginal.moneda);
                    const valorItem = mat.cantidad * costeUnitario;
                    valorMercancia += valorItem;
                    detalleMateriales.push({
                        nombre: mat.nombre,
                        cantidad: mat.cantidad,
                        valor: valorItem,
                        peso: mat.peso || 0,
                        costeUnitario: costeUnitario,
                        moneda: materialOriginal.moneda
                    });
                } else {
                    // Si no se encuentra el material original, usar estimación por peso
                    const valorEstimado = mat.peso * 1; // 1€ por kg como estimación
                    valorMercancia += valorEstimado;
                    detalleMateriales.push({
                        nombre: mat.nombre + ' (estimado)',
                        cantidad: mat.cantidad,
                        valor: valorEstimado,
                        peso: mat.peso || 0,
                        costeUnitario: 1,
                        moneda: 'EUR'
                    });
                }
            });
        }
    });
    
    console.log(` Valor calculado: $${valorMercancia.toFixed(2)}`);
    console.log(` Materiales: ${totalMateriales}, Peso: ${totalPeso.toFixed(1)} kg`);
    
    
    // ============================================
    // ACTUALIZAR DOM
    // ============================================
    
    // Actualizar resumen de valor
    const resumenValor = document.getElementById('valorMercanciaResumen');
    if (resumenValor) {
        resumenValor.textContent = `$${valorMercancia.toFixed(2)}`;
        resumenValor.style.color = valorMercancia > 0 ? '#00A859' : '#888';
        resumenValor.style.fontWeight = 'bold';
    }
    
    // Actualizar resumen de materiales
    const resumenMateriales = document.getElementById('resumenMaterialesCarga');
    if (resumenMateriales) {
        if (totalMateriales > 0) {
            resumenMateriales.textContent = `${totalMateriales} materiales | ${totalPeso.toFixed(1)} kg | ${detalleMateriales.length} tipos`;
            resumenMateriales.style.color = '#fff';
        } else {
            resumenMateriales.textContent = '0 materiales | 0 kg';
            resumenMateriales.style.color = '#666';
        }
    }
    
    // Actualizar el campo de valor de mercancía
    const valorInput = document.getElementById('logValorMercancia');
    if (valorInput) {
        if (valorMercancia > 0) {
            valorInput.value = valorMercancia.toFixed(2);
            valorInput.style.background = 'rgba(0,168,89,0.15)';
            valorInput.style.border = '2px solid #00A859';
            valorInput.style.color = '#00A859';
            valorInput.title = ` Calculado desde ${totalMateriales} materiales (${totalPeso.toFixed(1)} kg)`;
        } else {
            valorInput.style.background = '';
            valorInput.style.border = '';
            valorInput.style.color = '';
            valorInput.title = 'No hay materiales asignados';
        }
    }
    
    // Actualizar costos (para recalcular aranceles, seguros, etc.)
    this.actualizarCostos();
    
    return { valorMercancia, totalMateriales, totalPeso, detalleMateriales };
}

// ============================================================
// MOSTRAR RESUMEN VACÍO
// ============================================================
    
mostrarResumenVacio() {
    const resumenValor = document.getElementById('valorMercanciaResumen');
    if (resumenValor) {
        resumenValor.textContent = '$0.00';
        resumenValor.style.color = '#888';
    }
    
    const resumenMateriales = document.getElementById('resumenMaterialesCarga');
    if (resumenMateriales) {
        resumenMateriales.textContent = '0 materiales | 0 kg';
        resumenMateriales.style.color = '#666';
    }
    
    const valorInput = document.getElementById('logValorMercancia');
    if (valorInput) {
        valorInput.style.background = '';
        valorInput.style.border = '';
        valorInput.style.color = '';
    }
}
    // ============================================================
    // INTERFAZ DE USUARIO
    // ============================================================
    
    actualizarInterfazGlobal() {
        const contenedorTabs = document.getElementById('logisticaTabs');
        if (!contenedorTabs) return;
        
        contenedorTabs.innerHTML = '';
        
        this.listaContenedores.forEach(c => {
            const pesoULD = c.bultos.reduce((acc, p) => acc + p.materiales.reduce((sm, m) => sm + m.peso, 0), 0);
            const btn = document.createElement('button');
            btn.className = `logistica-tab ${c.id === this.idContenedorActivo ? 'active' : ''}`;
            btn.innerText = `${c.nombre.split(' (')[0]} (${pesoULD.toLocaleString()} kg)`;
            btn.onclick = () => this.seleccionarContenedor(c.id);
            contenedorTabs.appendChild(btn);
        });

        const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
        if (!contActual) return;

        const totalBultos = contActual.bultos.length;
        const totalVol = contActual.bultos.reduce((acc, b) => acc + (b.largo * b.ancho * b.alto), 0);

        document.getElementById('logMBultos').innerText = totalBultos;
        document.getElementById('logMVol').innerText = totalVol.toFixed(3) + " m³";
        
        this.actualizarCostos();
        this.actualizarTablaPacking();
    }

    // ============================================================
    // TABLA PACKING
    // ============================================================
    
    actualizarTablaPacking() {
        const tbody = document.getElementById('logPackingBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        this.listaContenedores.forEach(c => {
            c.bultos.forEach(b => {
                const alturaSuelo = (b.mesh.position.y - b.alto / 2).toFixed(2);
                const contenedorNombre = c.nombre.split(' (')[0];
                const colorHex = '#' + b.colorOriginal.toString(16).padStart(6, '0');
                
                if (b.materiales.length > 0) {
                    b.materiales.forEach((m, matIndex) => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td><span style="background:#34495e; color:white; padding:2px 8px; border-radius:4px; font-size:0.7rem;">${contenedorNombre}</span></td>
                            <td><strong>PL-${b.id}</strong></td>
                            <td>${b.tag}</td>
                            <td><span style="display:inline-block; width:12px; height:12px; background:${colorHex}; border-radius:2px;"></span> ${b.tipo || 'Carga'}</td>
                            <td>${b.largo.toFixed(2)}×${b.ancho.toFixed(2)}×${b.alto.toFixed(2)}</td>
                            <td>${alturaSuelo} m</td>
                            <td>${m.nombre}</td>
                            <td><span style="background:rgba(0,122,255,0.2); padding:2px 6px; border-radius:4px; font-size:10px;">${m.hsCode || 'N/A'}</span></td>
                            <td>${m.cantidad}</td>
                            <td>${m.peso.toFixed(1)}</td>
                            <td>
                                <button class="btn btn-secondary btn-small" onclick="window.appLogistica.seleccionarPalletPorId(${b.id})"></button>
                                <button class="btn btn-danger btn-small" onclick="window.appLogistica.eliminarMaterialDesdePacking(${c.id}, ${b.id}, ${matIndex})"></button>
                            </td>
                        `;
                        tbody.appendChild(tr);
                    });
                } else {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td><span style="background:#34495e; color:white; padding:2px 8px; border-radius:4px; font-size:0.7rem;">${contenedorNombre}</span></td>
                        <td><strong>PL-${b.id}</strong></td>
                        <td>${b.tag}</td>
                        <td><span style="display:inline-block; width:12px; height:12px; background:${colorHex}; border-radius:2px;"></span> ${b.tipo || 'Carga'}</td>
                        <td>${b.largo.toFixed(2)}×${b.ancho.toFixed(2)}×${b.alto.toFixed(2)}</td>
                        <td>${alturaSuelo} m</td>
                        <td colspan="3" style="color:var(--text-muted);">Sin inventario</td>
                        <td>0</td>
                        <td>
                            <button class="btn btn-secondary btn-small" onclick="window.appLogistica.seleccionarPalletPorId(${b.id})"></button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                }
            });
        });
    }

    // ============================================================
    // CARGAR PAÍSES EN SELECTORES
    // ============================================================
    
    cargarPaisesEnSelectores() {
        const origenSelect = document.getElementById('logPaisOrigen');
        const destinoSelect = document.getElementById('logPaisDestino');
        
        if (!origenSelect || !destinoSelect) return;
        
        origenSelect.innerHTML = '';
        destinoSelect.innerHTML = '';
        
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '-- Seleccionar país --';
        origenSelect.appendChild(defaultOption.cloneNode(true));
        destinoSelect.appendChild(defaultOption.cloneNode(true));
        
        const continentes = {};
        for (const [codigo, info] of Object.entries(this.paisesCatalogo)) {
            const cont = info.continente || 'Otros';
            if (!continentes[cont]) continentes[cont] = [];
            continentes[cont].push({ codigo, nombre: info.nombre });
        }
        
        const continentesOrdenados = ['Europa', 'África', 'América', 'Asia', 'Oceanía', 'Otros'];
        
        for (const cont of continentesOrdenados) {
            if (continentes[cont] && continentes[cont].length > 0) {
                const optgroup = document.createElement('optgroup');
                optgroup.label = cont;
                continentes[cont].sort((a, b) => a.nombre.localeCompare(b.nombre));
                
                for (const pais of continentes[cont]) {
                    const opt = document.createElement('option');
                    opt.value = pais.codigo;
                    opt.textContent = `${pais.nombre} (${pais.codigo})`;
                    if (pais.codigo === 'ES' && origenSelect.id === 'logPaisOrigen') opt.selected = true;
                    if (pais.codigo === 'MX' && destinoSelect.id === 'logPaisDestino') opt.selected = true;
                    optgroup.appendChild(opt);
                }
                origenSelect.appendChild(optgroup.cloneNode(true));
                destinoSelect.appendChild(optgroup.cloneNode(true));
            }
        }
    }

    // ============================================================
    // FUNCIONES DE CARGA PREDEFINIDA
    // ============================================================
    
    cargarTipoPredefinido() {
        const tipo = document.getElementById('logTipoCarga').value;
        const predefinido = this.tiposCarga[tipo];
        
        if (predefinido) {
            document.getElementById('logCargaLargo').value = predefinido.largo;
            document.getElementById('logCargaAncho').value = predefinido.ancho;
            document.getElementById('logCargaAlto').value = predefinido.alto;
        }
        
        this.actualizarPreviewDimension();
    }

    actualizarPreviewDimension() {
        const tipo = document.getElementById('logTipoCarga').value;
        const largo = parseFloat(document.getElementById('logCargaLargo').value) || 0;
        const ancho = parseFloat(document.getElementById('logCargaAncho').value) || 0;
        const alto = parseFloat(document.getElementById('logCargaAlto').value) || 0;
        const tipoNombre = this.tiposCarga[tipo]?.nombre || 'Personalizado';
        const volumen = largo * ancho * alto;
        
        const preview = document.getElementById('logPreviewDimension');
        if (preview) {
            preview.innerHTML = 
                ` <strong>${tipoNombre}</strong>: ${largo.toFixed(2)}m × ${ancho.toFixed(2)}m × ${alto.toFixed(2)}m | Volumen: ${volumen.toFixed(3)} m³`;
        }
    }

    // ============================================================
    // EXPORTAR
    // ============================================================
    
    exportarCSV() {
        const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
        if (!contActual || contActual.bultos.length === 0) {
            mostrarToast('No hay datos para exportar', 'warning');
            return;
        }

        let csv = "Unidad,ID Carga,Etiqueta,Tipo,Largo (m),Ancho (m),Alto (m),Altura Suelo (m),Material,HS Code,Cantidad,Peso (kg)\n";
        
        this.listaContenedores.forEach(c => {
            c.bultos.forEach(b => {
                const alturaSuelo = (b.mesh.position.y - b.alto / 2).toFixed(2);
                if (b.materiales.length > 0) {
                    b.materiales.forEach(m => {
                        csv += `${c.nombre.split(' (')[0]},PL-${b.id},${b.tag},${b.tipo || 'Carga'},${b.largo.toFixed(2)},${b.ancho.toFixed(2)},${b.alto.toFixed(2)},${alturaSuelo},${m.nombre},${m.hsCode || 'N/A'},${m.cantidad},${m.peso}\n`;
                    });
                } else {
                    csv += `${c.nombre.split(' (')[0]},PL-${b.id},${b.tag},${b.tipo || 'Carga'},${b.largo.toFixed(2)},${b.ancho.toFixed(2)},${b.alto.toFixed(2)},${alturaSuelo},VACÍO,N/A,0,0\n`;
                }
            });
        });

        const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `packing_list_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
        mostrarToast(' Packing List exportado a CSV', 'success');
    }

    exportarPDF() {
        const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
        if (!contActual || contActual.bultos.length === 0) {
            mostrarToast('No hay datos para exportar a PDF', 'warning');
            return;
        }

        const ventana = window.open('', '_blank');
        if (ventana) {
            ventana.document.write(`
                <html>
                <head><title>Packing List</title>
                <style>
                    body { font-family: Arial; padding: 40px; }
                    h1 { color: #007AFF; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
                    th { background: #007AFF; color: white; }
                </style>
                </head>
                <body>
                    <h1> PACKING LIST</h1>
                    <p>Fecha: ${new Date().toLocaleString('es-ES')}</p>
                    <table>
                        <thead><tr><th>Unidad</th><th>ID</th><th>Material</th><th>Cantidad</th><th>Peso (kg)</th></tr></thead>
                        <tbody>
            `);
            
            this.listaContenedores.forEach(c => {
                c.bultos.forEach(b => {
                    if (b.materiales.length > 0) {
                        b.materiales.forEach(m => {
                            ventana.document.write(`
                                <tr>
                                    <td>${c.nombre.split(' (')[0]}</td>
                                    <td>PL-${b.id}</td>
                                    <td>${m.nombre}</td>
                                    <td>${m.cantidad}</td>
                                    <td>${m.peso}</td>
                                </tr>
                            `);
                        });
                    }
                });
            });
            
            ventana.document.write(`
                        </tbody>
                    </table>
                    <p style="margin-top:30px; color:#888; font-size:12px;">Documento generado por PMI Mind</p>
                </body>
                </html>
            `);
            ventana.document.close();
            ventana.focus();
            ventana.print();
        } else {
            mostrarToast(' No se pudo abrir la ventana. Permite popups.', 'error');
        }
    }

    // ============================================================
    // GUARDAR / CARGAR ESTADO
    // ============================================================
    
    _serializarEstado() {
        return {
            contenedores: this.listaContenedores.map(c => ({
                id: c.id,
                tipoNombre: c.tipoNombre,
                nombre: c.nombre,
                L: c.L,
                A: c.A,
                H: c.H,
                maxPeso: c.maxPeso,
                bultos: c.bultos.map(b => ({
                    id: b.id,
                    tag: b.tag,
                    tipo: b.tipo,
                    largo: b.largo,
                    ancho: b.ancho,
                    alto: b.alto,
                    colorOriginal: b.colorOriginal,
                    orientacion: b.orientacion,
                    materiales: b.materiales,
                    posicion: {
                        x: b.mesh.position.x,
                        y: b.mesh.position.y,
                        z: b.mesh.position.z
                    },
                    rotacion: b.mesh.rotation.y
                }))
            })),
            idActivo: this.idContenedorActivo,
            nextPalletId: this.nextPalletId,
            config: {
                modalidad: document.getElementById('logModalidad')?.value || 'AEREO',
                origen: document.getElementById('logPaisOrigen')?.value || '',
                destino: document.getElementById('logPaisDestino')?.value || '',
                incoterm: document.getElementById('logIncoterm')?.value || 'CIF',
                valorMercancia: document.getElementById('logValorMercancia')?.value || '15000'
            }
        };
    }

    _persistirEstado() {
        try {
            const estado = this._serializarEstado();
            if (typeof proyecto !== 'undefined' && proyecto) {
                proyecto.logistica = estado;
                let todos = cargarProyectosStorage();
                let idx = todos.findIndex(p => p.id === proyecto.id);
                if (idx >= 0) todos[idx] = proyecto;
                else todos.push(proyecto);
                guardarProyectosStorage(todos);
                if (typeof DataService !== 'undefined' && DataService.getToken()) {
                    DataService.syncAllProjects(todos);
                }
            } else {
                localStorage.setItem('simuladorLogistico', JSON.stringify(estado));
            }
        } catch (e) {
            console.error('Error auto-saving logistics:', e);
        }
    }

    guardarEstado() {
        try {
            this._persistirEstado();
            mostrarToast(' Estado guardado', 'success');
        } catch (e) {
            console.error(e);
            mostrarToast('Error al guardar', 'error');
        }
    }

    cargarEstado() {
        try {
            let estado = null;
            if (typeof proyecto !== 'undefined' && proyecto && proyecto.logistica) {
                estado = proyecto.logistica;
            } else {
                const data = localStorage.getItem('simuladorLogistico');
                if (data) estado = JSON.parse(data);
            }
            if (!estado) {
                mostrarToast('No hay estado guardado', 'warning');
                return;
            }
            
            document.getElementById('logModalidad').value = estado.config.modalidad || 'AEREO';
            document.getElementById('logPaisOrigen').value = estado.config.origen || 'ES';
            document.getElementById('logPaisDestino').value = estado.config.destino || 'MX';
            document.getElementById('logIncoterm').value = estado.config.incoterm || 'CIF';
            document.getElementById('logValorMercancia').value = estado.config.valorMercancia || 15000;

            this.cambiarModalidad();
            
            this.listaContenedores = [];
            this.idContenedorActivo = estado.idActivo || 0;
            this.nextPalletId = estado.nextPalletId || 1;

            estado.contenedores.forEach(cData => {
                const cont = {
                    id: cData.id,
                    tipoNombre: cData.tipoNombre || '',
                    nombre: cData.nombre || '',
                    L: cData.L || 10,
                    A: cData.A || 8,
                    H: cData.H || 4,
                    maxPeso: cData.maxPeso || 999999,
                    bultos: []
                };

                cData.bultos.forEach(bData => {
                    const geom = new THREE.BoxGeometry(bData.largo, bData.alto, bData.ancho);
                    const mat = new THREE.MeshPhysicalMaterial({ 
                        color: bData.colorOriginal || 0x2980b9,
                        roughness: 0.4,
                        metalness: 0.1,
                        transparent: true,
                        opacity: 0.95
                    });
                    const mesh = new THREE.Mesh(geom, mat);
                    mesh.castShadow = true;
                    mesh.receiveShadow = true;
                    
                    const edges = new THREE.EdgesGeometry(geom);
                    const lineMat = new THREE.LineBasicMaterial({ color: 0x1c2833, transparent: true, opacity: 0.2 });
                    const wireframe = new THREE.LineSegments(edges, lineMat);
                    mesh.add(wireframe);

                    mesh.position.set(bData.posicion.x, bData.posicion.y, bData.posicion.z);
                    mesh.rotation.y = bData.rotacion || 0;
                    
                    if (this.escena) this.escena.add(mesh);
                    this.meshesArrastrables.push(mesh);

                    cont.bultos.push({
                        id: bData.id,
                        tag: bData.tag || 'Cargado',
                        tipo: bData.tipo || 'Carga',
                        largo: bData.largo,
                        ancho: bData.ancho,
                        alto: bData.alto,
                        mesh: mesh,
                        colorOriginal: bData.colorOriginal || 0x2980b9,
                        materiales: bData.materiales || [],
                        orientacion: bData.orientacion || 0
                    });
                });

                this.listaContenedores.push(cont);
            });

            this.configurarDragControls();
            this.seleccionarContenedor(this.idContenedorActivo);
            this.actualizarInterfazGlobal();
            mostrarToast(' Estado cargado', 'success');
            
        } catch (e) {
            console.error(e);
            mostrarToast('Error al cargar', 'error');
        }
    }

    // ============================================================
    // VISTAS DE CÁMARA
    // ============================================================
    
    cambiarVista(modo) {
        const contActual = this.listaContenedores.find(c => c.id === this.idContenedorActivo);
        const hTarget = contActual ? contActual.H / 2 : 1.5;
        const lTarget = contActual ? Math.max(contActual.L, contActual.A) / 2 + 2 : 5;
        
        let targetPos;
        const offset = 2;
        switch(modo) {
            case 'perspectiva':
                targetPos = new THREE.Vector3(lTarget * 0.7, lTarget * 0.6 + offset, lTarget * 0.8);
                break;
            case 'planta':
                targetPos = new THREE.Vector3(0.01, lTarget * 1.2 + offset, 0.01);
                break;
            case 'frontal':
                targetPos = new THREE.Vector3(0, hTarget + offset, lTarget);
                break;
            case 'reset':
            default:
                targetPos = new THREE.Vector3(8, 6 + offset, 10);
                break;
        }
        
        const startPos = this.camara.position.clone();
        const startTarget = this.controlesOrbita.target.clone();
        const endTarget = new THREE.Vector3(0, hTarget, 0);
        const startTime = Date.now();
        const duration = 500;
        
        const animateCamera = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
            
            this.camara.position.lerpVectors(startPos, targetPos, ease);
            this.controlesOrbita.target.lerpVectors(startTarget, endTarget, ease);
            this.controlesOrbita.update();
            
            if (progress < 1) {
                requestAnimationFrame(animateCamera);
            }
        };
        animateCamera();
    }

    // ============================================================
    // RESIZE Y ANIMACIÓN
    // ============================================================
    
    onWindowResize() {
    const contenedorVisor = document.getElementById('canvas3d-container');
    if (!contenedorVisor || !this.renderizador || !this.camara) return;
    
    // Esperar un poco para que el DOM se actualice
    setTimeout(() => {
        const w = contenedorVisor.clientWidth;
        const h = contenedorVisor.clientHeight;
        
        console.log(` Resize visor: ${w}x${h}`);
        
        if (w > 0 && h > 0) {
            // Actualizar cámara
            this.camara.aspect = w / h;
            this.camara.updateProjectionMatrix();
            
            // Actualizar renderizador
            this.renderizador.setSize(w, h);
            
            // Asegurar que el canvas ocupa todo
            this.renderizador.domElement.style.width = '100%';
            this.renderizador.domElement.style.height = '100%';
            
            // Actualizar controles
            if (this.controlesOrbita) {
                this.controlesOrbita.update();
            }
            
            console.log(` Visor actualizado a: ${w}x${h}`);
        }
    }, 50);
}

    verificarEstadoVisor() {
        const info = [];
        info.push(`THREE.js: ${typeof THREE !== 'undefined' ? '' : ''}`);
        info.push(`Escena: ${this.escena ? '' : ''}`);
        info.push(`Cámara: ${this.camara ? '' : ''}`);
        info.push(`Renderizador: ${this.renderizador ? '' : ''}`);
        info.push(`OrbitControls: ${this.controlesOrbita ? '' : ''}`);
        info.push(`Contenedores: ${this.listaContenedores.length}`);
        info.push(`Meshes arrastrables: ${this.meshesArrastrables.length}`);
        const cont = document.getElementById('canvas3d-container');
        if (cont) {
            info.push(`Contenedor DOM: ${cont.clientWidth}x${cont.clientHeight}`);
            info.push(`Canvas hijos: ${cont.querySelectorAll('canvas').length}`);
        }
        info.push(`Animación activa: ${this.inicializado ? '' : ''}`);
        alert(' Diagnóstico Visor 3D:\n' + info.join('\n'));
        console.log(' Diagnóstico:', info);
    }

    animate() {
        requestAnimationFrame(this.animate);
        if (this.controlesOrbita) this.controlesOrbita.update();
        if (this.renderizador && this.escena && this.camara) {
            this.renderizador.render(this.escena, this.camara);
        }
    }
};
// ============================================================
// INSTANCIA GLOBAL
// ============================================================

// Crear instancia SIEMPRE con la clase inline (más completa)
try {
    console.log(" Creando instancia SimuladorLogisticoApp...");
    window.appLogistica = new SimuladorLogisticoApp();
    console.log(" Instancia creada correctamente");
} catch (e) {
    console.error(" Error al crear instancia SimuladorLogisticoApp:", e);
}

// Funciones globales para los botones HTML
window.crearCarga = function() { 
    if (window.appLogistica) window.appLogistica.crearCarga(); 
};

window.eliminarUltimaCarga = function() { 
    if (window.appLogistica) window.appLogistica.eliminarUltimaCarga(); 
};

window.guardarEstado = function() { 
    if (window.appLogistica) window.appLogistica.guardarEstado(); 
};

window.cargarEstado = function() { 
    if (window.appLogistica) window.appLogistica.cargarEstado(); 
};

window.exportarCSV = function() { 
    if (window.appLogistica) window.appLogistica.exportarCSV(); 
};

window.exportarPDF = function() { 
    if (window.appLogistica) window.appLogistica.exportarPDF(); 
};

window.seleccionarPalletPorId = function(id) { 
    if (window.appLogistica) window.appLogistica.seleccionarPalletPorId(id); 
};

window.abrirModalEditarMaterial = function(c, p, m) { 
    if (window.appLogistica) window.appLogistica.abrirModalEditarMaterial(c, p, m); 
};

window.eliminarMaterialDesdePacking = function(c, p, m) { 
    if (window.appLogistica) window.appLogistica.eliminarMaterialDesdePacking(c, p, m); 
};

window.cerrarModalEditar = function() { 
    if (window.appLogistica) window.appLogistica.cerrarModalEditar(); 
};

window.guardarEdicionMaterial = function() { 
    if (window.appLogistica) window.appLogistica.guardarEdicionMaterial(); 
};

// Función de inicialización
function inicializarModuloLogistica() {
    console.log(" Inicializando módulo logístico 3D...");
    
    // Asegurar que la instancia existe
    if (!window.appLogistica) {
        console.warn(" appLogistica no existe, creando instancia...");
        try {
            window.appLogistica = new SimuladorLogisticoApp();
        } catch (e) {
            console.error(" No se pudo crear la instancia:", e);
            mostrarToast(" Error crítico en logística", 'error');
            return;
        }
    }
    
    if (typeof THREE === 'undefined') {
        console.warn(" Three.js no cargado. Intentando de nuevo...");
        mostrarToast(" Cargando motor 3D...", 'info');
        setTimeout(inicializarModuloLogistica, 1000);
        return;
    }
    
    // Verificar que los controles también están cargados
    if (typeof THREE.OrbitControls === 'undefined' || typeof THREE.DragControls === 'undefined') {
        console.warn(" Controles Three.js no cargados. Reintentando...");
        setTimeout(inicializarModuloLogistica, 1000);
        return;
    }
    
    if (!window.appLogistica.inicializado) {
        try {
            window.appLogistica.init();
            console.log(" Módulo logístico inicializado correctamente");
        } catch (e) {
            console.error(" Error al inicializar módulo logístico:", e);
            mostrarToast(" Error en logística: " + e.message, 'error');
        }
    }
}

// Función global para forzar reinicialización del módulo logístico (útil para depuración)
window.reiniciarLogistica = function() {
    console.log(" Forzando reinicialización del módulo logístico...");
    if (window.appLogistica) {
        window.appLogistica.inicializado = false;
        window.appLogistica.init();
    }
};

// Inicializar cuando el panel se active
document.addEventListener('DOMContentLoaded', function() {
    const panelLogistica = document.getElementById('panelLogistica');
    if (panelLogistica) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    if (panelLogistica.classList.contains('active')) {
                        setTimeout(inicializarModuloLogistica, 300);
                    }
                }
            });
        });
        observer.observe(panelLogistica, { attributes: true });
        
        if (panelLogistica.classList.contains('active')) {
            setTimeout(inicializarModuloLogistica, 500);
        }
    }
});

// Interceptar mostrarPanel
if (typeof mostrarPanel === 'function') {
    var mostrarPanelOriginal = mostrarPanel;
    mostrarPanel = function(panelId) {
        mostrarPanelOriginal(panelId);
        if (panelId === 'logistica' || panelId === 'Logistica') {
            setTimeout(inicializarModuloLogistica, 500);
        }
    };
}

console.log(" Módulo Logístico 3D con Three.js preparado");
