import { updateBird, setupBird, getBirdRect } from "./bird.js"
import { updatePipe,resetScore, getPipeRects } from "./pipe.js";
document.addEventListener("keypress", handleStart, { once: true })
const title = document.querySelector("[data-title]")
const subtitle = document.querySelector("[data-subtitle]")

let lastTime;
function updateLoop(time) {
    if (!lastTime) {
        lastTime = time;
    }
    const delta = parseFloat(time - lastTime);
    updateBird(delta)
    updatePipe(delta)
    if (checkLose()) return handleLose()
    lastTime = time;
    window.requestAnimationFrame(updateLoop)
}
function handleStart() {
    lastTime = null;

    title.classList.add("hide")
    resetScore();
    setupBird();

    window.requestAnimationFrame(updateLoop)
}
function checkLose() {
    const birdRect = getBirdRect();
    const res = getBirdRect().top < 0 || getBirdRect().bottom > window.innerHeight;
    const insidePipe = getPipeRects().some(rect=>isCollision(birdRect,rect))
    return res || insidePipe;
}
function handleLose() {
    setupBird();

    setTimeout(() => {
        title.classList.remove("hide");
        subtitle.classList.remove("hide");
        document.addEventListener("keypress", handleStart, { once: true }) 
    }, 100)



}

function isCollision(rect1,rect2) {
    return (
        rect1.left< rect2.right &&
        rect1.top< rect2.bottom &&
        rect1.right> rect2.left &&
        rect1.bottom> rect2.top 
    )
}