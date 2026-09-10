/* ---------- Datos base ---------- */

const FLOORS = [5, 4, 3, 2, 1];
const UNITS_PER_FLOOR = 4;

function unitCode(floor, n) {
  return `${floor}0${n}`;
}

const ALL_UNITS = FLOORS.flatMap((f) =>
  Array.from({ length: UNITS_PER_FLOOR }, (_, i) => unitCode(f, i + 1))
).sort();

let idCounter = 1000;
const nextId = () => idCounter++;

const STATUS_LABEL = { activo: "Activo", inactivo: "Inactivo", dentro: "Dentro", salio: "Salió" };

let state = {
  tab: "edificio",
  selectedUnit: null,
  searchRes: "",
  searchVis: "",
  residents: [],
  visitors: [],
};

function seed() {
  state.residents = [
    { id: nextId(), name: "Marcela Villarreal Gómez", unit: "101", phone: "81 2234 5510", plate: "LKM-231-A", status: "activo" },
    { id: nextId(), name: "Héctor Adrián Salinas", unit: "102", phone: "81 1145 9902", plate: "", status: "activo" },
    { id: nextId(), name: "Paola Rivas Cantú", unit: "201", phone: "81 3390 1187", plate: "NVX-045-B", status: "activo" },
    { id: nextId(), name: "Rodrigo Elizondo Paz", unit: "203", phone: "81 2298 4471", plate: "RTY-812-C", status: "activo" },
    { id: nextId(), name: "Ingrid Lozano Chávez", unit: "301", phone: "81 4456 2230", plate: "", status: "activo" },
    { id: nextId(), name: "Samuel Garza Treviño", unit: "302", phone: "81 5567 8834", plate: "GSL-990-D", status: "inactivo" },
    { id: nextId(), name: "Daniela Cortés Ibarra", unit: "401", phone: "81 6678 0021", plate: "", status: "activo" },
    { id: nextId(), name: "Bruno Escamilla Reyes", unit: "404", phone: "81 7789 3345", plate: "MXP-118-E", status: "activo" },
    { id: nextId(), name: "Fernanda Ríos Domínguez", unit: "501", phone: "81 8890 6612", plate: "", status: "activo" },
    { id: nextId(), name: "Tomás Aguirre Molina", unit: "502", phone: "81 9901 2278", plate: "ZPQ-334-F", status: "activo" },
  ];
  state.visitors = [
    { id: nextId(), name: "Karla Núñez Ortiz", unit: "101", hostId: state.residents[0].id, doc: "INE 0451", reason: "Visita familiar", entryTime: "09:14", exitTime: null, status: "dentro" },
    { id: nextId(), name: "Repartidor · Rappi", unit: "301", hostId: state.residents[4].id, doc: "", reason: "Entrega de paquete", entryTime: "10:02", exitTime: "10:11", status: "salio" },
    { id: nextId(), name: "Iván Cepeda Luna", unit: "404", hostId: state.residents[7].id, doc: "INE 8823", reason: "Visita técnica de gas", entryTime: "08:40", exitTime: null, status: "dentro" },
    { id: nextId(), name: "Grupo mudanza Norte", unit: "501", hostId: state.residents[8].id, doc: "", reason: "Mudanza", entryTime: "07:55", exitTime: "09:30", status: "salio" },
  ];
}

/* ---------- Iconos (SVG en línea) ---------- */

