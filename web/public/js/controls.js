let config = {
    selection: "",
    scopeFilter: "",
    includedLinks: {
        scope: false,
        hard: false,
        soft: false
    },
    force: {
        scope: 1,
        soft: 0.01,
        hard: 0.5
    },
    distance: {
        scope: 30,
        soft: 100,
        hard: 10
    },
    charge: {
        scope: -50,
        resource: -10
    },
    groups: null
};

(function handlers() {
    document.getElementById("definitions").onclick = displayDefinitions;
    document.getElementById("instances").onclick = displayInstances;

    document.getElementById("optionScope").addEventListener('change', (e) => { 
        config.includedLinks.scope = e.target.checked;
        if (config.includedLinks.scope) {
            document.getElementById("scopeLinkForce").removeAttribute("disabled");
            document.getElementById("scopeLinkDistance").removeAttribute("disabled"); 
        } else {
            document.getElementById("scopeLinkForce").setAttribute("disabled", "true"); 
            document.getElementById("scopeLinkDistance").setAttribute("disabled", "true"); 
        }
        window.dispatchEvent(new CustomEvent('updateType', { detail: config }));
    });

    document.getElementById("optionHard").addEventListener('change', (e) => { 
        config.includedLinks.hard = e.target.checked;
        if (config.includedLinks.hard) {
            document.getElementById("hardLinkForce").removeAttribute("disabled");
            document.getElementById("hardLinkDistance").removeAttribute("disabled"); 
        } else {
            document.getElementById("hardLinkForce").setAttribute("disabled", "true");
            document.getElementById("hardLinkDistance").setAttribute("disabled", "true"); 
        }
        window.dispatchEvent(new CustomEvent('updateType', { detail: config }));
    });
    document.getElementById("optionSoft").addEventListener('change', (e) => { 
        config.includedLinks.soft = e.target.checked;
        if (config.includedLinks.soft) {
            document.getElementById("softLinkForce").removeAttribute("disabled");
            document.getElementById("softLinkDistance").removeAttribute("disabled"); 
        } else {
            document.getElementById("softLinkForce").setAttribute("disabled", "true"); 
            document.getElementById("softLinkDistance").setAttribute("disabled", "true"); 
        }
        window.dispatchEvent(new CustomEvent('updateType', { detail: config }));
    });
    
    document.getElementById("scopeInput").addEventListener('change', (e) => { 
        config.scopeFilter = e.target.value;
        window.dispatchEvent(new CustomEvent('updateType', { detail: config }));
    });

    document.getElementById("scopeLinkForce").addEventListener('change', (e) => { 
        config.force.scope = +e.target.value;
        window.dispatchEvent(new CustomEvent('updateForce', { detail: config }));
    });
    document.getElementById("scopeLinkDistance").addEventListener('change', (e) => { 
        config.distance.scope = +e.target.value;
        window.dispatchEvent(new CustomEvent('updateForce', { detail: config }));
    });

    document.getElementById("hardLinkForce").addEventListener('change', (e) => { 
        config.force.hard = +e.target.value;
        window.dispatchEvent(new CustomEvent('updateForce', { detail: config }));
    });
    document.getElementById("hardLinkDistance").addEventListener('change', (e) => { 
        config.distance.hard = +e.target.value;
        window.dispatchEvent(new CustomEvent('updateForce', { detail: config }));
    });

    document.getElementById("softLinkForce").addEventListener('change', (e) => { 
        config.force.soft = +e.target.value;
        window.dispatchEvent(new CustomEvent('updateForce', { detail: config }));
    });
    document.getElementById("softLinkDistance").addEventListener('change', (e) => { 
        config.distance.soft = +e.target.value;
        window.dispatchEvent(new CustomEvent('updateForce', { detail: config }));
    });

    document.getElementById("scopeCharge").addEventListener('change', (e) => { 
        config.charge.scope = +e.target.value;
        window.dispatchEvent(new CustomEvent('updateCharge', { detail: config }));
    });
    document.getElementById("resourceCharge").addEventListener('change', (e) => { 
        config.charge.resource = +e.target.value;
        window.dispatchEvent(new CustomEvent('updateCharge', { detail: config }));
    });

    new ResizeObserver(() => window.dispatchEvent(new Event('resize'))).observe(document.getElementsByClassName("jumbotron-content")[0])

    window.dispatchEvent(new CustomEvent('updateType', { detail: config })); // init
})();

function displayDefinitions() {
    config.selection = "definitions";
    config.groups = ["definitions"];
    window.dispatchEvent(new CustomEvent('updateType', { detail: config }));
}

function displayInstances() {
    config.selection = "instances";
    config.groups = ["management", "catalog", "marketplace"];
    window.dispatchEvent(new CustomEvent('updateType', { detail: config }));
}
