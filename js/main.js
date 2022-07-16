import addTask, {modal, taskPlace, normalizeTime, removeTask, enableNotifications} from "./tasks_control.js"

const html = document.getElementsByTagName("html")[0]
const btnTheme = document.getElementById("btn-theme")
const icons = btnTheme.querySelectorAll("i")
const form = document.getElementById("task-form")
const btnsModal = document.querySelectorAll(".modal button")
const {mode, tasks} = localStorage

window.addEventListener("load", () => {
    if (mode) {
	html.classList.toggle("dark-mode")
	icons.forEach(icon => icon.classList.toggle("visible"))
    }

    if (tasks) {
        const tasksObj = JSON.parse(tasks)
	const tasksFiltered = Object.values(tasksObj).filter(e => e !== null)
	addTask(tasksFiltered)
    }

    if (Notification.permission !== "granted") modal.classList.add("visible")
    else enableNotifications()
})

btnTheme.addEventListener("click", e => {
    html.classList.toggle("dark-mode")
    icons.forEach(icon => icon.classList.toggle("visible"))
    localStorage.getItem("mode") ? localStorage.removeItem("mode") : localStorage.setItem("mode", "dark-mode")
})

form.addEventListener("submit", e => {
    e.preventDefault()

    const data = new FormData(form)
    const objData = Object.fromEntries(data.entries())
    objData.time = normalizeTime(objData.time)
    addTask([objData])
    form.reset()
})

taskPlace.addEventListener("click", e => {
    if (e.target.name === "del-task") removeTask(e.target.id, e.target)
})

btnsModal.forEach(e => e.addEventListener("click", e => {
    const action = e.currentTarget.dataset.action
    if (action === "close") modal.classList.remove("visible")
    else enableNotifications()
}))