function icon(name, size = 15) {
  const paths = {
    building: '<rect x="4" y="3" width="16" height="18" rx="1"></rect><line x1="8" y1="7" x2="8" y2="7"></line><line x1="12" y1="7" x2="12" y2="7"></line><line x1="16" y1="7" x2="16" y2="7"></line><line x1="8" y1="11" x2="8" y2="11"></line><line x1="12" y1="11" x2="12" y2="11"></line><line x1="16" y1="11" x2="16" y2="11"></line><line x1="8" y1="15" x2="8" y2="15"></line><line x1="16" y1="15" x2="16" y2="15"></line><path d="M10 21v-4h4v4"></path>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
    userPlus: '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="16" y1="11" x2="22" y2="11"></line>',
    plus: '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>',
    pencil: '<path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>',
    trash: '<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>',
    x: '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"></path>',
    car: '<rect x="3" y="11" width="18" height="6" rx="2"></rect><path d="M5 11l1.5-4h11L19 11"></path><circle cx="7.5" cy="17.5" r="1.5"></circle><circle cx="16.5" cy="17.5" r="1.5"></circle>',
    search: '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>',
    logOut: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>',
    clock: '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>',
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths[name] || ""}</svg>`;
}

/* ---------- Helpers de datos ---------- */

function hostName(hostId) {
  const r = state.residents.find((x) => x.id === Number(hostId));
  return r ? r.name : "—";
}

function activeResidentsCount() {
  return state.residents.filter((r) => r.status === "activo").length;
}
function visitorsInsideCount() {
  return state.visitors.filter((v) => v.status === "dentro").length;
}
function vacantUnitsCount() {
  const occupied = new Set(state.residents.map((r) => r.unit));
  return ALL_UNITS.length - occupied.size;
}

/* ---------- Render: header y tabs ---------- */

function renderStats() {
  document.getElementById("statsRow").innerHTML = `
    <div class="ac-stat teal">
      <span class="n ac-mono">${activeResidentsCount()}</span>
      <span class="l">Residentes activos</span>
    </div>
    <div class="ac-stat brass">
      <span class="n ac-mono">${visitorsInsideCount()}</span>
      <span class="l">Visitantes dentro</span>
    </div>
    <div class="ac-stat">
      <span class="n ac-mono">${vacantUnitsCount()}</span>
      <span class="l">Unidades vacantes</span>
    </div>
  `;
  document.getElementById("icon-building").innerHTML = icon("building", 19);
}

function renderTabs() {
  const tabs = [
    { id: "edificio", label: "Edificio", icon: "building" },
    { id: "residentes", label: "Residentes", icon: "users" },
    { id: "visitantes", label: "Visitantes", icon: "userPlus" },
  ];
  document.getElementById("tabsRow").innerHTML = tabs
    .map(
      (t) => `
      <button class="ac-tab ${state.tab === t.id ? "active" : ""}" data-action="switch-tab" data-tab="${t.id}">
        ${icon(t.icon, 15)} ${t.label}
      </button>`
    )
    .join("");
}

/* ---------- Render: vista Edificio ---------- */

function renderEdificio() {
  const floorsHtml = FLOORS.map((floor) => {
    const unitsHtml = Array.from({ length: UNITS_PER_FLOOR }, (_, i) => unitCode(floor, i + 1))
      .map((code) => {
        const occ = state.residents.some((r) => r.unit === code);
        const visitorHere = state.visitors.some((v) => v.unit === code && v.status === "dentro");
        return `
          <div class="ac-unit ${occ ? "occupied" : ""} ${state.selectedUnit === code ? "selected" : ""}"
               data-action="select-unit" data-unit="${code}">
            ${visitorHere ? '<span class="ac-dot" title="Visitante dentro"></span>' : ""}
            <div class="code ac-mono">${code}</div>
            <div class="sub">${occ ? "Ocupado" : "Vacante"}</div>
          </div>`;
      })
      .join("");
    return `
      <div class="ac-floor">
        <span class="ac-floor-label ac-mono">P${floor}</span>
        <div class="ac-units">${unitsHtml}</div>
      </div>`;
  }).join("");

  let panelHtml = `<div class="ac-empty">Selecciona un departamento para ver sus residentes y visitantes.</div>`;

  if (state.selectedUnit) {
    const unitResidents = state.residents.filter((r) => r.unit === state.selectedUnit);
    const unitVisitors = state.visitors.filter((v) => v.unit === state.selectedUnit && v.status === "dentro");

    panelHtml = `
      <h3 class="ac-heading">Depto ${state.selectedUnit}</h3>
      <p class="muted">${unitResidents.length} residente${unitResidents.length !== 1 ? "s" : ""} · ${unitVisitors.length} visitante${unitVisitors.length !== 1 ? "s" : ""} dentro</p>
      ${
        unitResidents.length === 0
          ? `<div class="ac-empty" style="margin-bottom:14px;">Sin residentes registrados en esta unidad.</div>`
          : unitResidents
              .map(
                (r) => `
              <div class="ac-person-row">
                <div>
                  <div class="ac-person-name">${r.name}</div>
                  <div class="ac-person-meta">
                    <span>${icon("phone", 11)} ${r.phone}</span>
                    ${r.plate ? `<span>${icon("car", 11)} ${r.plate}</span>` : ""}
                  </div>
                </div>
                <span class="ac-badge ${r.status === "activo" ? "teal" : "gray"}">${STATUS_LABEL[r.status]}</span>
              </div>`
              )
              .join("")
      }
      <button class="ac-btn primary" style="width:100%;justify-content:center;margin-top:12px;" data-action="add-resident" data-unit="${state.selectedUnit}">
        ${icon("plus", 15)} Agregar residente a esta unidad
      </button>
      ${
        unitVisitors.length > 0
          ? `<div style="border-top:1px solid var(--border-soft);margin:16px 0 8px;"></div>` +
            unitVisitors
              .map(
                (v) => `
              <div class="ac-person-row">
                <div>
                  <div class="ac-person-name">${v.name}</div>
                  <div class="ac-person-meta">${icon("clock", 11)} Entró ${v.entryTime}</div>
                </div>
                <span class="ac-badge brass">Dentro</span>
              </div>`
              )
              .join("")
          : ""
      }
    `;
  }

  document.getElementById("bodyRoot").innerHTML = `
    <div class="ac-building">
      <div>${floorsHtml}</div>
      <div class="ac-panel">${panelHtml}</div>
    </div>
  `;
}

/* ---------- Render: vista Residentes ---------- */

function renderResidentes() {
  document.getElementById("bodyRoot").innerHTML = `
    <div>
      <div class="ac-toolbar">
        <div class="ac-search">
          ${icon("search", 14)}
          <input id="searchResInput" placeholder="Buscar por nombre, unidad o teléfono" value="${state.searchRes}" />
        </div>
        <button class="ac-btn primary" data-action="add-resident">${icon("plus", 15)} Agregar residente</button>
      </div>
      <table class="ac-table">
        <thead>
          <tr><th>Unidad</th><th>Nombre</th><th>Teléfono</th><th>Placa</th><th>Estatus</th><th></th></tr>
        </thead>
        <tbody id="residentsTableBody"></tbody>
      </table>
    </div>
  `;
  document.getElementById("searchResInput").addEventListener("input", (e) => {
    state.searchRes = e.target.value;
    renderResidentsTableBody();
  });
  renderResidentsTableBody();
}

function renderResidentsTableBody() {
  const q = state.searchRes.toLowerCase();
  const filtered = state.residents
    .filter((r) => (r.name + r.unit + r.phone).toLowerCase().includes(q))
    .slice()
    .sort((a, b) => a.unit.localeCompare(b.unit));

  const body = document.getElementById("residentsTableBody");
  if (!filtered.length) {
    body.innerHTML = `<tr><td colspan="6"><div class="ac-empty">No hay residentes que coincidan con la búsqueda.</div></td></tr>`;
    return;
  }

  body.innerHTML = filtered
    .map(
      (r) => `
      <tr>
        <td class="ac-mono">${r.unit}</td>
        <td>${r.name}</td>
        <td class="ac-mono">${r.phone}</td>
        <td class="ac-mono">${r.plate || "—"}</td>
        <td><span class="ac-badge ${r.status === "activo" ? "teal" : "gray"}">${STATUS_LABEL[r.status]}</span></td>
        <td>
          <div class="ac-row-actions">
            <button class="ac-btn ghost" data-action="edit-resident" data-id="${r.id}" aria-label="Editar">${icon("pencil", 14)}</button>
            <button class="ac-btn danger-ghost" data-action="delete-resident" data-id="${r.id}" aria-label="Eliminar">${icon("trash", 14)}</button>
          </div>
        </td>
      </tr>`
    )
    .join("");
}

/* ---------- Render: vista Visitantes ---------- */

function renderVisitantes() {
  document.getElementById("bodyRoot").innerHTML = `
    <div>
      <div class="ac-toolbar">
        <div class="ac-search">
          ${icon("search", 14)}
          <input id="searchVisInput" placeholder="Buscar por nombre o unidad" value="${state.searchVis}" />
        </div>
        <button class="ac-btn primary" data-action="add-visitor">${icon("userPlus", 15)} Registrar visitante</button>
      </div>
      <table class="ac-table">
        <thead>
          <tr><th>Visitante</th><th>Unidad</th><th>Autoriza</th><th>Entrada</th><th>Salida</th><th>Estatus</th><th></th></tr>
        </thead>
        <tbody id="visitorsTableBody"></tbody>
      </table>
    </div>
  `;
  document.getElementById("searchVisInput").addEventListener("input", (e) => {
    state.searchVis = e.target.value;
    renderVisitorsTableBody();
  });
  renderVisitorsTableBody();
}

function renderVisitorsTableBody() {
  const q = state.searchVis.toLowerCase();
  const filtered = state.visitors.filter((v) => (v.name + v.unit).toLowerCase().includes(q));

  const body = document.getElementById("visitorsTableBody");
  if (!filtered.length) {
    body.innerHTML = `<tr><td colspan="7"><div class="ac-empty">No hay visitantes que coincidan con la búsqueda.</div></td></tr>`;
    return;
  }

  body.innerHTML = filtered
    .map(
      (v) => `
      <tr>
        <td>${v.name}</td>
        <td class="ac-mono">${v.unit}</td>
        <td>${hostName(v.hostId)}</td>
        <td class="ac-mono">${v.entryTime}</td>
        <td class="ac-mono">${v.exitTime || "—"}</td>
        <td><span class="ac-badge ${v.status === "dentro" ? "brass" : "gray"}">${STATUS_LABEL[v.status]}</span></td>
        <td>
          <div class="ac-row-actions">
            ${
              v.status === "dentro"
                ? `<button class="ac-btn ghost" data-action="checkout-visitor" data-id="${v.id}" title="Registrar salida" aria-label="Registrar salida">${icon("logOut", 14)}</button>`
                : ""
            }
            <button class="ac-btn ghost" data-action="edit-visitor" data-id="${v.id}" aria-label="Editar">${icon("pencil", 14)}</button>
            <button class="ac-btn danger-ghost" data-action="delete-visitor" data-id="${v.id}" aria-label="Eliminar">${icon("trash", 14)}</button>
          </div>
        </td>
      </tr>`
    )
    .join("");
}

/* ---------- Render principal ---------- */

function render() {
  renderStats();
  renderTabs();
  if (state.tab === "edificio") renderEdificio();
  if (state.tab === "residentes") renderResidentes();
  if (state.tab === "visitantes") renderVisitantes();
}

/* ---------- Drawers (agregar / editar) ---------- */

function openResidentDrawer({ mode, data, unit }) {
  const r = data || { name: "", unit: unit || ALL_UNITS[0], phone: "", plate: "", status: "activo" };
  const unitOptions = ALL_UNITS.map((u) => `<option value="${u}" ${u === r.unit ? "selected" : ""}>Depto ${u}</option>`).join("");

  document.getElementById("overlayRoot").innerHTML = `
    <div class="ac-overlay" data-action="close-modal">
      <div class="ac-drawer" data-stop="1">
        <div class="ac-drawer-header">
          <h3 class="ac-heading">${mode === "edit" ? "Editar residente" : "Agregar residente"}</h3>
          <button class="ac-btn ghost" data-action="close-modal" aria-label="Cerrar">${icon("x", 16)}</button>
        </div>
        <div class="ac-field">
          <label>Nombre completo</label>
          <input id="res-name" value="${r.name}" placeholder="Nombre y apellidos" />
          <div class="err" id="res-name-err" style="display:none;"></div>
        </div>
        <div class="ac-field">
          <label>Unidad</label>
          <select id="res-unit">${unitOptions}</select>
        </div>
        <div class="ac-field">
          <label>Teléfono</label>
          <input id="res-phone" value="${r.phone}" placeholder="81 0000 0000" />
          <div class="err" id="res-phone-err" style="display:none;"></div>
        </div>
        <div class="ac-field">
          <label>Placa de vehículo (opcional)</label>
          <input id="res-plate" value="${r.plate || ""}" placeholder="ABC-123-D" />
        </div>
        <div class="ac-field">
          <label>Estatus</label>
          <select id="res-status">
            <option value="activo" ${r.status === "activo" ? "selected" : ""}>Activo</option>
            <option value="inactivo" ${r.status === "inactivo" ? "selected" : ""}>Inactivo</option>
          </select>
        </div>
        <div class="ac-drawer-footer">
          <button class="ac-btn" data-action="close-modal">Cancelar</button>
          <button class="ac-btn primary" data-action="save-resident" data-id="${r.id || ""}">Guardar</button>
        </div>
      </div>
    </div>
  `;
}

function openVisitorDrawer({ mode, data, unit }) {
  const v = data || { name: "", unit: unit || ALL_UNITS[0], hostId: "", doc: "", reason: "" };

  document.getElementById("overlayRoot").innerHTML = `
    <div class="ac-overlay" data-action="close-modal">
      <div class="ac-drawer" data-stop="1">
        <div class="ac-drawer-header">
          <h3 class="ac-heading">${mode === "edit" ? "Editar visitante" : "Registrar visitante"}</h3>
          <button class="ac-btn ghost" data-action="close-modal" aria-label="Cerrar">${icon("x", 16)}</button>
        </div>
        <div class="ac-field">
          <label>Nombre completo</label>
          <input id="vis-name" value="${v.name}" placeholder="Nombre del visitante" />
          <div class="err" id="vis-name-err" style="display:none;"></div>
        </div>
        <div class="ac-field">
          <label>Unidad a visitar</label>
          <select id="vis-unit">${ALL_UNITS.map((u) => `<option value="${u}" ${u === v.unit ? "selected" : ""}>Depto ${u}</option>`).join("")}</select>
        </div>
        <div class="ac-field">
          <label>Residente que autoriza</label>
          <select id="vis-host">${buildHostOptions(v.unit, v.hostId)}</select>
        </div>
        <div class="ac-field">
          <label>Documento de identificación (opcional)</label>
          <input id="vis-doc" value="${v.doc || ""}" placeholder="INE, pasaporte..." />
        </div>
        <div class="ac-field">
          <label>Motivo de la visita (opcional)</label>
          <textarea id="vis-reason" rows="2" placeholder="Visita familiar, entrega, servicio...">${v.reason || ""}</textarea>
        </div>
        <div class="ac-drawer-footer">
          <button class="ac-btn" data-action="close-modal">Cancelar</button>
          <button class="ac-btn primary" data-action="save-visitor" data-id="${v.id || ""}">Guardar</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById("vis-unit").addEventListener("change", (e) => {
    document.getElementById("vis-host").innerHTML = buildHostOptions(e.target.value, "");
  });
}

