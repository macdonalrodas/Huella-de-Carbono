# Huella de carbono: ¿quién contamina más?

**Integrantes**:

- Jonatan David Macdonal Rodas
- Santiago Miranda Cañedo

**Descripción**: *Huella de Carbono* consiste en un dashboard interactivo desarrollado en React que analiza las emisiones de CO₂ por país entre 2010 y 2023 y las relaciona con la población y el PIB, con el fin de identificar patrones entre desarrollo económico y contaminación y fomentar la reflexión sobre la sostenibilidad global. Los datos provienen de Our World in Data (Global Carbon Budget 2025).

## 🔗 Dashboard publicado

**[Ver el dashboard](https://huella-de-carbono-tau.vercel.app/)**

## 📊 KPIs

| KPI | Gráfico |
|---|---|
| **Principal:** total de emisiones de CO₂ de los 5 mayores emisores (acumulado 2010–2023) | Líneas + ranking acumulado |
| CO₂ per cápita | Mapa coroplético |
| Variación porcentual 2010–2023 | Barras divergentes |
| País con mayor mejora ambiental | Tarjeta + línea |
| Relación PIB–emisiones (intensidad de carbono) | Dispersión (escala logarítmica) |

Además incluye emisiones por continente, contribución por sector y cambio de temperatura global como contexto. Todos los indicadores responden a los filtros de **año**, **continente** y **país**.

## 🛠️ Stack

| Herramienta | Uso |
|---|---|
| React + Vite | Estructura base del proyecto |
| Supabase (PostgreSQL) | Base de datos de los datos procesados |
| Recharts | Gráficos (líneas, barras, dispersión, áreas) |
| React-Leaflet + Natural Earth | Mapa coroplético |
| CSS Modules | Estilos con la paleta definida en la Fase 2 |
| Google Colab (pandas) | Limpieza y procesamiento de los datos |
| Vercel | Despliegue |

## 📁 Estructura

```
├── data/
│   ├── raw/              # Datos originales de Our World in Data (CSV y JSON)
│   └── processed/        # Datos limpios (JSON) y CSV cargados a Supabase
├── public/data/          # GeoJSON del mapa mundial (Natural Earth)
└── src/
    ├── components/
    │   ├── layout/       # Encabezado, filtros y contenedor de tarjetas
    │   ├── kpis/         # Tarjetas de KPIs
    │   ├── graficos/     # Gráficos de Recharts
    │   └── mapa/         # Mapa coroplético
    ├── context/          # Filtros globales (año, continente, país)
    ├── hooks/            # Carga de datos desde Supabase
    ├── lib/              # Conexión a Supabase, colores y continentes
    ├── styles/           # Paleta y estilos globales
    └── utils/            # Cálculos de KPIs, configuración y formato
```

## 🗄️ Datos

Fuente: [Our World in Data](https://ourworldindata.org/co2-emissions)

- Emisiones anuales de CO₂ por país
- CO₂ per cápita
- Emisiones de CO₂ por sector
- PIB per cápita (Banco Mundial)
- Población (ONU)
- Anomalía de temperatura global (Met Office HadCRUT5)

**Proceso:** los datos se limpiaron en Google Colab (filtro de países por código ISO3, recorte a 2010–2023, cálculo de KPIs), se exportaron a CSV y se cargaron como tablas en Supabase. El dashboard las consulta con `@supabase/supabase-js`.

## ▶️ Ejecutar localmente

1. Clonar el repositorio e instalar dependencias:

   ```bash
   git clone https://github.com/macdonalrodas/Huella-de-Carbono
   cd Huella-de-Carbono
   npm install
   ```

2. Crear un archivo `.env.local` en la raíz con las credenciales públicas de Supabase:

   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_xxxx
   ```

3. Iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   Abrir `http://localhost:5173`.