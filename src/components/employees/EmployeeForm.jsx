import React, { useState, useRef } from 'react';

// --- PRIMEREACT V8 IMPORTS ---
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { SelectButton } from 'primereact/selectbutton';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { InputTextarea } from 'primereact/inputtextarea';

// --- MOCK DATA & CONFIGURATIONS ---

// Opciones para Pensión (SelectButton)
const PENSION_OPTIONS = [
    { label: 'SI', value: 'SI' },
    { label: 'NO', value: 'NO' }
];

// Opciones base para Dropdowns (Simulando _config_det de BD)
const MOCK_DB_CONFIG = {
    docTypes: [{ label: 'Cédula', value: 'CEDULA' }, { label: 'Pasaporte', value: 'PASAPORTE' }],
    nationalities: [{ label: 'Ecuador', value: 'EC' }, { label: 'Argentina', value: 'AR' }],
    bloodTypes: [{ label: 'O+', value: 'O+' }, { label: 'A-', value: 'A-' }],
    civilStatus: [{ label: 'Casado', value: 'CASADO' }, { label: 'Soltero', value: 'SOLTERO' }],
    cities: [{ label: 'Quito', value: 'UIO' }, { label: 'Guayaquil', value: 'GYE' }]
};

// Datos simulados para las tablas secundarias
const MOCK_PHONE_TYPES = [
    { label: 'Celular Personal', value: 'CELULAR' },
    { label: 'Teléfono Casa', value: 'CASA' },
    { label: 'Teléfono Trabajo', value: 'TRABAJO' }
];

const MOCK_PHONES = [
    { id: 100, tipo: 'CELULAR', telefono: '0991234567', principal: true },
    { id: 101, tipo: 'CASA', telefono: '022345678', principal: false }
];

const MOCK_EDUCATION = [
    { id: 1, categoria: 'Secundaria', institucion: 'Colegio Y', descripcion: '', inicio: '2024-06-05', fin: '2025-07-30' }
];

// --- NUEVAS OPCIONES PARA LOS SUB-MODALES ---
const MOCK_CATEGORIAS_EDU = [
    { label: 'Educacion Primaria', value: 'PRIMARIA' },
    { label: 'Educacion Secundaria', value: 'SECUNDARIA' },
    { label: 'Curso', value: 'CURSO' }
];

const MOCK_CATEGORIAS_DOCS = [
    { label: 'Contrato', value: 'CONTRATO' },
    { label: 'Aviso Ingreso', value: 'AVISO' },
    { label: 'Certificado Trabajo', value: 'CERTIFICADO' }
];

const MOCK_PARENTESCO = [
    { label: 'Esposa', value: 'ESPOSA' },
    { label: 'Hijo', value: 'HIJO' },
    { label: 'Nieto', value: 'NIETO' }
];

const MOCK_TIPO_HISTORIAL = [
    { label: 'Poligrafias', value: 'POLIGRAFIA' },
    { label: 'Sanciones', value: 'SANCION' },
    { label: 'Ficha Medica', value: 'FICHA' }
];

const MOCK_BANCOS = [
    { label: 'Banco Uno', value: 'UNO' },
    { label: 'Banco Dos', value: 'DOS' }
];

