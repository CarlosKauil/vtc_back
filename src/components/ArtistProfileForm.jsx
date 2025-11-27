import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { getProfile, updateProfile } from '../api/profile';
import { getAreas } from '../api/areas';
import { useDocumentTitle } from '../hooks/useDocumentTitle';


// Respaldo si la API alternativa falla
const fallbackCountries = [
    { name: "México", code: "MX" },
    { name: "España", code: "ES" },
    { name: "Argentina", code: "AR" },
    { name: "Colombia", code: "CO" },
    { name: "Perú", code: "PE" },
    { name: "Chile", code: "CL" },
    { name: "Ecuador", code: "EC" },
    { name: "Venezuela", code: "VE" },
    { name: "Estados Unidos", code: "US" },
    // Agrega más si quieres
];

export default function ArtistProfileForm() {
    useDocumentTitle("Vartica | Editar Perfil de Artista");
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        alias: '',
        fecha_nacimiento: '',
        area_id: '',
        instagram: '',
        x_twitter: '',
        linkedin: '',
        country: '',
    });
    const [areas, setAreas] = useState([]);
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return dateString.split('T')[0];
    };

    // Cargar países desde API alternativa, si falla usar respaldo local
    useEffect(() => {
        fetch('https://countriesnow.space/api/v0.1/countries/positions')
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => {
                if (Array.isArray(data.data)) {
                    const countriesList = data.data.map(c => ({
                        name: c.name,
                        code: c.iso2 || c.name // iso2 vacío para algunos países exóticos
                    })).sort((a, b) => a.name.localeCompare(b.name));
                    setCountries(countriesList);
                } else {
                    setCountries(fallbackCountries);
                }
            })
            .catch(() => setCountries(fallbackCountries));
    }, []);

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            try {
                const areaData = await getAreas();
                setAreas(areaData);
                const data = await getProfile();
                setProfile(data);
                setFormData({
                    name: data.user.name || '',
                    alias: data.artist.alias || '',
                    fecha_nacimiento: formatDate(data.artist.fecha_nacimiento),
                    area_id: data.artist.area_id || '',
                    instagram: data.artist.instagram || '',
                    x_twitter: data.artist.x_twitter || '',
                    linkedin: data.artist.linkedin || '',
                    country: data.artist.country || '',
                });
                setMessage('Perfil cargado con éxito.');
            } catch (error) {
                setMessage('Error al cargar datos del perfil o áreas.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'alias') {
            const validAliasRegex = /^[a-zA-Z0-9\-]*$/;
            if (!validAliasRegex.test(value)) {
                setErrors(prev => ({ ...prev, alias: ['El alias solo puede contener letras, números y guiones.'] }));
            } else {
                setErrors(prev => ({ ...prev, alias: null }));
            }
        }
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name !== 'alias') {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validAliasRegex = /^[a-zA-Z0-9\-]+$/;
        if (!validAliasRegex.test(formData.alias)) {
            setErrors({ alias: ['El alias solo puede contener letras, números y guiones y no puede estar vacío.'] });
            return;
        }

        setSaving(true);
        setErrors({});
        const dataToSend = {
            ...formData,
            area_id: parseInt(formData.area_id),
        };

        try {
            const response = await updateProfile(dataToSend);
            setMessage(response.message);

            if (response.user) {
                const userInStorage = JSON.parse(localStorage.getItem('user'));
                localStorage.setItem('user', JSON.stringify({ ...userInStorage, name: response.user.name }));
            }

            const updatedData = await getProfile();
            setProfile(updatedData);
            setFormData({
                name: updatedData.user.name || '',
                alias: updatedData.artist.alias || '',
                fecha_nacimiento: formatDate(updatedData.artist.fecha_nacimiento),
                area_id: updatedData.artist.area_id || '',
                instagram: updatedData.artist.instagram || '',
                x_twitter: updatedData.artist.x_twitter || '',
                linkedin: updatedData.artist.linkedin || '',
                country: updatedData.artist.country || '',
            });
        } catch (error) {
            setMessage('Error al guardar el perfil.');
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else if (error.message.includes('403')) {
                setMessage('Error: No autorizado para realizar esta acción.');
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="text-center py-12 text-gray-500">Cargando perfil para edición...</div>
            </DashboardLayout>
        );
    }

    const profileLink = profile?.link;

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8 mt-6 mb-8">
                <h2 className="text-3xl font-extrabold mb-6 text-gray-900 border-b pb-2">
                    Editar Perfil de Artista
                </h2>

                {message && (
                    <p className={`mb-4 p-3 rounded font-medium ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nombre de usuario */}
                        <div className="col-span-full">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-md border p-2 shadow-sm ${errors.name ? 'border-red-500' : 'border-gray-300'} text-gray-500`}
                                required
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name[0]}</p>}
                        </div>
                        {/* Alias artístico */}
                        <div>
                            <label htmlFor="alias" className="block text-sm font-medium text-gray-700">Alias Artístico</label>
                            <input
                                type="text"
                                name="alias"
                                id="alias"
                                value={formData.alias}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-md border p-2 shadow-sm text-gray-500 ${errors.alias ? 'border-red-500' : 'border-gray-300'}`}
                                required
                            />
                            {errors.alias && <p className="mt-1 text-xs text-red-500">{errors.alias[0]}</p>}
                        </div>
                        {/* Fecha de nacimiento */}
                        <div>
                            <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                            <input
                                type="date"
                                name="fecha_nacimiento"
                                id="fecha_nacimiento"
                                value={formData.fecha_nacimiento}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-md border p-2 shadow-sm text-gray-500 ${errors.fecha_nacimiento ? 'border-red-500' : 'border-gray-300'}`}
                                required
                            />
                            {errors.fecha_nacimiento && <p className="mt-1 text-xs text-red-500">{errors.fecha_nacimiento[0]}</p>}
                        </div>
                        {/* Área artística */}
                        <div>
                            <label htmlFor="area_id" className="block text-sm font-medium text-gray-700">Área Artística</label>
                            <select
                                name="area_id"
                                id="area_id"
                                value={formData.area_id}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-md border p-2 shadow-sm text-gray-500 ${errors.area_id ? 'border-red-500' : 'border-gray-300'}`}
                                required
                            >
                                <option value="">Selecciona un área</option>
                                {areas.map(area => (
                                    <option key={area.id} value={area.id}>{area.nombre}</option>
                                ))}
                            </select>
                            {errors.area_id && <p className="mt-1 text-xs text-red-500">{errors.area_id[0]}</p>}
                        </div>
                        {/* Instagram */}
                        <div>
                            <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">Instagram</label>
                            <input
                                type="text"
                                name="instagram"
                                id="instagram"
                                value={formData.instagram}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-md border p-2 shadow-sm text-gray-500 ${errors.instagram ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="@usuario o URL completa"
                            />
                            {errors.instagram && <p className="mt-1 text-xs text-red-500">{errors.instagram[0]}</p>}
                        </div>
                        {/* X/Twitter */}
                        <div>
                            <label htmlFor="x_twitter" className="block text-sm font-medium text-gray-700">X (Twitter)</label>
                            <input
                                type="text"
                                name="x_twitter"
                                id="x_twitter"
                                value={formData.x_twitter}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-md border p-2 shadow-sm text-gray-500 ${errors.x_twitter ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="@usuario o URL completa"
                            />
                            {errors.x_twitter && <p className="mt-1 text-xs text-red-500">{errors.x_twitter[0]}</p>}
                        </div>
                        {/* LinkedIn */}
                        <div>
                            <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">LinkedIn</label>
                            <input
                                type="text"
                                name="linkedin"
                                id="linkedin"
                                value={formData.linkedin}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-md border p-2 shadow-sm text-gray-500 ${errors.linkedin ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="URL completa de tu perfil"
                            />
                            {errors.linkedin && <p className="mt-1 text-xs text-red-500">{errors.linkedin[0]}</p>}
                        </div>
                        {/* País */}
                        <div>
                            <label htmlFor="country" className="block text-sm font-medium text-gray-700">País</label>
                            <select
                                name="country"
                                id="country"
                                value={formData.country}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-md border p-2 shadow-sm text-gray-500 ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
                                required
                            >
                                <option value="">Selecciona un país</option>
                                {countries.map(c => (
                                    <option key={c.code} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                            {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country[0]}</p>}
                        </div>
                    </div>
                    <div className="mt-8">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                        >
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                    {profileLink && (
                        <div className="mt-8 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm font-medium text-blue-700">Tu perfil público:</p>
                           <Link
                                to={`/artist/${profileLink}`}
                                target="_blank"
                                className="text-blue-600 hover:text-blue-800 break-all text-sm underline font-mono"
                            >
                                {window.location.origin}/artist/{profileLink}
                            </Link>
                        </div>
                    )}
                </form>
            </div>
        </DashboardLayout>
    );
}
