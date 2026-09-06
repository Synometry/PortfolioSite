/**
 * @param {Element} element
 * @param {string} id
 * @returns {Element}
 **/
function $e(element, id) { return element.querySelector(`#${id}`) }

/**
 * @param {string} id
 * @returns {Element}
 **/
function $(id) { return document.getElementById(id); }

/**
 * @param {Element} element
 * @param {string} className
 * @returns {Element}
 **/
function _e(element, className) { return element.getElementsByClassName(className)[0]; }

/**
 * @param {string} className
 * @returns {Element}
 **/
function _(className) { return document.getElementsByClassName(className)[0]; }

function _a(className) { return document.getElementsByClassName(className); }

function isObj(o) {
    return typeof o === 'object' && !Array.isArray(o) && o !== null
}

async function fetchHTML(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.text();
    } catch (error) {
        console.error(`Could not load HTML file at \'${path}\':`, error);
    }
}
/**
 * @param {string} text
 * @returns {Element}
 **/
function textToHTML(text) {
    const tempDiv = document.createElement("div");
    tempDiv.insertAdjacentHTML("afterbegin", text);
    result = tempDiv.firstChild;
    tempDiv.removeChild(result);
    return result;
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
        return;
    }
    const template = await fetchHTML('template/proj_webmap');
    let projectDiv = textToHTML(template);
    _e(projectDiv, "project-type-text").textContent = data.class;
    _e(projectDiv, "project-occasion-text").textContent = data.class;
    _e(projectDiv, "project-title").textContent = data.name;
    _e(projectDiv, "project-type-text").textContent = data.class;
    _e(projectDiv, "project-type-text").textContent = data.class;
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