function buildHostOptions(unit, selectedHostId) {
  const hosts = state.residents.filter((r) => r.unit === unit);
  const options = hosts
    .map((r) => `<option value="${r.id}" ${String(r.id) === String(selectedHostId) ? "selected" : ""}>${r.name}</option>`)
    .join("");
  return `<option value="">Sin especificar</option>${options}`;
}

function closeModal() {
  document.getElementById("overlayRoot").innerHTML = "";
}

function openConfirm({ type, id, name }) {
  document.getElementById("overlayRoot").innerHTML = `
    <div class="ac-confirm-wrap" data-action="close-modal">
      <div class="ac-confirm" data-stop="1">
        <h4 class="ac-heading">${type === "resident" ? "Eliminar residente" : "Eliminar visitante"}</h4>
        <p>¿Eliminar a "${name}"? Esta acción no se puede deshacer.</p>
        <div class="ac-confirm-actions">
          <button class="ac-btn" data-action="close-modal">Cancelar</button>
          <button class="ac-btn danger-solid" data-action="confirm-delete" data-type="${type}" data-id="${id}">Eliminar</button>
        </div>
      </div>
    </div>
  `;
}

/* ---------- Guardar / eliminar ---------- */

function saveResident(id) {
  const name = document.getElementById("res-name").value.trim();
  const phone = document.getElementById("res-phone").value.trim();
  const unit = document.getElementById("res-unit").value;
  const plate = document.getElementById("res-plate").value.trim();
  const status = document.getElementById("res-status").value;

  let ok = true;
  document.getElementById("res-name-err").style.display = "none";
  document.getElementById("res-phone-err").style.display = "none";
  if (!name) {
    document.getElementById("res-name-err").textContent = "Ingresa el nombre completo.";
    document.getElementById("res-name-err").style.display = "block";
    ok = false;
  }
  if (!phone) {
    document.getElementById("res-phone-err").textContent = "Ingresa un teléfono de contacto.";
    document.getElementById("res-phone-err").style.display = "block";
    ok = false;
  }
  if (!ok) return;

  if (id) {
    const r = state.residents.find((x) => x.id === Number(id));
    Object.assign(r, { name, phone, unit, plate, status });
  } else {
    state.residents.push({ id: nextId(), name, phone, unit, plate, status });
  }
  closeModal();
  render();
}

