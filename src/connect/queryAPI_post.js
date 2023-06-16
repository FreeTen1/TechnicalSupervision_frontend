import React from "react"
import ProxyPass from "./ProsyPass"

async function queryAPI_post(data, query) {
    let res = await fetch(`${ProxyPass}/${query}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    })
    return await res
}

export default queryAPI_post
