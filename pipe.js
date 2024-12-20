const Hole_Height = 100;
const pipe_make_interval = 1500;
let pipes = [];
const pipe_speed = 0.75
const pipe_width =100;
let timeSinceLastPipe = 0;
let passedPipeCount = 0;

const subtitle = document.querySelector("[data-subtitle]")

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
            console.log(passedPipeCount)
            subtitle.textContent = `${passedPipeCount} pipes`
            return pipe.remove();

        }
        pipe.left = pipe.left - delta*pipe_speed
    })
}

export function resetScore() {
    passedPipeCount = 0;
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