function saveVisitor(id) {
  const name = document.getElementById("vis-name").value.trim();
  const unit = document.getElementById("vis-unit").value;
  const hostId = document.getElementById("vis-host").value;
  const doc = document.getElementById("vis-doc").value.trim();
  const reason = document.getElementById("vis-reason").value.trim();

  document.getElementById("vis-name-err").style.display = "none";
  if (!name) {
    document.getElementById("vis-name-err").textContent = "Ingresa el nombre del visitante.";
    document.getElementById("vis-name-err").style.display = "block";
    return;
  }

  if (id) {
    const v = state.visitors.find((x) => x.id === Number(id));
    Object.assign(v, { name, unit, hostId, doc, reason });
  } else {
    const now = new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
    state.visitors.push({ id: nextId(), name, unit, hostId, doc, reason, entryTime: now, exitTime: null, status: "dentro" });
  }
  closeModal();
  render();
}

function checkoutVisitor(id) {
  const v = state.visitors.find((x) => x.id === Number(id));
  v.status = "salio";
  v.exitTime = new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
  render();
}

function deleteConfirmed(type, id) {
  if (type === "resident") {
    state.residents = state.residents.filter((r) => r.id !== Number(id));
  } else {
    state.visitors = state.visitors.filter((v) => v.id !== Number(id));
  }
  closeModal();
  render();
}

