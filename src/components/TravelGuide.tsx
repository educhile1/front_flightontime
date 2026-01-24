import React from 'react';
import {
    MapPin,
    ThermometerSun,
    Bus,
    Utensils,
    ShieldAlert,
    Camera,
    Plug,
    Phone,
    Wallet,
    Languages,
    Wind,
    Clock,
    DollarSign,
    CheckCircle
} from 'lucide-react';
import type { TravelGuideResponse } from '../services/api';
import { TravelGuideMap } from './TravelGuideMap';

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

    const [activeTab, setActiveTab] = React.useState<'guide' | 'tourism' | 'shop'>('guide');
    const [shopItems, setShopItems] = React.useState<{ name: string; price: number; selected: boolean }[]>([]);
    const [paymentStep, setPaymentStep] = React.useState<'form' | 'processing' | 'success'>('form');

    // Inicializar precios aleatorios para la tienda
    React.useEffect(() => {
        if (analisis_climatico_historico.maleta_inteligente) {
            const items = analisis_climatico_historico.maleta_inteligente.map(item => ({
                name: item.prenda,
                price: Number((Math.random() * (49.9 - 9.9) + 9.9).toFixed(2)),
                selected: false
            }));
            setShopItems(items);
        }
    }, [analisis_climatico_historico]);

    const toggleItemSelection = (index: number) => {
        const newItems = [...shopItems];
        newItems[index].selected = !newItems[index].selected;
        setShopItems(newItems);
    };

    const calculateTotal = () => {
        return shopItems
            .filter(item => item.selected)
            .reduce((sum, item) => sum + item.price, 0)
            .toFixed(2);
    };

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        setPaymentStep('processing');
        // Simular proceso de pago
        setTimeout(() => {
            setPaymentStep('success');
        }, 2000);
    };

    return (
        <div className="w-full max-w-5xl bg-gray-50 p-4 lg:p-8 animate-fade-in overflow-y-auto min-h-screen">

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

            {/* --- TABS --- */}
            <div className="flex gap-4 mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('guide')}
                    className={`pb-2 px-4 font-bold text-sm transition-colors ${activeTab === 'guide' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Guía de Viaje
                </button>
                <button
                    onClick={() => setActiveTab('tourism')}
                    className={`pb-2 px-4 font-bold text-sm transition-colors ${activeTab === 'tourism' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Turismo Express
                </button>
                <button
                    onClick={() => setActiveTab('shop')}
                    className={`pb-2 px-4 font-bold text-sm transition-colors ${activeTab === 'shop' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Tienda Maleta Inteligente
                </button>
            </div>

            {activeTab === 'guide' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">

                    {/* --- CLIMA --- */}
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

                        {/* Original Maleta List (Read Only or kept for info) - Logic: User asked to separate maleta. I'll keep the weather info here but maybe hide the list if it's now in the shop? 
                            User said "maleta inteligente debe quedar separada en otra pestaña". This implies moving it. 
                            However, the "Clima & Outfit" box is unified. I'll remove the list from here to avoid duplication and confusion. */}
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



                    {/* --- DISCLAIMER (For Guide) --- */}
                    <div className="lg:col-span-2 mt-4 text-center">
                        <p className="text-xs text-gray-400 italic">
                            * Los precios mostrados son aproximados y pueden variar. Se muestran en moneda local del lugar hacia donde se hace referencia.
                        </p>
                    </div>

                </div>

            )
            }

            {
                activeTab === 'tourism' && (
                    <div className="animate-fade-in bg-white rounded-2xl p-6 shadow-sm border border-teal-100 min-h-[500px]">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-teal-100 p-2 rounded-lg text-teal-600">
                                <Camera size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Turismo Express</h2>
                        </div>

                        {/* Mapa de Puntos de Interés */}
                        <div className="mb-6">
                            <TravelGuideMap points={puntos_interes_georreferenciados} />
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
                )
            }

            {
                activeTab === 'shop' && (
                    <div className="animate-fade-in bg-white p-6 rounded-2xl shadow-sm border border-purple-100 items-start">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                                <Wallet size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Tienda Maleta Inteligente</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Lista de Productos */}
                            <div className="lg:col-span-2 space-y-4">
                                <h3 className="font-bold text-gray-700 mb-2">Productos Recomendados para tu Viaje</h3>
                                {shopItems.map((item, idx) => (
                                    <div key={idx} className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${item.selected ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`} onClick={() => toggleItemSelection(idx)}>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={item.selected}
                                                onChange={() => { }} // Manejado por el div padre
                                                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                                            />
                                            <div>
                                                <p className="font-bold text-gray-800">{item.name}</p>
                                                <p className="text-xs text-gray-500">Esencial para este clima</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-purple-700">${item.price.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Checkout */}
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 h-fit sticky top-4">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Resumen de Compra</h3>

                                <div className="flex justify-between items-center mb-6 text-xl font-bold text-gray-900 border-b pb-4">
                                    <span>Total:</span>
                                    <span>${calculateTotal()}</span>
                                </div>

                                {paymentStep === 'form' && (
                                    <form onSubmit={handlePayment} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Número de Tarjeta</label>
                                            <input type="text" placeholder="0000 0000 0000 0000" required className="w-full p-2 border border-gray-300 rounded focus:border-purple-500 focus:outline-none" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expiración</label>
                                                <input type="text" placeholder="MM/YY" required className="w-full p-2 border border-gray-300 rounded focus:border-purple-500 focus:outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CVV</label>
                                                <input type="text" placeholder="123" required className="w-full p-2 border border-gray-300 rounded focus:border-purple-500 focus:outline-none" />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={Number(calculateTotal()) === 0}
                                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                                        >
                                            Pagar Ahora
                                        </button>
                                    </form>
                                )}

                                {paymentStep === 'processing' && (
                                    <div className="flex flex-col items-center justify-center py-8">
                                        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                                        <p className="text-purple-600 font-medium">Procesando pago seguro...</p>
                                    </div>
                                )}

                                {paymentStep === 'success' && (
                                    <div className="text-center py-4 animate-fade-in">
                                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle size={32} />
                                        </div>
                                        <h4 className="text-xl font-bold text-green-700 mb-2">¡Pago Exitoso!</h4>
                                        <p className="text-sm text-gray-600">
                                            Gracias por su compra. Sus productos serán entregados en la <span className="font-bold">oficina del aeropuerto de destino</span> ({destino.aeropuerto}).
                                        </p>
                                        <button
                                            onClick={() => { setPaymentStep('form'); setShopItems(shopItems.map(i => ({ ...i, selected: false }))) }}
                                            className="mt-6 text-sm text-purple-600 underline hover:text-purple-800"
                                        >
                                            Realizar otra compra
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};
