const options = { timeZone:'America/Los_Angeles', year: 'numeric', month: 'short', day: 'numeric' };
const dateFormatter = new Intl.DateTimeFormat('en-US', options); 

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
/**
 * @param {Number} num
 * @returns {String}
 */
function ordSuff(num) {
    if (num % 10 >= 4 || num % 10 === 0 || (num >= 11 && num <= 13) ) {
        return "th";
    } else if (num % 10 >= 3) {
        return "rd";
    } else if (num % 10 >= 2) {
        return "nd";
    } else {
        return "st";
    }
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
    const template = await fetchHTML('html/proj_webmap');
    let projectDiv = textToHTML(template);
    _e(projectDiv, "project-type-text").textContent = data.class;
    _e(projectDiv, "project-occasion-text").textContent = data.occasion;
    _e(projectDiv, "project-title").textContent = data.name;
    let pDate = new Date(`${data.date}T00:00:00-08:00`);
    let pDateStr = dateFormatter.format(pDate);
    let comi = pDateStr.indexOf(',');
    let suff = ordSuff(parseInt(pDateStr.substring(comi-2, comi)));
    pDateStr = `${pDateStr.slice(0, comi)}${suff}${pDateStr.slice(comi)}`
    _e(projectDiv, "project-date-text").textContent = pDateStr;
    _e(projectDiv, "project-preview-img").setAttribute("src", data.screenshotUrl);
    let descContainer = _e(projectDiv, "project-description-container");
    data.description.forEach((val, i, arr) => {
        let pEl = document.createElement("p");
        pEl.classList.add("project-description");
        pEl.textContent = val;
        descContainer.appendChild(pEl);
    });
    let liveUrl = data.liveLink;
    _e(projectDiv, "project-live-preview").setAttribute("src", liveUrl);
    _e(projectDiv, "project-link-line").setAttribute("href", liveUrl)
    _("content").appendChild(projectDiv);
}

async function loadHeader() {
    const headerHTML = await fetchHTML('html/header');
    // Get html of header
    // Get list of project names
    // Eventually put the list somewhere user-accessible
    document.body.insertAdjacentHTML("afterbegin", headerHTML);
}

async function loadFooter() {
    const footerHTML = await fetchHTML('html/footer');
    document.body.insertAdjacentHTML("afterend", footerHTML);
}

window.addEventListener('load', () => {
    loadHeader();
    loadFooter();
    params = new URLSearchParams(window.location.search);
    if (params.has('projectid')) {
        loadProject(params.get('projectid'));
    }
});
