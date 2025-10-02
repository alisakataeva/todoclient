import Cookies from 'js-cookie'
    

const SERVER_BASE_PATH = `http://127.0.0.1:5000`
const API_PATH = '/api'


class RestAPI {

    constructor() {}

    get = (path) => {
        let url = `${SERVER_BASE_PATH}${API_PATH}${path}`
        return fetch(url, { method: 'GET' })
    }

    post = (path, request) => {
        let url = `${SERVER_BASE_PATH}${API_PATH}${path}`
        return fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken')
            },
            body: JSON.stringify({ ...request, auth_token: Cookies.get("auth_token")})
        })
    }

    getCredentials = () => {
        return this.post("/auth")
    }

    getTasks = (request) => {
        return this.post("/tasks", request)
    }

    createTask = (task) => {
        return this.post("/create", task)
    }

    updateTask = (task) => {
        return this.post("/update", task)
    }

    markTaskAsDone = (task_id) => {
        return this.post("/done", { task_id })
    }

    login = (request) => {
        return this.post("/login", request)
    }

    logout = () => {
        return this.post("/logout")
    }

}

const restAPI = new RestAPI();
Object.freeze(restAPI);
export default restAPI;