let frames = [];
let intervalId;
const INTERVAL = 1000;
let self;

class FramesView {
    constructor() {
        this.onChange();
        document
            .querySelector("#fps")
            .addEventListener("input", this.changeInterval);
    }

    onChange() {
        document.querySelector("#add").addEventListener("click", e => {
            e.preventDefault();
            this.addFrame();

            document.querySelectorAll("#preview div").forEach(d => {
                d.addEventListener("click", this.selectActiveFrame);
            });

            document.querySelectorAll("#delete").forEach(d => {
                d.addEventListener("click", this.deleteFrame);
            });

            document.querySelectorAll("#copy").forEach(d => {
                d.addEventListener("click", this.copyFrame);
            });
        });

        document.querySelectorAll("#canvas > div").forEach(d => {
            d.addEventListener("click", this.updatePreview);
        });
    }

    addFrame() {
        const item = {
            id: `frame-preview-${frames.length}`,
            color: "#ececf1",
            isActive: false
        };
        frames.push(item);
        self = this;
        this.renderFrames();
    }

    selectActiveFrame(e) {
        frames.forEach(item => {
            if (item.id == e.target.id) {
                item.isActive = true;
                e.target.classList.add("active");
                document.querySelector("#canvas > div").style.backgroundColor =
                    e.target.style.backgroundColor;
            }
            if (item.id != e.target.id && item.isActive == true) {
                document
                    .querySelector(`#${item.id}`)
                    .classList.remove("active");
                item.isActive = false;
            }
        });
    }

    deleteFrame(e) {
        frames = frames.filter(item => item.id != e.target.parentNode.id);
        e.target.parentNode.remove();
        let newFrames = [];
        frames.forEach(i => {
            (i.id = `frame-preview-${newFrames.length}`), newFrames.push(i);
        });
        frames = newFrames;
        self.renderFrames();
    }

    copyFrame(e) {
        frames.forEach(item => {
            if (item.id == e.target.parentNode.id) {
                const copied = {
                    id: `frame-preview-${frames.indexOf(item) + 1}`,
                    color: e.target.parentNode.style.backgroundColor,
                    isActive: false
                };
                frames.splice(frames.indexOf(item) + 1, 0, copied);
                return;
            }
        });

        let count = 0;
        frames.forEach(i => {
            i.id = `frame-preview-${count++}`;
        });
        self.renderFrames();
    }

    updatePreview(e) {
        window.setInterval(update, 500);
        function update() {
            const targetColor = e.target.style.backgroundColor;
            frames.forEach(item => {
                if (item.isActive == true) {
                    document.querySelector(
                        `#${item.id}`
                    ).style.backgroundColor = targetColor;
                    item.color = targetColor;
                }
            });
        }
    }

    renderFrames() {
        document.querySelector("#preview > section").innerHTML = "";
        const previews = document.createElement("div");
        previews.innerHTML = frames
            .map(
                item =>
                    `<div id=${item.id} class=${item.id}
                    style="background-color: ${item.color};">
                    <p>${frames.indexOf(item) + 1}</p>
                    <img id='delete' src='./assets/delete.png' alt='delete'/>
                    <img id='copy' src='./assets/copy.png'/ alt='copy'>
                    </div>`
            )
            .join("");
        document.querySelector("#preview > section").appendChild(previews);

        document.querySelectorAll("#preview div").forEach(d => {
            d.addEventListener("click", this.selectActiveFrame);
        });

        document.querySelectorAll("#delete").forEach(d => {
            d.addEventListener("click", this.deleteFrame);
        });

        document.querySelectorAll("#copy").forEach(d => {
            d.addEventListener("click", this.copyFrame);
        });
    }

    changeInterval(e) {
        if (e.target.value == "0") {
            window.clearInterval(intervalId);
            return;
        }
        window.clearInterval(intervalId);
        FramesView.startAnimation(e.target.value);
    }

    static startAnimation(value) {
        if (!frames.length) {
            return;
        }
        let colorIndex = 0;
        function animate() {
            document.querySelector("#animation").style.backgroundColor =
                frames[colorIndex].color;
            colorIndex = (colorIndex + 1) % frames.length;
        }
        intervalId = window.setInterval(animate, INTERVAL / value);
    }
}
