/** -------------------------------------------------------
* public/assets/js/app.js
* ---------------------------------------------------------
*/
(() => {
  const API_BASE = "https://geo.api.gouv.fr";

  const regionSelect = document.getElementById("region");
  const deptSelect   = document.getElementById("dept");

  /*
  if (!regionSelect || !deptSelect) {
    console.warn('Selects manquants : #region et/ou #dept introuvables.');
    return;
  }
*/

// Reset des <select>
function resetSelect(selectEl, placeholderText, disabled = false) {
    selectEl.innerHTML = "";
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = placeholderText;
    opt.disabled = true;
    opt.selected = true;
    selectEl.appendChild(opt);

    selectEl.disabled = disabled;
  }

  function addOptions(selectEl, items, { valueKey = "code", labelKey = "nom", labelFormatter } = {}) {
    const frag = document.createDocumentFragment();
    for (const item of items) {
      const opt = document.createElement("option");
      opt.value = item[valueKey];
      opt.textContent = labelFormatter ? labelFormatter(item) : item[labelKey];
      frag.appendChild(opt);
    }
    selectEl.appendChild(frag);
  }

  // Tri par code (gère "2A", "2B", "01", "971"...)
  function sortByCode(a, b) {
    return String(a.code).localeCompare(String(b.code), "fr", { numeric: true, sensitivity: "base" });
  }

  // Pour éviter des résultats en retard si l'utilisateur change vite
  let deptAbortController = null;

  async function loadRegions() {
    resetSelect(regionSelect, "Chargement des régions…", true);
    resetSelect(deptSelect, "Sélectionnez d'abord une région", true);

    try {
      // zone=metro,drom : tu peux ajouter ",com" si tu veux aussi les COM (option documentée côté API)
      const url = `${API_BASE}/regions?fields=nom&zone=metro,drom`;
      const res = await fetch(url, { headers: { "Accept": "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const regions = await res.json();

      regions.sort((a, b) => String(a.nom).localeCompare(String(b.nom), "fr", { sensitivity: "base" }));

      resetSelect(regionSelect, "— Choisissez une région —", false);
      addOptions(regionSelect, regions, {
        /* valueKey: "code", */
        /* labelFormatter: (r) => `${r.nom} (${r.code})`, */
        labelFormatter: (r) => `${r.nom}`,
      });

    } catch (e) {
      console.error("Erreur chargement régions:", e);
      resetSelect(regionSelect, "Impossible de charger les régions", true);
      resetSelect(deptSelect, "—", true);
    }
  }

  async function loadDepartements(regionCode) {
    if (!regionCode) {
      resetSelect(deptSelect, "Sélectionnez une région", true);
      return;
    }

    // Annule la requête précédente si elle existe
    if (deptAbortController) deptAbortController.abort();
    deptAbortController = new AbortController();

    resetSelect(deptSelect, "Chargement des départements…", true);

    try {
      const url = `${API_BASE}/regions/${encodeURIComponent(regionCode)}/departements?fields=nom,code&zone=metro,drom`;
      const res = await fetch(url, {
        signal: deptAbortController.signal,
        headers: { "Accept": "application/json" }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const depts = await res.json();

      depts.sort(sortByCode);

      resetSelect(deptSelect, "— Choisissez un département —", false);
      addOptions(deptSelect, depts, {
        valueKey: "code",
        labelFormatter: (d) => `${d.code} — ${d.nom}`
      });

    } catch (e) {
      if (e.name === "AbortError") return; // normal si l'utilisateur change vite
      console.error("Erreur chargement départements:", e);
      resetSelect(deptSelect, "Impossible de charger les départements", true);
    }
  }

  // 1) Au chargement
  document.addEventListener("DOMContentLoaded", loadRegions);

  // 2) Au changement de région
  regionSelect.addEventListener("change", (e) => {
    loadDepartements(e.target.value);
  });
})();