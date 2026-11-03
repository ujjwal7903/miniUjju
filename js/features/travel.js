"use strict";

(() => {
  function initTravel() {
    const { places, postcardScenes } = window.MiniU;
    const state = { selected: "hyderabad" };
    const explorer = document.querySelector("#travel-explorer");
    const list = document.querySelector("#place-list");
    const placeCard = document.querySelector("#place-card");
    const announcement = document.querySelector("#travel-announcement");

    function renderSelection(announce = true) {
      const place = places.find((entry) => entry.id === state.selected);
      placeCard.hidden = !place;
      for (const button of explorer.querySelectorAll("[data-place]")) {
        button.setAttribute("aria-pressed", String(button.dataset.place === state.selected));
      }
      if (!place) return;

      document.querySelector("#place-region").textContent = `${place.area} / ${place.region}`;
      document.querySelector("#place-name").textContent = place.name;
      document.querySelector("#place-context").textContent = place.context;
      document.querySelector("#place-highlight").textContent = place.highlight;
      document.querySelector("#place-description").textContent = place.description;
      document.querySelector("#place-source").href = place.source;
      document.querySelector("#postcard-art").innerHTML = `<svg viewBox="0 0 335 150" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><rect width="335" height="150" fill="#edf0df"/><circle cx="270" cy="38" r="19" fill="#e8ce88"/>${postcardScenes[place.theme]}</svg>`;
      if (announce) announcement.textContent = `${place.name}. ${place.context} ${place.highlight} ${place.description}`;
    }

    function makePlaceButton(place, index, isPin) {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.place = place.id;
      button.setAttribute("aria-pressed", String(place.id === state.selected));
      if (isPin) {
        button.className = "map-pin";
        button.style.left = `${place.labelX ?? place.x}%`;
        button.style.top = `${place.labelY ?? place.y}%`;
        button.title = place.name;
        button.setAttribute("aria-label", `${place.name}. Show destination note`);
        const number = document.createElement("span");
        number.textContent = String(index + 1).padStart(2, "0");
        number.setAttribute("aria-hidden", "true");
        button.append(number);
      } else button.textContent = place.name;
      button.addEventListener("click", () => {
        state.selected = place.id;
        renderSelection();
      });
      return button;
    }

    function renderTravel() {
      list.replaceChildren();
      for (const country of ["india", "japan"]) {
        document.querySelector(`#${country}-pins`).replaceChildren();
        document.querySelector(`#${country}-leaders`).replaceChildren();
      }
      places.forEach((place, index) => {
        const country = place.region.toLowerCase();
        document.querySelector(`#${country}-pins`).append(makePlaceButton(place, index, true));
        const leaders = document.querySelector(`#${country}-leaders`);
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", place.x);
        line.setAttribute("y1", place.y);
        line.setAttribute("x2", place.labelX ?? place.x);
        line.setAttribute("y2", place.labelY ?? place.y);
        const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        dot.setAttribute("cx", place.x);
        dot.setAttribute("cy", place.y);
        dot.setAttribute("r", ".6");
        leaders.append(line, dot);
        list.append(makePlaceButton(place, index, false));
      });
      document.querySelector("#place-count").textContent = `${places.length} places`;
      announcement.textContent = "";
      renderSelection(false);
    }

    renderTravel();
    explorer.hidden = false;

    const countryMaps = document.querySelector(".country-maps");
    const travelRoute = document.querySelector(".travel-route");
    const travelRouteLine = document.querySelector("#travel-route-line");
    function updateTravelRoute() {
      const bounds = countryMaps.getBoundingClientRect();
      const points = places.map((place, index) => {
        const pin = countryMaps.querySelector(`[data-place="${place.id}"]`).getBoundingClientRect();
        const x = pin.left + pin.width / 2 - bounds.left;
        const y = pin.top + pin.height / 2 - bounds.top;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      });
      travelRoute.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);
      travelRouteLine.setAttribute("d", points.join(" "));
    }
    const atlasResizeObserver = new ResizeObserver(updateTravelRoute);
    atlasResizeObserver.observe(countryMaps);
    updateTravelRoute();
  }

  window.MiniU.initTravel = initTravel;
})();
