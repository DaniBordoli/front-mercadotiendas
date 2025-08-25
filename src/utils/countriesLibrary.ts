import countries from 'world-countries';

export interface CountryOption {
  value: string;
  label: string;
  flag: string;
}

// Función para obtener todas las opciones de países
export const getCountryOptions = (): CountryOption[] => {
  return countries
    .map(country => ({
      value: country.cca2, // Código ISO de 2 letras
      label: country.name.common, // Nombre común del país
      flag: country.flag // Emoji de la bandera
    }))
    .sort((a, b) => a.label.localeCompare(b.label)); // Ordenar alfabéticamente
};

// Función para obtener un país por su código
export const getCountryByCode = (code: string): CountryOption | undefined => {
  const country = countries.find(c => c.cca2 === code);
  if (!country) return undefined;
  
  return {
    value: country.cca2,
    label: country.name.common,
    flag: country.flag
  };
};

// Función para obtener el texto de la opción seleccionada
export const getCountryOptionLabel = (option: CountryOption) => `${option.flag} ${option.label}`;