const MOCK_TIPO_CUENTA = [
    { label: 'Cuenta Corriente', value: 'CORRIENTE' },
    { label: 'Caja de Ahorro', value: 'AHORRO' }
];
export default function EmployeeForm() {
    const toast = useRef(null);

    // Inicializamos con los datos Mock, pero ahora son editables
    const [phones, setPhones] = useState(MOCK_PHONES);
    const emptyPhone = {
        id: null,
        tipo: '',
        telefono: '',
        principal: false
    };
    const [phoneDialog, setPhoneDialog] = useState(false); // Visibilidad del sub-modal
    const [phoneData, setPhoneData] = useState(emptyPhone); // Datos temporales (Edición/Creación)
    const [submitted, setSubmitted] = useState(false); // Para validaciones (rojo si está vacío)
    const [accounts, setAccounts] = useState([
        { id: 1, numero: '909-99122', banco: 'Banco Uno', tipo: 'Corriente', principal: true },
        { id: 2, numero: '101-11-00', banco: 'Banco Dos', tipo: 'Ahorros', principal: false }
    ]);


    // --- ESTADO PRINCIPAL DEL EMPLEADO ---
    const [formData, setFormData] = useState({
        tipoDoc: 'CEDULA',
        nroIdentificador: '045826692',
        nombre: 'Nombre',
        apellidos: 'Apellidos',
        nacionalidad: 'EC',
        estatura: 1.5,
        fechaIngreso: null,
        fechaFin: null,
        lugarNacimiento: 'UIO',
        email: 'correo@electrico.vom',
        tipoSangre: 'O+',
        pension: 'NO', // Default NO
        estadoCivil: 'CASADO',
        ubicacionGPS: '',
    });

    // --- ESTADOS DE VISIBILIDAD DE MODALES ---
    const [modals, setModals] = useState({
        licencia: false,
        libreta: false,
        telefonos: false,
        educacion: false,
        cuentas: false,
        historial: false,
        familia: false,
        otrosDocs: false,
        mapa: false, // Nuevo modal para el mapa
        addEducacion: false, //esta
        addOtrosDocs: false, //esta
        addFamilia: false, //esta
        addHistorial: false, //esta
        addCuenta: false //esta
    });

    // --- MANEJADORES GENÉRICOS ---

    // Para Teléfonos
    const handleSetPrincipalPhone = (id) => {
        const updated = phones.map(item => ({
            ...item,
            principal: item.id === id // Solo el clickeado se vuelve true, el resto false
        }));
        setPhones(updated);
    };

    // Para Cuentas Bancarias
    const handleSetPrincipalAccount = (id) => {
        const updated = accounts.map(item => ({
            ...item,
            principal: item.id === id
        }));
        setAccounts(updated);
    };



    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleModal = (modalName, show = true) => {
        setModals(prev => ({ ...prev, [modalName]: show }));
    };

    const handleAddConfig = (field) => {
        toast.current.show({ severity: 'info', summary: 'Configuración', detail: `Abrir modal para agregar nuevo ${field}` });
    };


    // --- LÓGICA CRUD TELÉFONOS (PEGA ESTO ANTES DEL RETURN) ---

    // 1. Abrir modal vacío (Nuevo)
    const openNewPhone = () => {
        setPhoneData(emptyPhone);
        setSubmitted(false);
        setPhoneDialog(true);
    };

    // 2. Abrir modal lleno (Editar)
    const openEditPhone = (rowData) => {
        setPhoneData({ ...rowData });
        setPhoneDialog(true);
    };

    // 3. Guardar (Crear o Actualizar)
    const savePhone = () => {
        setSubmitted(true);

        // Validación simple
        if (phoneData.tipo && phoneData.telefono) {
            let _phones = [...phones];

            if (phoneData.id) {
                // Actualizar existente
                const index = _phones.findIndex(p => p.id === phoneData.id);
                _phones[index] = phoneData;
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Teléfono Actualizado', life: 3000 });
            } else {
                // Crear nuevo (ID simulado)
                phoneData.id = Math.floor(Math.random() * 10000);
                _phones.push(phoneData);
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Teléfono Creado', life: 3000 });
            }

            setPhones(_phones);
            setPhoneDialog(false);
            setPhoneData(emptyPhone);
        }
    };

    // 4. Eliminar
    const deletePhone = (rowData) => {
        let _phones = phones.filter(val => val.id !== rowData.id);
        setPhones(_phones);
        toast.current.show({ severity: 'warn', summary: 'Eliminado', detail: 'Teléfono eliminado', life: 3000 });
    };

    // 5. Input Handler para el formulario pequeño
    const onPhoneInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        setPhoneData(prev => ({ ...prev, [name]: val }));
    };


    // --- COMPONENTE INTERNO: MAPA SIMULADO ---
    const MockMap = () => {
        const setLocation = () => {
            const randomLat = -0.180 + (Math.random() * 0.01);
            const randomLng = -78.467 + (Math.random() * 0.01);
            const coords = `${randomLat.toFixed(6)}, ${randomLng.toFixed(6)}`;
            handleChange('ubicacionGPS', coords);
            toggleModal('mapa', false);
        };

        return (
            <div className="flex flex-column gap-2">
                <div
                    className="w-full border-2 surface-border border-round flex align-items-center justify-content-center cursor-pointer hover:surface-100 transition-colors"
                    style={{ height: '300px', background: '#e9e9e9', position: 'relative' }}
                    onClick={setLocation}
                >
                    <span className="text-600 font-bold">
                        <i className="pi pi-map-marker text-primary text-4xl mr-2"></i>
                        Click aquí para simular ubicación GPS
                    </span>
                    <div className="absolute bottom-0 right-0 p-2 bg-white-alpha-80 text-xs">Google Maps Mock</div>
                </div>
                <small className="text-500">Haz click en el área gris para capturar coordenadas.</small>
            </div>
        );
    };


    const principalPhoneTemplate = (rowData) => {
        return (
            <div className="flex justify-content-center">
                <Button
                    icon={rowData.principal ? "pi pi-check-circle" : "pi pi-circle"}
                    className={`p-button-rounded p-button-text ${rowData.principal ? 'p-button-success font-bold' : 'p-button-secondary'}`}
                    onClick={() => handleSetPrincipalPhone(rowData.id)}
                    tooltip={rowData.principal ? "Principal activo" : "Marcar como principal"}
                />
            </div>
        );
    };

    // Template visual para el botón de "Principal" en Cuentas
    const principalAccountTemplate = (rowData) => {
        return (
            <div className="flex justify-content-center">
                <Button
                    icon={rowData.principal ? "pi pi-check-circle" : "pi pi-circle"}
                    className={`p-button-rounded p-button-text ${rowData.principal ? 'p-button-success font-bold' : 'p-button-secondary'}`}
                    onClick={() => handleSetPrincipalAccount(rowData.id)}
                    tooltip={rowData.principal ? "Cuenta principal" : "Marcar como principal"}
                />
            </div>
        );
    };
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2 justify-content-center">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-warning" tooltip="Editar" />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger" tooltip="Eliminar" />
            </div>
        );
    };

    // --- HEADER DEL CARD ---
    const header = (
        <div className="flex justify-content-between align-items-center p-3 border-bottom-1 surface-border bg-blue-50">
            <span className="text-xl font-bold text-700">Empleados (Edición)</span>
            <div className="flex gap-2">
                <Button icon="pi pi-save" label="Guardar Datos" className="p-button-primary" />
            </div>
        </div>
    );

    return (
        <div className="flex justify-content-center p-4">
            <Toast ref={toast} />

            <Card header={header} className="w-full shadow-4" style={{ maxWidth: '1200px' }}>
                <div className="p-fluid formgrid grid">

                    {/* --- FILA 1: IDENTIFICACIÓN --- */}
                    <div className="field col-12 md:col-4">
                        <label>Tipo identificador</label>
                        <div className="p-inputgroup">
                            <Dropdown value={formData.tipoDoc} options={MOCK_DB_CONFIG.docTypes} onChange={(e) => handleChange('tipoDoc', e.value)} placeholder="Seleccione" />
                        </div>
                    </div>
                    <div className="field col-12 md:col-4">
                        <label>Nro Identificador</label>
                        <InputText value={formData.nroIdentificador} onChange={(e) => handleChange('nroIdentificador', e.target.value)} />
                    </div>
                    <div className="field col-12 md:col-4"></div>

                    {/* --- FILA 2: NOMBRES --- */}
                    <div className="field col-12 md:col-6">
                        <label>Nombre</label>
                        <InputText value={formData.nombre} onChange={(e) => handleChange('nombre', e.target.value)} />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label>Apellidos</label>
                        <InputText value={formData.apellidos} onChange={(e) => handleChange('apellidos', e.target.value)} />
                    </div>

                    {/* --- FILA 3: DATOS DEMOGRÁFICOS --- */}
                    <div className="field col-12 md:col-4">
                        <label>Nacionalidad (Config)</label>
                        <div className="p-inputgroup">
                            <Dropdown value={formData.nacionalidad} options={MOCK_DB_CONFIG.nationalities} onChange={(e) => handleChange('nacionalidad', e.value)} />
                        </div>
                    </div>
                    <div className="field col-12 md:col-4">
                        <label>Estatura</label>
                        <InputNumber value={formData.estatura} onValueChange={(e) => handleChange('estatura', e.value)} suffix=" metros" minFractionDigits={2} />
                    </div>

                    {/* --- FILA 4: FECHAS --- */}
                    <div className="field col-12 md:col-2">
                        <label>Fecha Ingreso</label>
                        <Calendar value={formData.fechaIngreso} onChange={(e) => handleChange('fechaIngreso', e.value)} showIcon dateFormat="dd/mm/yy" />
                    </div>
                    <div className="field col-12 md:col-2">
                        <label>Fecha Fin</label>
                        <Calendar value={formData.fechaFin} onChange={(e) => handleChange('fechaFin', e.value)} showIcon dateFormat="dd/mm/yy" />
                    </div>

                    {/* --- FILA 5: LUGAR Y EMAIL --- */}
                    <div className="field col-12 md:col-4">
                        <label>Lugar Nacimiento (Config)</label>
                        <div className="p-inputgroup">
                            <Dropdown value={formData.lugarNacimiento} options={MOCK_DB_CONFIG.cities} onChange={(e) => handleChange('lugarNacimiento', e.value)} />
                        </div>
                    </div>
                    <div className="field col-12 md:col-4">
                        <label>Correo Electronico</label>
                        <InputText value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
                    </div>

                    {/* --- FILA 6: BOTONES DE ADICIÓN (LICENCIA/LIBRETA) --- */}
                    <div className="field col-12 md:col-6 flex align-items-end gap-2">
                        <div className="flex-1">
                            <label>Licencia</label>
                            <InputText value="Datos cargados..." readOnly className="surface-200" />
                        </div>
                        <Button label="Adición Licencia" icon="pi pi-id-card" onClick={() => toggleModal('licencia')} />
                    </div>
                    <div className="field col-12 md:col-6 flex align-items-end gap-2">
                        <div className="flex-1">
                            <label>Libreta Militar</label>
                            <InputText value="Sin datos" readOnly className="surface-200" />
                        </div>
                        <Button label="Adición Libreta" icon="pi pi-book" onClick={() => toggleModal('libreta')} />
                    </div>

                    {/* --- FILA 7: OTROS DATOS (SelectButton, GPS) --- */}
                    <div className="field col-12 md:col-3">
                        <label className="block mb-2">Pensión alimentaria</label>
                        {/* REEMPLAZO: SelectButton en lugar de texto */}
                        <SelectButton value={formData.pension} options={PENSION_OPTIONS} onChange={(e) => handleChange('pension', e.value)} />
                    </div>

                    <div className="field col-12 md:col-3">
                        <label>Tipo de sangre (Config)</label>
                        <div className="p-inputgroup">
                            <Dropdown value={formData.tipoSangre} options={MOCK_DB_CONFIG.bloodTypes} onChange={(e) => handleChange('tipoSangre', e.value)} />
                        </div>
                    </div>

                    <div className="field col-12 md:col-3">
                        <label>Estado Civil (Config)</label>
                        <div className="p-inputgroup">
                            <Dropdown value={formData.estadoCivil} options={MOCK_DB_CONFIG.civilStatus} onChange={(e) => handleChange('estadoCivil', e.value)} />
                        </div>
                    </div>

                    {/* --- GPS & TELÉFONOS --- */}
                    <div className="field col-12 md:col-6">
                        <label>Ubicación GPS (Google Maps)</label>
                        <div className="p-inputgroup">
                            <InputText value={formData.ubicacionGPS} placeholder="Seleccione en mapa" readOnly />
                            <Button icon="pi pi-map-marker" className="p-button-danger" onClick={() => toggleModal('mapa')} />
                        </div>
                    </div>
                    <div className="field col-12 md:col-6 flex align-items-end">
                        <Button label="Ver Teléfonos" icon="pi pi-phone" className="p-button-info w-full" onClick={() => toggleModal('telefonos')} />
                    </div>

                    {/* --- FILA 8: FOTO Y BOTONES INFERIORES --- */}
                    <div className="col-12 mt-4 border-top-1 surface-border pt-4">
                        <div className="grid">
                            {/* FOTOGRAFÍA (FileUpload Múltiple) */}
                            <div className="col-12 md:col-4">
                                <label className="block mb-2 font-bold">Fotografía(s) Empleado</label>
                                <FileUpload
                                    name="demo[]"
                                    mode="advanced"
                                    chooseLabel="Agregar"
                                    uploadLabel="Subir"
                                    cancelLabel="Cancelar"
                                    multiple
                                    accept="image/*"
                                    maxFileSize={1000000}
                                    emptyTemplate={<p className="m-0">Arrastre imágenes aquí.</p>}
                                />
                            </div>

                            {/* GRILLA DE BOTONES AZULES */}
                            <div className="col-12 md:col-8">
                                <div className="grid">
                                    <div className="col-6 md:col-4 mb-2">
                                        <Button label="Ver Educación" icon="pi pi-briefcase" className="p-button-info w-full" onClick={() => toggleModal('educacion')} />
                                    </div>
                                    <div className="col-6 md:col-4 mb-2">
                                        <Button label="Ver Cuentas" icon="pi pi-wallet" className="p-button-info w-full" onClick={() => toggleModal('cuentas')} />
                                    </div>
                                    <div className="col-6 md:col-4 mb-2">
                                        <Button label="Ver Historial" icon="pi pi-history" className="p-button-info w-full" onClick={() => toggleModal('historial')} />
                                    </div>
                                    <div className="col-6 md:col-4 mb-2">
                                        <Button label="Ver Familia" icon="pi pi-users" className="p-button-info w-full" onClick={() => toggleModal('familia')} />
                                    </div>
                                    <div className="col-6 md:col-4 mb-2">
                                        <Button label="Ver Otros Docs" icon="pi pi-file" className="p-button-info w-full" onClick={() => toggleModal('otrosDocs')} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* ================= MODALES (DIALOGS) ================= */}

            {/* 1. MAPA GOOGLE SIMULADO */}
            <Dialog header="Seleccionar Ubicación" visible={modals.mapa} style={{ width: '50vw' }} onHide={() => toggleModal('mapa', false)}>
                <MockMap />
            </Dialog>

            {/* 2. LICENCIA (Formulario según imagen 57034d) */}
            <Dialog header="Documentos - Licencia" visible={modals.licencia} style={{ width: '500px' }} onHide={() => toggleModal('licencia', false)}>
                <div className="p-fluid formgrid grid">
                    <div className="field col-12">
                        <label>Tipo: LICENCIA</label>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label>Categoría</label>
                        <Dropdown options={[{ label: 'Tipo A', value: 'A' }, { label: 'Tipo B', value: 'B' }]} placeholder="Seleccione" />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label>Número</label>
                        <InputText />
                    </div>
                    <div className="field col-6">
                        <label>Fecha Ingreso</label>
                        <Calendar showIcon />
                    </div>
                    <div className="field col-6">
                        <label>Fecha Fin</label>
                        <Calendar showIcon />
                    </div>
                    <div className="field col-12">
                        <Button label="Adjuntar Licencia" icon="pi pi-paperclip" className="p-button-info mb-3" />
                        <Button label="Guardar" className="w-full" />
                    </div>
                </div>
            </Dialog>

            {/* 3. LIBRETA MILITAR (Similar a licencia) */}
            <Dialog header="Documentos - Libreta" visible={modals.libreta} style={{ width: '500px' }} onHide={() => toggleModal('libreta', false)}>
                <div className="p-fluid formgrid grid">
                    <div className="field col-12">
                        <label>Tipo: LIBRETA</label>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label>Categoría</label>
                        <Dropdown options={[{ label: 'Militar', value: 'M' }]} placeholder="Seleccione" />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label>Número</label>
                        <InputText />
                    </div>
                    <div className="field col-6">
                        <label>Fecha Ingreso</label>
                        <Calendar showIcon />
                    </div>
                    <div className="field col-6">
                        <label>Fecha Fin</label>
                        <Calendar showIcon />
                    </div>
                    <div className="field col-12 mt-4">
                        <Button label="Adjuntar Licencia" icon="pi pi-paperclip" className="p-button-info mb-3" />

                        <Button label="Guardar" className="w-full" />
                    </div>
                </div>
            </Dialog>

            {/* 4. TELÉFONOS (Tabla CRUD) */}
            {/* 4. TELÉFONOS (LISTA PRINCIPAL) */}
            <Dialog header="Teléfonos" visible={modals.telefonos} style={{ width: '700px' }} onHide={() => toggleModal('telefonos', false)}>

                {/* Botón ADICIONAR llama a openNewPhone */}
                <div className="flex justify-content-end mb-3">
                    <Button label="Adicionar" icon="pi pi-plus" className="p-button-primary p-button-sm" onClick={openNewPhone} />
                </div>

                <DataTable value={phones} size="small" responsiveLayout="scroll" showGridlines>
                    <Column field="tipo" header="Tipo"></Column>
                    <Column field="telefono" header="Telefono"></Column>

                    <Column header="Principal" body={principalPhoneTemplate} style={{ width: '100px', textAlign: 'center' }}></Column>

                    {/* Columna Acciones Personalizada para Teléfonos */}
                    <Column header="Acciones" body={(rowData) => (
                        <div className="flex gap-2 justify-content-center">
                            {/* Botón EDITAR: Llama a openEditPhone con los datos de la fila */}
                            <Button icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-warning"
                                onClick={() => openEditPhone(rowData)} tooltip="Editar" />

                            {/* Botón ELIMINAR: Llama a deletePhone */}
                            <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger"
                                onClick={() => deletePhone(rowData)} tooltip="Eliminar" />
                        </div>
                    )} style={{ minWidth: '8rem', textAlign: 'center' }}></Column>
                </DataTable>
            </Dialog>

            {/* 5. EDUCACIÓN (Tabla CRUD Compleja - Imagen 5703e5) */}
            <Dialog header="Educación" visible={modals.educacion} style={{ width: '900px' }} onHide={() => toggleModal('educacion', false)}>
                <div className="flex justify-content-end mb-3">
                    <Button label="Nuevo" onClick={() => toggleModal('addEducacion', true)} icon="pi pi-plus" className="p-button-primary" />
                </div>
                <DataTable value={MOCK_EDUCATION} size="small" showGridlines responsiveLayout="scroll">
                    <Column field="categoria" header="Categoría"></Column>
                    <Column field="institucion" header="Institución"></Column>
                    <Column field="descripcion" header="Descripción"></Column>
                    <Column field="inicio" header="Fecha Inicio"></Column>
                    <Column field="fin" header="Fecha Fin"></Column>
                    {/* Columna de Acciones */}
                    <Column header="Acciones" body={actionBodyTemplate} style={{ minWidth: '8rem', textAlign: 'center' }}></Column>
                </DataTable>
            </Dialog>

            {/* NOTA: Repetir patrón de Dialog para Cuentas, Historial, Familia, Otros Docs según necesidad */}
            {/* 6. CUENTAS BANCARIAS (CORREGIDO) */}
            <Dialog header="Cuentas Bancarias" visible={modals.cuentas} style={{ width: '800px' }} onHide={() => toggleModal('cuentas', false)}>
                <div className="flex justify-content-end mb-3">
                    <Button label="Adicionar" icon="pi pi-plus" onClick={() => toggleModal('addCuenta', true)} className="p-button-primary p-button-sm" />
                </div>

                |                <DataTable value={accounts} size="small" showGridlines responsiveLayout="scroll">
                    <Column field="numero" header="Numero de Cuenta"></Column>
                    <Column field="banco" header="Banco"></Column>
                    <Column field="tipo" header="Tipo Cuenta"></Column>

                    {/* Columna Principal Interactiva */}
                    <Column
                        header="Principal"
                        body={principalAccountTemplate}
                        style={{ width: '100px', textAlign: 'center' }}
                    ></Column>

                    <Column header="Acciones" body={actionBodyTemplate} style={{ minWidth: '8rem', textAlign: 'center' }}></Column>
                </DataTable>
            </Dialog>
            {/* 7. HISTORIAL (Imagen 570389) */}
            <Dialog header="Historial" visible={modals.historial} style={{ width: '700px' }} onHide={() => toggleModal('historial', false)}>
                <div className="flex justify-content-end mb-3">
                    <Button label="Nuevo" icon="pi pi-plus" onClick={() => toggleModal('addHistorial')} className="p-button-primary" />
                </div>
                <DataTable value={[{ tipo: 'Poligrafía', numero: '36656', fecha: '01/05/2022' }]} size="small" showGridlines responsiveLayout="scroll">
                    <Column field="tipo" header="Tipo"></Column>
                    <Column field="numero" header="Numero"></Column>
                    <Column field="fecha" header="Fecha"></Column>
                    {/* Columna de Acciones */}
                    <Column header="Acciones" body={actionBodyTemplate} style={{ minWidth: '8rem', textAlign: 'center' }}></Column>
                </DataTable>
            </Dialog>

            {/* 8. INFORMACIÓN FAMILIAR (Imagen 5703a6) */}
            <Dialog header="Información Familiar" visible={modals.familia} style={{ width: '900px' }} onHide={() => toggleModal('familia', false)}>
                <div className="flex justify-content-end mb-3">
                    <Button label="Nuevo" icon="pi pi-plus" onClick={() => toggleModal('addFamilia', true)} className="p-button-primary" />
                </div>
                <DataTable value={[{ tipo: 'Familia Actual', id: '6569', nombre: 'Vero Perez', parentesco: 'Esposa', fecha: '11/05/2011' }]} size="small" showGridlines responsiveLayout="scroll">
                    <Column field="tipo" header="Tipo"></Column>
                    <Column field="id" header="Identificador"></Column>
                    <Column field="nombre" header="Nombre"></Column>
                    <Column field="parentesco" header="Parentesco"></Column>
                    <Column field="fecha" header="Fecha"></Column>
                    {/* Columna de Acciones */}
                    <Column header="Acciones" body={actionBodyTemplate} style={{ minWidth: '8rem', textAlign: 'center' }}></Column>
                </DataTable>
            </Dialog>

            {/* 9. OTROS DOCUMENTOS (Imagen 5703c7) */}
            <Dialog header="Otros Documentos" visible={modals.otrosDocs} style={{ width: '800px' }} onHide={() => toggleModal('otrosDocs', false)}>
                <div className="flex justify-content-end mb-3">
                    <Button label="Nuevo" icon="pi pi-plus" onClick={() => toggleModal('addOtrosDocs', true)} className="p-button-primary" />
                </div>
                <DataTable value={[{ tipo: 'Contrato', numero: '5645432', inicio: '11/05/2020', fin: '11/06/2021' }]} size="small" showGridlines responsiveLayout="scroll">
                    <Column field="tipo" header="Tipo"></Column>
                    <Column field="numero" header="Numero"></Column>
                    <Column field="inicio" header="Fecha Inicio"></Column>
                    <Column field="fin" header="Fecha Fin"></Column>
                    {/* Columna de Acciones */}
                    <Column header="Acciones" body={actionBodyTemplate} style={{ minWidth: '8rem', textAlign: 'center' }}></Column>
                </DataTable>
            </Dialog>



            {/* ================================================================= */}
            {/*  SUB-MODALES (FORMULARIOS)                */}
            {/* ================================================================= */}


            <Dialog header="Adición de educación" visible={modals.addEducacion} style={{ width: '600px' }} onHide={() => toggleModal('addEducacion', false)}>
                <div className="p-fluid formgrid grid">
                    <div className="field col-12">
                        <label className="font-bold">Tipo: Educación</label>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label>Categoría</label>
                        <Dropdown options={MOCK_CATEGORIAS_EDU} placeholder="Seleccione" />
                    </div>
                    <div className="field col-12 md:col-6">
                        {/* Espacio vacío para alinear si es necesario, o campo oculto */}
                    </div>

                    <div className="field col-12 md:col-6">
                        <label>Institución</label>
                        <InputText placeholder="Ej: Colegio X" />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label>Descripción</label>
                        <InputText placeholder="Ej: Curso Logica" />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label>Fecha Ingreso</label>
                        <Calendar showIcon dateFormat="dd/mm/yy" />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label>Fecha Fin</label>
                        <Calendar showIcon dateFormat="dd/mm/yy" />
                    </div>

                    {/* Botones inferiores (Adjuntar a la izq, Guardar a la der) */}
                    <div className="col-12 flex justify-content-between mt-3">
                        <FileUpload mode="basic" chooseLabel="Adjuntar documento" className="p-button-info" auto customUpload uploadHandler={() => { }} />
                        <Button label="Guardar" className="p-button-primary w-auto" onClick={() => toggleModal('addEducacion', false)} />
                    </div>
                </div>
            </Dialog>


            {/* 2. ADICIÓN DE OTROS DOCUMENTOS (Imagen 4c7fe0) */}
            <Dialog header="Adición de otros documentos" visible={modals.addOtrosDocs} style={{ width: '600px' }} onHide={() => toggleModal('addOtrosDocs', false)}>
                <div className="p-fluid formgrid grid">
                    <div className="field col-12 text-center md:text-left">
                        <span className="font-bold mr-2">Tipo:</span> OTROS DOCUMENTOS
                    </div>

                    <div className="field col-12 md:col-6">
                        <label>Categoría</label>
                        <Dropdown options={MOCK_CATEGORIAS_DOCS} placeholder="Contrato" />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label>Numero</label>
                        <InputText />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label>Fecha Ingreso</label>
                        <Calendar showIcon dateFormat="dd/mm/yy" />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label>Fecha Fin</label>
                        <Calendar showIcon dateFormat="dd/mm/yy" />
                    </div>

                    <div className="col-12 flex justify-content-between mt-3">
                        <FileUpload mode="basic" chooseLabel="Adjuntar Foto" className="p-button-info" auto />
                        <Button label="Guardar" className="p-button-primary w-auto" onClick={() => toggleModal('addOtrosDocs', false)} />
                    </div>
                </div>
            </Dialog>


            {/* 3. NUEVO FAMILIAR (Imagen 4c7f9d) */}
            <Dialog header="Nuevo familiar" visible={modals.addFamilia} style={{ width: '650px' }} onHide={() => toggleModal('addFamilia', false)}>
                <div className="p-fluid formgrid grid align-items-end">

                    <div className="field col-12 md:col-6">
                        <label>Tipo</label>
                        <Dropdown options={[{ label: 'Familia Actual', value: 'ACTUAL' }]} placeholder="Familia Actual" />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label>Identificador</label>
                        <InputText />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label>Parentesco</label>
                        <Dropdown options={MOCK_PARENTESCO} placeholder="Esposa" />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label>Nombre</label>
                        <InputText placeholder="Nombre Familiar" />
                    </div>

                    <div className="field col-12 md:col-6 md:col-offset-6">
                        <label>Fecha</label>
                        <Calendar showIcon dateFormat="dd/mm/yy" />
                    </div>

                    <div className="col-12 flex justify-content-between mt-3">
                        <FileUpload mode="basic" chooseLabel="Adjuntar documento" className="p-button-info" auto />
                        <Button label="Guardar" className="p-button-primary w-auto" onClick={() => toggleModal('addFamilia', false)} />
                    </div>
                </div>
            </Dialog>


            {/* 4. AGREGAR HISTORIAL (Imagen 4c7c37) */}
            <Dialog header="Historial" visible={modals.addHistorial} style={{ width: '600px' }} onHide={() => toggleModal('addHistorial', false)}>
                <div className="p-fluid formgrid grid align-items-center">

                    <div className="field col-12 md:col-6">
                        <label>Tipo</label>
                        <Dropdown options={MOCK_TIPO_HISTORIAL} placeholder="Poligrafias" />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label>Numero</label>
                        <InputText />
                    </div>

                    <div className="field col-12 flex align-items-center gap-2">
                        <label className="mb-0">categoria:</label>
                        <span className="font-bold">Solicitada</span>
                    </div>

                    <div className="field col-12 md:col-6 mt-3">
                        <label>Fecha</label>
                        <Calendar showIcon dateFormat="dd/mm/yy" />
                    </div>

                    <div className="col-12 flex justify-content-between mt-4">
                        <FileUpload mode="basic" chooseLabel="Adjuntar documento" className="p-button-info" auto />
                        <Button label="Guardar" className="p-button-primary w-auto" onClick={() => toggleModal('addHistorial', false)} />
                    </div>
                </div>
            </Dialog>


            {/* 5. ADICIÓN DE CUENTA BANCARIA (Imagen 4c7bdd) */}
            <Dialog header="Adición de Cuenta" visible={modals.addCuenta} style={{ width: '600px' }} onHide={() => toggleModal('addCuenta', false)}>
                <div className="p-fluid formgrid grid align-items-end">

                    {/* Fila superior: Input largo + Botón Crear */}
                    <div className="field col-12 md:col-8">
                        <label>Numero de Cuenta:</label>
                        <InputText placeholder="66-89826-33" />
                    </div>

                    {/* Fila inferior: Bancos y Tipos */}
                    <div className="field col-12 md:col-6">
                        <label>Banco:</label>
                        <Dropdown options={MOCK_BANCOS} placeholder="Banco Uno" />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label>Tipo Cuenta:</label>
                        <Dropdown options={MOCK_TIPO_CUENTA} placeholder="Cuenta Corriente" />
                    </div>
                    <div className="field col-12 md:col-4">
                        <Button label="Crear" className="p-button-primary w-full" onClick={() => toggleModal('addCuenta', false)} />
                    </div>
                </div>
            </Dialog>

            {/* ================================================================= */}
            {/* SUB-MODAL: CREAR / EDITAR TELÉFONO                                */}
            {/* ================================================================= */}
            <Dialog
                visible={phoneDialog}
                style={{ width: '450px' }}
                header={phoneData.id ? "Editar Teléfono" : "Nuevo Teléfono"}
                modal
                className="p-fluid"
                onHide={() => setPhoneDialog(false)}
            >
                <div className="field">
                    <label htmlFor="tipoPhone">Tipo</label>
                    <Dropdown
                        id="tipoPhone"
                        value={phoneData.tipo}
                        options={MOCK_PHONE_TYPES}
                        onChange={(e) => onPhoneInputChange(e, 'tipo')}
                        placeholder="Seleccione Tipo"
                        className={submitted && !phoneData.tipo ? 'p-invalid' : ''}
                    />
                    {submitted && !phoneData.tipo && <small className="p-error">El tipo es requerido.</small>}
                </div>

                <div className="field">
                    <label htmlFor="numPhone">Número</label>
                    <InputText
                        id="numPhone"
                        value={phoneData.telefono}
                        onChange={(e) => onPhoneInputChange(e, 'telefono')}
                        placeholder="Ej: 099123456"
                        className={submitted && !phoneData.telefono ? 'p-invalid' : ''}
                    />
                    {submitted && !phoneData.telefono && <small className="p-error">El número es requerido.</small>}
                </div>

                <div className="flex justify-content-end gap-2 mt-4">
                    <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={() => setPhoneDialog(false)} />
                    <Button label="Guardar" icon="pi pi-check" onClick={savePhone} />
                </div>
            </Dialog>

        </div>
    );
}