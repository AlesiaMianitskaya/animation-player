let store = {
    curTool: "paint_bucket",
    curColor: "green",
    prevColor: "",
    divs: {}
};

function saveStore() {
    localStorage.setItem("store", JSON.stringify(store));
}

function loadStore() {
    try {
        const json = localStorage.getItem("store");
        store = JSON.parse(json) || store;
        document.querySelectorAll("#canvas > div").forEach(d => {
            if (store.divs[d.id]) {
                d.style.backgroundColor = store.divs[d.id].color;
                d.style.borderRadius = store.divs[d.id].border;
            }
        });
    } catch (err) {
        console.error(err);
    }
}

function paintBucket(e) {
    const id = e.target.id;

    e.target.style.backgroundColor = store.curColor;
    if (!store.divs[id]) {
        store.divs[id] = {};
    }
    store.divs[id].color = store.curColor;
    saveStore();
}

function chooseColor(e) {
    store.curColor = e.target.style.backgroundColor || "lightblue";
}

function transform(e) {
    const id = e.target.id;
    const style = e.target.style;

    if (style.borderRadius) {
        style.borderRadius = "";
    } else {
        style.borderRadius = "50%";
    }

    if (!store.divs[id]) {
        store.divs[id] = {};
    }
    store.divs[id].border = style.borderRadius;
    saveStore();
}

function dispatcher(e) {
    switch (store.curTool) {
        case "paint_bucket":
            return paintBucket(e);
        case "choose_color":
            return chooseColor(e);
        case "transform":
            return transform(e);
    }
}

function setTool(e) {
    if (e.target.tagName == "LI") {
        store.curTool = e.target.id;
        saveStore();
    }
}

// q - paint bucket, w - choose color, a - transform
function setToolByKey(e) {
    const tools = { 81: "paint_bucket", 87: "choose_color", 65: "transform" };
    store.curTool = tools[e.keyCode];
    saveStore();
}

function setColor(e) {
    store.prevColor = store.curColor;
    store.curColor = e.target.id;

    document.querySelector("#current>div").style.backgroundColor =
        store.curColor;
    document.querySelector("#prev>div").style.backgroundColor = store.prevColor;

    saveStore();
}

function init() {
    loadStore();

    const frameView = new FramesView();

    document.querySelectorAll("#canvas > div").forEach(d => {
        d.addEventListener("click", dispatcher);
        d.addEventListener("mousedown", dispatcher);
        d.addEventListener("mouseup", dispatcher);
    });

    document.addEventListener("keydown", setToolByKey);

    document.querySelector("#pallete").addEventListener("click", setTool);

    document
        .querySelectorAll("#color-config li")
        .forEach(li => li.addEventListener("click", setColor));
}

init();
