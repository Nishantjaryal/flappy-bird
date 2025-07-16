const Hole_Height = 150;
const pipe_make_interval = 1500;
let pipes = [];
const pipe_speed = 0.70
const pipe_width =75;
let timeSinceLastPipe = 0;
let passedPipeCount = 0;

const subtitle = document.querySelector("[data-subtitle]")
const subtitle2 = document.querySelector("[data-subtitle2]")


export function getPipeRects() {
    return pipes.flatMap(pipe => pipe.rects())
}

export function updatePipe(delta){
    timeSinceLastPipe += delta
    if(timeSinceLastPipe>pipe_make_interval){
        timeSinceLastPipe -= pipe_make_interval
        createPipe();
    }

    pipes.forEach(pipe => {
        if(pipe.left+pipe_width<0){
            passedPipeCount++;
            let prev_high = localStorage.getItem("pipe-count");
            localStorage.setItem("pipe-count",Math.max(prev_high,passedPipeCount));
            console.log(passedPipeCount)
            subtitle.textContent = `pipes: ${passedPipeCount} `
            subtitle2.textContent = `Highest: ${localStorage.getItem("pipe-count")} `
            return pipe.remove();

        }
        pipe.left = pipe.left - delta*pipe_speed
    })
}

export function resetScore() {
    passedPipeCount = 0;
    subtitle.textContent = "";
    pipes.forEach(pipe => pipe.remove())
}

function createPipe(){
    const pipeElem = document.createElement("div")
    const topElem = createPipeSegment("top");
    const bottomElem = createPipeSegment("bottom")
    pipeElem.append(topElem)
    pipeElem.append(bottomElem)
    pipeElem.classList.add("pipe")
    pipeElem.style.setProperty("--hole-top",randomNumberBetween(Hole_Height*1.5,window.innerHeight-Hole_Height*0.5))


    const pipe = {
        get left(){
            return parseFloat(getComputedStyle(pipeElem).getPropertyValue("--pipe-left"))
        },
        set left(val){
            pipeElem.style.setProperty("--pipe-left",val)
        },
        remove(){
            pipes = pipes.filter(p => p !== pipe)
            pipeElem.remove()
        },
        rects(){
            return[
                topElem.getBoundingClientRect(),
                bottomElem.getBoundingClientRect()
            ]
        }
    }

    pipe.left  = window.innerWidth
    document.body.append(pipeElem)
    pipes.push(pipe)
}

function createPipeSegment(position){
    const segment = document.createElement("div")
    segment.classList.add("segment",position)
    return segment
}


function randomNumberBetween(min,max){
    return Math.floor(Math.random()*(max-min+1)+min)
}