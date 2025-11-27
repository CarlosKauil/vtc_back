import { useState, useEffect } from 'react';
import { subirObra } from '../api/obras';
import { getAreas } from '../api/areas';
import DashboardLayout from '../layouts/DashboardLayout';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function ObraForm() {
  useDocumentTitle("Vartica | Subir Nueva Obra");
  const [form, setForm] = useState({
    nombre: '',
    archivo: null,
    libro: null,
    genero_tecnica: '',
    anio_creacion: '',
    area_id: '',
    descripcion: '',
    es_subastable: false,
    precio: '',
  });
  const [areas, setAreas] = useState([]);
  const [msg, setMsg] = useState('');
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    getAreas().then(setAreas);
  }, []);

  const handleChange = e => {
    const { name, value, files, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm(f => ({ ...f, [name]: checked }));
      if (name === 'es_subastable' && !checked) {
        setForm(f => ({ ...f, precio: '' }));
      }
    } else if (files) {
      const file = files[0];
      setForm(f => ({ ...f, [name]: file }));
      if (file && form.area_id) {
        const ext = file.name.split('.').pop().toLowerCase();
        if (["jpg", "jpeg", "png"].includes(ext)) {
          setPreview(URL.createObjectURL(file));
        } else if (["wav"].includes(ext)) {
          setPreview(URL.createObjectURL(file));
        } else if (["pdf"].includes(ext)) {
          setPreview(file.name);
        } else {
          setPreview(file.name);
        }
      }
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    const data = new FormData();

    Object.entries(form).forEach(([k, v]) => {

      // Omitir archivo si es área 3
      if (form.area_id === '3' && k === 'archivo') return;

      // Omitir libro si NO es área 3
      if (form.area_id !== '3' && k === 'libro') return;

      // Omitir precio si no es subastable
      if (k === 'precio' && !form.es_subastable) return;

      // Convertir checkbox a "1" o "0"
      if (k === 'es_subastable') {
        data.append(k, v ? '1' : '0');
        return;
      }

      // Agregar normalmente
      data.append(k, v);
    });

    try {
      await subirObra(data);
      setMsg('¡Obra enviada correctamente!');
      setForm({
        nombre: '', archivo: null, libro: null, genero_tecnica: '', anio_creacion: '', area_id: '', descripcion: '', es_subastable: false, precio: '',
      });
      setPreview(null);
    } catch (err) {
      if (err.response?.data?.errors) {
        const errores = Object.values(err.response.data.errors).flat().join(' | ');
        setMsg(errores);
      } else {
        setMsg(
          err.response?.data?.message ||
          err.response?.data?.error ||
          'Error al enviar la obra'
        );
      }
      console.log('Error completo:', err.response?.data);
    }
  };

  const getFileAccept = () => {
    switch (parseInt(form.area_id)) {
      case 1: return ".glb,.gltf";
      case 2: return ".wav";
      case 3: return ".pdf";
      case 4: return ".jpg,.png";
      default: return ".jpg,.jpeg,.png,.fbx,.blend,.wav,.mp4,.pdf";
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-md p-6 mt-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Subir una nueva obra</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Nombre */}
          <div>
            <label className="block font-semibold text-gray-700">Nombre de la obra</label>
            <input
              name="nombre"
              placeholder="Mi Obra"
              value={form.nombre}
              maxLength={24}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 text-gray-500 py-1"
            />
            <p className="text-xs text-gray-400 text-right">{form.nombre.length}/24</p>
          </div>

          {/* Seleccionar Área primero */}
          <div>
            <label className="block font-semibold text-gray-700">Área artística</label>
            <select
              name="area_id"
              value={form.area_id}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 text-gray-500 py-1"
            >
              <option value="">Selecciona un área</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </div>

          {form.area_id && (
            <>
              {/* Checkbox subastable */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="es_subastable"
                  checked={!!form.es_subastable}
                  onChange={handleChange}
                  id="es_subastable"
                  className="h-4 w-4"
                />
                <label htmlFor="es_subastable" className="text-sm font-medium text-gray-700">
                  Permitir que esta obra se subaste
                </label>
              </div>

              {/* Precio de subasta si checked */}
              {form.es_subastable && (
                <div>
                  <label className="block font-semibold text-gray-700">Precio inicial para subasta (MX)</label>
                  <input
                    name="precio"
                    type="number"
                    min="1"
                    step="0.01"
                    value={form.precio}
                    onChange={handleChange}
                    required={form.es_subastable}
                    className="w-full border border-gray-300 rounded px-3 text-gray-500 py-1"
                    placeholder="Ej: 100.00"
                  />
                </div>
              )}

              {/* Archivo/libro según área */}
              {form.area_id === "3" ? (
                <div>
                  <label className="block font-semibold text-gray-700">Libro (PDF)</label>
                  <input
                    name="libro"
                    type="file"
                    accept=".pdf"
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 text-gray-500 py-1"
                  />
                  {preview && (
                    <p className="mt-2 text-sm">Libro PDF: {preview}</p>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-gray-700">Archivo</label>
                  <input
                    name="archivo"
                    type="file"
                    accept={getFileAccept()}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 text-gray-500 py-1"
                  />
                  {preview && (
                    <div className="border p-3 rounded bg-gray-50 mt-2">
                      <p className="font-semibold text-gray-700 mb-2">Vista previa:</p>
                      {["jpg", "jpeg", "png"].includes(form.archivo?.name?.split('.').pop().toLowerCase()) && (
                        <img src={preview} alt="Vista previa" className="max-h-64 object-contain mx-auto rounded" />
                      )}
                      {["wav"].includes(form.archivo?.name?.split('.').pop().toLowerCase()) && (
                        <audio controls src={preview} className="w-full" />
                      )}
                      {["glb", "gltf"].includes(form.archivo?.name?.split('.').pop().toLowerCase()) && (
                        <p className="text-blue-600 text-center">Archivo 3D cargado: {preview}</p>
                      )}
                      {!["jpg", "jpeg", "png", "wav", "glb", "gltf"].includes(form.archivo?.name?.split('.').pop().toLowerCase()) && (
                        <p>{preview}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

             {["1", "2", "4"].includes(form.area_id) && (
                <div>
                  <label className="block font-semibold text-gray-700">Género o técnica</label>
                  <input
                    name="genero_tecnica"
                    placeholder="Ej: Impresionismo"
                    value={form.genero_tecnica}
                    maxLength={17}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 text-gray-500 py-1"
                  />
                  <p className="text-xs text-gray-400 text-right">{form.genero_tecnica.length}/17</p>
                </div>
              )}

              <div>
                <label className="block font-semibold text-gray-700">Año de creación</label>
                <input
                  name="anio_creacion"
                  type="number"
                  placeholder="2024"
                  min="1"
                  max="9999"
                  value={form.anio_creacion}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 text-gray-500 py-1"
                />
              </div>

              {form.area_id !== "2" && (
                <div>
                  <label className="block font-semibold text-gray-700">Descripción de la obra</label>
                  <textarea
                    name="descripcion"
                    placeholder="Mi nueva obra es..."
                    value={form.descripcion}
                    maxLength={421}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 text-gray-500 py-1 resize-none"
                    rows={3}
                  />
                  <p className="text-xs text-gray-400 text-right">{form.descripcion.length}/421</p>
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            className="bg-gray-800 text-white font-semibold rounded px-6 py-3 mt-2 hover:bg-gray-900 transition"
          >
            Subir obra
          </button>
          {msg && (
            <p className={`text-center font-medium mt-2 ${msg.includes('correctamente') ? 'text-green-600' : 'text-red-500'}`}>
              {msg}
            </p>
          )}
        </form>
      </div>
    </DashboardLayout>
  );
}
