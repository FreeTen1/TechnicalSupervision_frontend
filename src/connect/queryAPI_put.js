import React from "react"
import ProxyPass from "./ProsyPass"

async function queryAPI_put(data, query) {
    let res = await fetch(`${ProxyPass}/${query}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    })
    return await res
}

export default queryAPI_put
