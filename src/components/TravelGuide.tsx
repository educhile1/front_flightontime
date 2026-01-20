import React from 'react';
import {
    MapPin,
    ThermometerSun,
    Bus,
    Utensils,
    ShieldAlert,
    Camera,
    ExternalLink,
    Plug,
    Phone,
    Wallet,
    Languages,
    Wind,
    Clock,
    DollarSign
} from 'lucide-react';
import type { TravelGuideResponse } from '../services/api';

interface TravelGuideProps {
    data: TravelGuideResponse;
}

export const TravelGuide: React.FC<TravelGuideProps> = ({ data }) => {
    const {
        destino,
        analisis_climatico_historico,
        logistica_transporte_aeropuerto,
        puntos_interes_georreferenciados,
        gastronomia_estacional,
        inteligencia_seguridad
    } = data;

    return (
        <div className="w-full max-w-5xl bg-gray-50 p-4 lg:p-8 animate-fade-in overflow-y-auto">

            {/* --- HEADER DESTINO --- */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                        <MapPin size={20} />
                        <span className="text-sm font-bold tracking-wide uppercase">Guía de Llegada Inteligente</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">{destino.ciudad}, {destino.pais}</h1>
                    <p className="text-gray-500 text-lg">{destino.aeropuerto}</p>
                </div>

                {/* Info Rápida País */}
                <div className="flex gap-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <div className="flex flex-col items-center px-3 border-r border-gray-300">
                        <Languages size={18} className="text-gray-400 mb-1" />
                        <span className="font-semibold">{destino.info_pais.idioma}</span>
                    </div>
                    <div className="flex flex-col items-center px-3 border-r border-gray-300">
                        <Wallet size={18} className="text-gray-400 mb-1" />
                        <span className="font-semibold">{destino.info_pais.moneda_codigo}</span>
                    </div>
                    <div className="flex flex-col items-center px-3">
                        <Plug size={18} className="text-gray-400 mb-1" />
                        <span className="font-semibold">{destino.tecnico.voltaje}/{destino.tecnico.enchufes[0]}</span>
                    </div>
                    <div className="flex flex-col items-center px-3 border-l border-gray-300 text-red-500">
                        <Phone size={18} className="mb-1" />
                        <span className="font-bold">{destino.emergencias.numero_unico}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* --- CLIMA Y MALETA --- */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                            <ThermometerSun size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Clima & Outfit</h2>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 mb-4">
                        <p className="text-gray-700 italic mb-2">"{analisis_climatico_historico.resumen}"</p>
                        <div className="flex items-center gap-2 text-sm font-semibold text-blue-800 mt-2">
                            <Wind size={16} />
                            {analisis_climatico_historico.temp_rango}
                        </div>
                    </div>

                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Maleta Inteligente</h3>
                    <div className="space-y-3">
                        {analisis_climatico_historico.maleta_inteligente.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${item.prioridad === 'Alta' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                                    <span className="text-gray-700 font-medium">{item.prenda}</span>
                                </div>
                                <a href={item.link_google_search} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500">
                                    <ExternalLink size={16} />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- TRANSPORTE --- */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="bg-green-100 p-2 rounded-lg text-green-600">
                            <Bus size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Transporte Aeropuerto</h2>
                    </div>

                    <div className="space-y-4">
                        {logistica_transporte_aeropuerto.map((opt, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border border-gray-100 rounded-xl bg-gray-50/50">
                                <div className="mb-2 sm:mb-0">
                                    <h4 className="font-bold text-gray-800">{opt.medio}</h4>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                        <Clock size={12} /> {opt.tiempo_minutos} min
                                        <span className="px-1">•</span>
                                        <span>{opt.horario_recomendado}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-green-600 text-lg flex items-center justify-end">
                                        <DollarSign size={16} />{opt.costo_estimado_usd}
                                    </div>
                                    <p className="text-xs text-gray-500">{opt.metodo_pago}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- GASTRONOMÍA --- */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                            <Utensils size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Gastronomía</h2>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Platos Imperdibles</h3>
                        <div className="flex flex-wrap gap-2">
                            {gastronomia_estacional.platos_sugeridos_fecha.map((plato, i) => (
                                <span key={i} className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm border border-orange-100">
                                    {plato}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="text-sm text-gray-600">
                            <span className="font-bold block text-gray-800 mb-1">Bebida Típica</span>
                            {gastronomia_estacional.bebida_tipica}
                        </div>
                        <div className="text-right">
                            <span className="block text-xs text-gray-400 font-bold uppercase">Precio Medio</span>
                            <span className="text-lg font-bold text-gray-800">${gastronomia_estacional.precio_medio_menu_usd} USD</span>
                        </div>
                    </div>
                </div>

                {/* --- SEGURIDAD --- */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="bg-red-100 p-2 rounded-lg text-red-600">
                            <ShieldAlert size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Seguridad</h2>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm font-bold text-gray-600">Nivel de Riesgo:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold border ${inteligencia_seguridad.nivel_riesgo.includes('Bajo') ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
                            {inteligencia_seguridad.nivel_riesgo}
                        </span>
                    </div>

                    <div className="space-y-3">
                        <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                            <h4 className="text-xs font-bold text-red-700 uppercase mb-1">Zonas a Evitar</h4>
                            <ul className="list-disc list-inside text-sm text-gray-700">
                                {inteligencia_seguridad.zonas_no_go.map((zona, i) => (
                                    <li key={i}>{zona}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <h4 className="text-xs font-bold text-gray-600 uppercase mb-1">Estafas Comunes</h4>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                                {inteligencia_seguridad.estafas_comunes_activas.slice(0, 2).map((estafa, i) => (
                                    <li key={i}>{estafa}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* --- PUNTOS DE INTERÉS --- */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 lg:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                            <Camera size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Turismo Express</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {puntos_interes_georreferenciados.filter(p => p.tipo === 'turismo' || p.tipo === 'comida' || p.tipo === 'transporte').slice(0, 6).map((poi, i) => (
                            <div key={i} className="p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow bg-white flex flex-col justify-between h-full">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-gray-900 leading-tight">{poi.nombre}</h4>
                                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-gray-100 rounded text-gray-500">{poi.tipo}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{poi.comentario_experto}</p>
                                </div>
                                <div className="flex gap-2 mt-auto">
                                    <a href={poi.navegacion.gmaps_nav} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                                        Google Maps
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};
