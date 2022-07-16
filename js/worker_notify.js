self.addEventListener("message", e => {
    setTimeout(() => {
        new Notification(`It's time of ${e.data.name}`, { body: `It's ${e.data.currentTime}, and is time of do the task named "${e.data.name}". I wish you luck doing that`})
    }, e.data.i * 500)
})
