function isObj(o) {
    return typeof o === 'object' && !Array.isArray(o) && o !== null
}

let manifest;

async function getProjectManifest() {
    if (isObj(manifest)) {
        return manifest;
    } else {
        try {
            const response = await fetch('./projmanifest.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            manifest = await response.json();
            return manifest;
        } catch (error) {
            console.error("Could not load JSON file:", error);
        }
    }
}

async function loadProject(projectid) {
    man = await getProjectManifest();
    let data;
    try {
        if (!man.hasOwnProperty(projectid)) throw new Error(`No property ${projectid} in value \'man\'`);
        data = man[projectid];
    } catch (error) {
        console.error("Could not load project data with id \'", projectid, "\':", error);
    }
}

async function loadHeader() {
    // Get html of header
    // Get list of project names
    // Eventually put the list somewhere user-accessible
}

window.addEventListener('load', () => {
    params = new URLSearchParams(window.location.search);
    if (params.has('projectid')) {
        loadProject(params.get('projectid'));
    }
});
