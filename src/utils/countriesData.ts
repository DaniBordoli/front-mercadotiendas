export interface Country {
  code: string;
  name: string;
  provinces: Province[];
}

export interface Province {
  code: string;
  name: string;
}

export const countries: Country[] = [
  {
    code: 'AR',
    name: 'Argentina',
    provinces: [
      { code: 'CABA', name: 'Ciudad Autónoma de Buenos Aires' },
      { code: 'BA', name: 'Buenos Aires' },
      { code: 'CA', name: 'Catamarca' },
      { code: 'CH', name: 'Chaco' },
      { code: 'CT', name: 'Chubut' },
      { code: 'CB', name: 'Córdoba' },
      { code: 'CR', name: 'Corrientes' },
      { code: 'ER', name: 'Entre Ríos' },
      { code: 'FO', name: 'Formosa' },
      { code: 'JY', name: 'Jujuy' },
      { code: 'LP', name: 'La Pampa' },
      { code: 'LR', name: 'La Rioja' },
      { code: 'MZ', name: 'Mendoza' },
      { code: 'MI', name: 'Misiones' },
      { code: 'NQ', name: 'Neuquén' },
      { code: 'RN', name: 'Río Negro' },
      { code: 'SA', name: 'Salta' },
      { code: 'SJ', name: 'San Juan' },
      { code: 'SL', name: 'San Luis' },
      { code: 'SC', name: 'Santa Cruz' },
      { code: 'SF', name: 'Santa Fe' },
      { code: 'SE', name: 'Santiago del Estero' },
      { code: 'TF', name: 'Tierra del Fuego' },
      { code: 'TU', name: 'Tucumán' }
    ]
  },
  {
    code: 'CL',
    name: 'Chile',
    provinces: [
      { code: 'AI', name: 'Aisén del General Carlos Ibáñez del Campo' },
      { code: 'AN', name: 'Antofagasta' },
      { code: 'AP', name: 'Arica y Parinacota' },
      { code: 'AT', name: 'Atacama' },
      { code: 'BI', name: 'Biobío' },
      { code: 'CO', name: 'Coquimbo' },
      { code: 'AR', name: 'La Araucanía' },
      { code: 'LI', name: 'Libertador General Bernardo O\'Higgins' },
      { code: 'LL', name: 'Los Lagos' },
      { code: 'LR', name: 'Los Ríos' },
      { code: 'MA', name: 'Magallanes y de la Antártica Chilena' },
      { code: 'ML', name: 'Maule' },
      { code: 'NB', name: 'Ñuble' },
      { code: 'RM', name: 'Región Metropolitana de Santiago' },
      { code: 'TA', name: 'Tarapacá' },
      { code: 'VS', name: 'Valparaíso' }
    ]
  },
  {
    code: 'BR',
    name: 'Brasil',
    provinces: [
      { code: 'AC', name: 'Acre' },
      { code: 'AL', name: 'Alagoas' },
      { code: 'AP', name: 'Amapá' },
      { code: 'AM', name: 'Amazonas' },
      { code: 'BA', name: 'Bahía' },
      { code: 'CE', name: 'Ceará' },
      { code: 'DF', name: 'Distrito Federal' },
      { code: 'ES', name: 'Espírito Santo' },
      { code: 'GO', name: 'Goiás' },
      { code: 'MA', name: 'Maranhão' },
      { code: 'MT', name: 'Mato Grosso' },
      { code: 'MS', name: 'Mato Grosso do Sul' },
      { code: 'MG', name: 'Minas Gerais' },
      { code: 'PA', name: 'Pará' },
      { code: 'PB', name: 'Paraíba' },
      { code: 'PR', name: 'Paraná' },
      { code: 'PE', name: 'Pernambuco' },
      { code: 'PI', name: 'Piauí' },
      { code: 'RJ', name: 'Río de Janeiro' },
      { code: 'RN', name: 'Río Grande do Norte' },
      { code: 'RS', name: 'Río Grande do Sul' },
      { code: 'RO', name: 'Rondônia' },
      { code: 'RR', name: 'Roraima' },
      { code: 'SC', name: 'Santa Catarina' },
      { code: 'SP', name: 'São Paulo' },
      { code: 'SE', name: 'Sergipe' },
      { code: 'TO', name: 'Tocantins' }
    ]
  },
  {
    code: 'UY',
    name: 'Uruguay',
    provinces: [
      { code: 'AR', name: 'Artigas' },
      { code: 'CA', name: 'Canelones' },
      { code: 'CL', name: 'Cerro Largo' },
      { code: 'CO', name: 'Colonia' },
      { code: 'DU', name: 'Durazno' },
      { code: 'FS', name: 'Flores' },
      { code: 'FD', name: 'Florida' },
      { code: 'LA', name: 'Lavalleja' },
      { code: 'MA', name: 'Maldonado' },
      { code: 'MO', name: 'Montevideo' },
      { code: 'PA', name: 'Paysandú' },
      { code: 'RN', name: 'Río Negro' },
      { code: 'RV', name: 'Rivera' },
      { code: 'RO', name: 'Rocha' },
      { code: 'SA', name: 'Salto' },
      { code: 'SJ', name: 'San José' },
      { code: 'SO', name: 'Soriano' },
      { code: 'TA', name: 'Tacuarembó' },
      { code: 'TT', name: 'Treinta y Tres' }
    ]
  },
  {
    code: 'PY',
    name: 'Paraguay',
    provinces: [
      { code: 'ASU', name: 'Asunción' },
      { code: 'CON', name: 'Concepción' },
      { code: 'SAN', name: 'San Pedro' },
      { code: 'COR', name: 'Cordillera' },
      { code: 'GUA', name: 'Guairá' },
      { code: 'CAA', name: 'Caaguazú' },
      { code: 'CAZ', name: 'Caazapá' },
      { code: 'ITA', name: 'Itapúa' },
      { code: 'MIS', name: 'Misiones' },
      { code: 'PAR', name: 'Paraguarí' },
      { code: 'ALT', name: 'Alto Paraná' },
      { code: 'CEN', name: 'Central' },
      { code: 'ÑEE', name: 'Ñeembucú' },
      { code: 'AMA', name: 'Amambay' },
      { code: 'CAN', name: 'Canindeyú' },
      { code: 'PRE', name: 'Presidente Hayes' },
      { code: 'BOQ', name: 'Boquerón' },
      { code: 'ALT_PAR', name: 'Alto Paraguay' }
    ]
  },
  {
    code: 'BO',
    name: 'Bolivia',
    provinces: [
      { code: 'LP', name: 'La Paz' },
      { code: 'CB', name: 'Cochabamba' },
      { code: 'SC', name: 'Santa Cruz' },
      { code: 'OR', name: 'Oruro' },
      { code: 'PT', name: 'Potosí' },
      { code: 'TJ', name: 'Tarija' },
      { code: 'CH', name: 'Chuquisaca' },
      { code: 'BE', name: 'Beni' },
      { code: 'PA', name: 'Pando' }
    ]
  },
  {
    code: 'PE',
    name: 'Perú',
    provinces: [
      { code: 'AMA', name: 'Amazonas' },
      { code: 'ANC', name: 'Áncash' },
      { code: 'APU', name: 'Apurímac' },
      { code: 'ARE', name: 'Arequipa' },
      { code: 'AYA', name: 'Ayacucho' },
      { code: 'CAJ', name: 'Cajamarca' },
      { code: 'CAL', name: 'Callao' },
      { code: 'CUS', name: 'Cusco' },
      { code: 'HUV', name: 'Huancavelica' },
      { code: 'HUC', name: 'Huánuco' },
      { code: 'ICA', name: 'Ica' },
      { code: 'JUN', name: 'Junín' },
      { code: 'LAL', name: 'La Libertad' },
      { code: 'LAM', name: 'Lambayeque' },
      { code: 'LIM', name: 'Lima' },
      { code: 'LOR', name: 'Loreto' },
      { code: 'MDD', name: 'Madre de Dios' },
      { code: 'MOQ', name: 'Moquegua' },
      { code: 'PAS', name: 'Pasco' },
      { code: 'PIU', name: 'Piura' },
      { code: 'PUN', name: 'Puno' },
      { code: 'SAM', name: 'San Martín' },
      { code: 'TAC', name: 'Tacna' },
      { code: 'TUM', name: 'Tumbes' },
      { code: 'UCA', name: 'Ucayali' }
    ]
  },
  {
    code: 'EC',
    name: 'Ecuador',
    provinces: [
      { code: 'AZ', name: 'Azuay' },
      { code: 'BO', name: 'Bolívar' },
      { code: 'CA', name: 'Cañar' },
      { code: 'CR', name: 'Carchi' },
      { code: 'CH', name: 'Chimborazo' },
      { code: 'CO', name: 'Cotopaxi' },
      { code: 'EO', name: 'El Oro' },
      { code: 'ES', name: 'Esmeraldas' },
      { code: 'GA', name: 'Galápagos' },
      { code: 'GU', name: 'Guayas' },
      { code: 'IM', name: 'Imbabura' },
      { code: 'LO', name: 'Loja' },
      { code: 'LR', name: 'Los Ríos' },
      { code: 'MA', name: 'Manabí' },
      { code: 'MS', name: 'Morona Santiago' },
      { code: 'NA', name: 'Napo' },
      { code: 'OR', name: 'Orellana' },
      { code: 'PA', name: 'Pastaza' },
      { code: 'PI', name: 'Pichincha' },
      { code: 'SE', name: 'Santa Elena' },
      { code: 'SD', name: 'Santo Domingo de los Tsáchilas' },
      { code: 'SU', name: 'Sucumbíos' },
      { code: 'TU', name: 'Tungurahua' },
      { code: 'ZC', name: 'Zamora Chinchipe' }
    ]
  },
  {
    code: 'CO',
    name: 'Colombia',
    provinces: [
      { code: 'AMA', name: 'Amazonas' },
      { code: 'ANT', name: 'Antioquia' },
      { code: 'ARA', name: 'Arauca' },
      { code: 'ATL', name: 'Atlántico' },
      { code: 'BOL', name: 'Bolívar' },
      { code: 'BOY', name: 'Boyacá' },
      { code: 'CAL', name: 'Caldas' },
      { code: 'CAQ', name: 'Caquetá' },
      { code: 'CAS', name: 'Casanare' },
      { code: 'CAU', name: 'Cauca' },
      { code: 'CES', name: 'Cesar' },
      { code: 'CHO', name: 'Chocó' },
      { code: 'COR', name: 'Córdoba' },
      { code: 'CUN', name: 'Cundinamarca' },
      { code: 'DC', name: 'Distrito Capital de Bogotá' },
      { code: 'GUA', name: 'Guainía' },
      { code: 'GUV', name: 'Guaviare' },
      { code: 'HUI', name: 'Huila' },
      { code: 'LAG', name: 'La Guajira' },
      { code: 'MAG', name: 'Magdalena' },
      { code: 'MET', name: 'Meta' },
      { code: 'NAR', name: 'Nariño' },
      { code: 'NSA', name: 'Norte de Santander' },
      { code: 'PUT', name: 'Putumayo' },
      { code: 'QUI', name: 'Quindío' },
      { code: 'RIS', name: 'Risaralda' },
      { code: 'SAP', name: 'San Andrés, Providencia y Santa Catalina' },
      { code: 'SAN', name: 'Santander' },
      { code: 'SUC', name: 'Sucre' },
      { code: 'TOL', name: 'Tolima' },
      { code: 'VAC', name: 'Valle del Cauca' },
      { code: 'VAU', name: 'Vaupés' },
      { code: 'VID', name: 'Vichada' }
    ]
  },
  {
    code: 'VE',
    name: 'Venezuela',
    provinces: [
      { code: 'DC', name: 'Distrito Capital' },
      { code: 'AM', name: 'Amazonas' },
      { code: 'AN', name: 'Anzoátegui' },
      { code: 'AP', name: 'Apure' },
      { code: 'AR', name: 'Aragua' },
      { code: 'BA', name: 'Barinas' },
      { code: 'BO', name: 'Bolívar' },
      { code: 'CA', name: 'Carabobo' },
      { code: 'CO', name: 'Cojedes' },
      { code: 'DA', name: 'Delta Amacuro' },
      { code: 'FA', name: 'Falcón' },
      { code: 'GU', name: 'Guárico' },
      { code: 'LA', name: 'Lara' },
      { code: 'ME', name: 'Mérida' },
      { code: 'MI', name: 'Miranda' },
      { code: 'MO', name: 'Monagas' },
      { code: 'NE', name: 'Nueva Esparta' },
      { code: 'PO', name: 'Portuguesa' },
      { code: 'SU', name: 'Sucre' },
      { code: 'TA', name: 'Táchira' },
      { code: 'TR', name: 'Trujillo' },
      { code: 'VA', name: 'Vargas' },
      { code: 'YA', name: 'Yaracuy' },
      { code: 'ZU', name: 'Zulia' }
    ]
  }
];

export const getCountryByCode = (code: string): Country | undefined => {
  return countries.find(country => country.code === code);
};

export const getProvincesByCountryCode = (countryCode: string): Province[] => {
  const country = getCountryByCode(countryCode);
  return country ? country.provinces : [];
};

export const getCountryOptions = () => {
  return countries.map(country => ({
    value: country.code,
    label: country.name
  }));
};

export const getProvinceOptions = (countryCode: string) => {
  const provinces = getProvincesByCountryCode(countryCode);
  return provinces.map(province => ({
    value: province.code,
    label: province.name
  }));
};