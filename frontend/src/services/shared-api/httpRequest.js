// Generic http method to use across the webpage.
import { api } from "./apiSetup"

export const http = {
    get: (url, config = {}) => api.get(url, config),

    post: (url, data, config = {}) => api.post(url, data, config),
    put: (url, data, config = {}) => api.put(url, data, config),
    patch: (url, data, config = {}) => api.patch(url, data, config),
    delete: (url, data, config = {}) => api.delete(url, data, config),
}