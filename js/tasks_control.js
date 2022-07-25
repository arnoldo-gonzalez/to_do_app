const tasks = {}
const times = []
const taskPlace = document.getElementById("task-place")
const modal = document.getElementById("modal-notify")
let id = 0

export {modal, taskPlace}

export const normalizeTime = (time) => {
    let [hours, minutes] = time.split(":")
    let hoursHalf = "AM"

    if (parseInt(hours) > 12) {
	hours = parseInt(hours) - 12
	hoursHalf = "PM"
    }

    if (hours.length < 2) hours = "0" + hours

    if (parseInt(hours) === 12 && parseInt(minutes) > 0) hoursHalf = "PM"
    if (minutes.length < 2) minutes = "0" + minutes

    return hours + ":" + minutes + hoursHalf
}

export async function enableNotifications() {
    const permission = await Notification.requestPermission()
    modal.classList.remove("visible")
    if (permission === "granted") {
        setInterval(() => {
	    const currentDate = new Date()
	    const currentTime = normalizeTime(`${currentDate.getHours()}:${currentDate.getMinutes()}`)
	    console.log({currentTime, times})
	    if (times.includes(currentTime)) {
		const tasksToDo = Object.entries(tasks).filter( ([key, val]) => val !== null).filter( ([key, {time}]) => time === currentTime)
		tasksToDo.forEach(([key, {name}], i) => {
		    setTimeout(() => {
                        new Notification(`It's time of ${name}`, { body: `It's ${currentTime}, and is time of do the task named "${name}". I wish you luck doing that`})
  		        document.getElementById(key).classList.add("time-to-do")
		    }, i * 500)
		    tasks[key] = null
		})
                localStorage.setItem("tasks", JSON.stringify(tasks))
	    }
        }, 7000)
    }
}

export function removeTask(id, element) {
    tasks[id] = null
    taskPlace.removeChild(element.parentNode.parentNode)
    localStorage.setItem("tasks", JSON.stringify(tasks))
}

export default function addTask(data) {
    data.forEach( ({name, time}) => {
        const task = document.createElement("div")
        task.classList.add("taskPlace__task")
        task.innerHTML = `
        <div class="taskPlace__container-data">
            <p class="taskPlace__p"><span>Name: </span><span>${name}</span></p>
            <p class="taskPlace__p"><span>Time: </span><span>${time}</span></p>
        </div>
        <div class="taskPlace__container-btn">
            <button class="taskPlace__btn" id="${id}" name="del-task">Remove Task</button>
        </div>
        `
        taskPlace.appendChild(task)

        tasks[id] = {
            name,
            time,
        }

        times.push(time)

        id++
    })
    localStorage.setItem("tasks", JSON.stringify(tasks))
}
