import app from "./app.js"

app.listen(app.get("PORT"), () => {
    console.log(`${app.get("name")} running on port: ${app.get("PORT")}`)
})