/* ---------- Delegación de eventos ---------- */

document.addEventListener("click", (e) => {
  const stopEl = e.target.closest("[data-stop]");
  const overlayEl = e.target.closest(".ac-overlay, .ac-confirm-wrap");
  if (overlayEl && !stopEl) {
    closeModal();
    return;
  }

  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const action = btn.dataset.action;

  switch (action) {
    case "switch-tab":
      state.tab = btn.dataset.tab;
      state.selectedUnit = null;
      render();
      break;
    case "select-unit":
      state.selectedUnit = state.selectedUnit === btn.dataset.unit ? null : btn.dataset.unit;
      renderEdificio();
      break;
    case "add-resident":
      openResidentDrawer({ mode: "new", unit: btn.dataset.unit });
      break;
    case "edit-resident": {
      const r = state.residents.find((x) => x.id === Number(btn.dataset.id));
      openResidentDrawer({ mode: "edit", data: r });
      break;
    }
    case "delete-resident": {
      const r = state.residents.find((x) => x.id === Number(btn.dataset.id));
      openConfirm({ type: "resident", id: r.id, name: r.name });
      break;
    }
    case "add-visitor":
      openVisitorDrawer({ mode: "new", unit: state.selectedUnit });
      break;
    case "edit-visitor": {
      const v = state.visitors.find((x) => x.id === Number(btn.dataset.id));
      openVisitorDrawer({ mode: "edit", data: v });
      break;
    }
    case "delete-visitor": {
      const v = state.visitors.find((x) => x.id === Number(btn.dataset.id));
      openConfirm({ type: "visitor", id: v.id, name: v.name });
      break;
    }
    case "checkout-visitor":
      checkoutVisitor(btn.dataset.id);
      break;
    case "close-modal":
      closeModal();
      break;
    case "save-resident":
      saveResident(btn.dataset.id);
      break;
    case "save-visitor":
      saveVisitor(btn.dataset.id);
      break;
    case "confirm-delete":
      deleteConfirmed(btn.dataset.type, btn.dataset.id);
      break;
  }
});

/* ---------- Arranque ---------- */

seed();
render();
